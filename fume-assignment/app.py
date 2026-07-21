import streamlit as st
import os
import json
import google.generativeai as genai

# Configure the Streamlit page
st.set_page_config(layout="wide", page_title="FUME Client Intelligence")

# Hide standard Streamlit header and footer to make it look like a pure web app
hide_st_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            header {visibility: hidden;}
            </style>
            """
st.markdown(hide_st_style, unsafe_allow_html=True)

# Function to load and inject static files into the HTML
def load_and_inject_html(injected_json_str="null"):
    base_dir = os.path.dirname(__file__)
    
    with open(os.path.join(base_dir, "styles.css"), "r", encoding="utf-8") as f:
        css_content = f.read()
        
    with open(os.path.join(base_dir, "app.js"), "r", encoding="utf-8") as f:
        js_content = f.read()
        
    with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
        html_content = f.read()

    # Add the injected JSON data before app.js runs
    injection_script = f"<script>window.INJECTED_DASHBOARD_DATA = {injected_json_str};</script>"

    # Replace external links with inline content so Streamlit can render it in an iframe
    html_content = html_content.replace(
        '<link rel="stylesheet" href="styles.css">', 
        f'<style>{css_content}</style>'
    )
    html_content = html_content.replace(
        '<script src="app.js"></script>', 
        f'{injection_script}\n<script>{js_content}</script>'
    )
    
    return html_content

def get_system_prompt():
    base_dir = os.path.dirname(__file__)
    schema_path = os.path.join(base_dir, "prompt_and_schema.md")
    with open(schema_path, "r", encoding="utf-8") as f:
        return f.read()

# Sidebar for configuration and inputs
st.sidebar.title("Coach Control Panel")
api_key = st.sidebar.text_input("Gemini API Key", type="password", help="Enter your Gemini API Key")
st.sidebar.markdown("---")
st.sidebar.subheader("Upload Conversation")

chat_input = st.sidebar.text_area("Paste WhatsApp Chat Export", height=300, help="Paste the raw chat text between Coach and Client here.")
analyze_btn = st.sidebar.button("Analyze Conversation", type="primary")

dashboard_data_str = "null"

if analyze_btn:
    if not api_key:
        st.sidebar.error("Please provide a Gemini API Key.")
    elif not chat_input.strip():
        st.sidebar.error("Please paste a conversation to analyze.")
    else:
        with st.spinner("Analyzing conversation with Gemini..."):
            try:
                genai.configure(api_key=api_key)
                # Use Gemini 1.5 Pro or Flash
                model = genai.GenerativeModel(
                    model_name="gemini-1.5-flash",
                    system_instruction="You are an expert Health & Wellness AI Assistant analyzing client-coach conversations. Output ONLY valid JSON."
                )
                
                # We append the schema and instructions to the user prompt
                prompt = f"""
                Here are the rules and the JSON schema you MUST follow:
                {get_system_prompt()}
                
                ---
                
                Transcript to analyze:
                {chat_input}
                """
                
                response = model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        response_mime_type="application/json",
                    ),
                )
                
                dashboard_data_str = response.text
                
                # Quick validation to ensure it's valid JSON
                llm_json = json.loads(response.text)
                
                # Map the LLM output to the dashboard format expected by app.js
                mapped_data = {
                    "summary": {
                        "text": llm_json.get("weekly_summary", {}).get("text", "No summary provided."),
                        "source": llm_json.get("weekly_summary", {}).get("source_type", "inference")
                    },
                    "metrics": [
                        {
                            "title": "Nutrition Adherence",
                            "icon": "ph-apple-logo",
                            "value": llm_json.get("metrics", {}).get("nutrition_adherence", {}).get("value", "N/A"),
                            "unit": "",
                            "source": llm_json.get("metrics", {}).get("nutrition_adherence", {}).get("source_type", "missing"),
                            "badge": f"badge-{llm_json.get('metrics', {}).get('nutrition_adherence', {}).get('source_type', 'missing')}",
                            "confidence": llm_json.get("metrics", {}).get("nutrition_adherence", {}).get("confidence_score", "")
                        },
                        {
                            "title": "Avg Sleep",
                            "icon": "ph-moon",
                            "value": llm_json.get("metrics", {}).get("average_sleep_hrs", {}).get("value", "N/A"),
                            "unit": "hrs",
                            "source": llm_json.get("metrics", {}).get("average_sleep_hrs", {}).get("source_type", "missing"),
                            "badge": f"badge-{llm_json.get('metrics', {}).get('average_sleep_hrs', {}).get('source_type', 'missing')}"
                        },
                        {
                            "title": "Avg Steps",
                            "icon": "ph-sneaker",
                            "value": llm_json.get("metrics", {}).get("average_steps", {}).get("value", "N/A"),
                            "unit": "steps",
                            "source": llm_json.get("metrics", {}).get("average_steps", {}).get("source_type", "missing"),
                            "badge": f"badge-{llm_json.get('metrics', {}).get('average_steps', {}).get('source_type', 'missing')}"
                        },
                        {
                            "title": "Water Intake",
                            "icon": "ph-drop",
                            "value": llm_json.get("metrics", {}).get("water_intake_liters", {}).get("value", "N/A"),
                            "unit": "liters",
                            "source": llm_json.get("metrics", {}).get("water_intake_liters", {}).get("source_type", "missing"),
                            "badge": f"badge-{llm_json.get('metrics', {}).get('water_intake_liters', {}).get('source_type', 'missing')}"
                        }
                    ],
                    "insights": {
                        "barriers": [{"title": "Barrier", "desc": b, "source": "reported"} for b in llm_json.get("key_barriers", [])],
                        "flags": [
                            {
                                "title": f.get("issue", "Risk"),
                                "desc": f.get("issue", ""),
                                "risk": f.get("risk_level", "medium"),
                                "source": f.get("source_type", "inference"),
                                "evidence": f.get("evidence", "")
                            } for f in llm_json.get("risk_flags", [])
                        ],
                        "missing": [{"title": "Missing Info", "desc": m, "source": "missing"} for m in llm_json.get("missing_information", [])]
                    },
                    "action": {
                        "title": "Recommended Coach Action",
                        "desc": llm_json.get("recommended_coach_action", {}).get("action", "No action suggested."),
                        "source": llm_json.get("recommended_coach_action", {}).get("source_type", "inference"),
                        "draft": llm_json.get("recommended_coach_action", {}).get("draft_reply", "Hi there, I noticed a few updates. Let's discuss!")
                    }
                }
                
                dashboard_data_str = json.dumps(mapped_data)
                st.sidebar.success("Analysis complete!")
                
            except Exception as e:
                st.sidebar.error(f"Error during analysis: {e}")

# Render the custom HTML/CSS/JS inside Streamlit
injected_html = load_and_inject_html(dashboard_data_str)
st.components.v1.html(injected_html, height=900, scrolling=True)

import streamlit as st
import os

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
def load_and_inject_html():
    base_dir = os.path.dirname(__file__)
    
    with open(os.path.join(base_dir, "styles.css"), "r") as f:
        css_content = f.read()
        
    with open(os.path.join(base_dir, "app.js"), "r") as f:
        js_content = f.read()
        
    with open(os.path.join(base_dir, "index.html"), "r") as f:
        html_content = f.read()

    # Replace external links with inline content so Streamlit can render it in an iframe
    html_content = html_content.replace(
        '<link rel="stylesheet" href="styles.css">', 
        f'<style>{css_content}</style>'
    )
    html_content = html_content.replace(
        '<script src="app.js"></script>', 
        f'<script>{js_content}</script>'
    )
    
    return html_content

# Render the custom HTML/CSS/JS inside Streamlit
injected_html = load_and_inject_html()
st.components.v1.html(injected_html, height=900, scrolling=True)

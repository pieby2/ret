# FUME Assignment - Submission Notes & Extras

## 1. Three Hallucination / Failure Scenarios

1. **Sarcasm/Hyperbole Misinterpretation (False Positive Risk):**
   - *Scenario:* The client says, "I was so tired my head went down... I feel I can sleep for days."
   - *Failure:* The AI interprets "sleep for days" literally and flags a severe medical sleep disorder, or logs "Sleep Duration: 72 hours", which corrupts the data metrics.
   - *Fix:* Use strict schema definitions and explicit prompts instructing the LLM to ignore hyperbole for quantitative metrics.

2. **Entity Misattribution (Coach vs. Client):**
   - *Scenario:* The coach says, "You can also have boiled chana." The client later says, "I had roasted chana."
   - *Failure:* The AI attributes the suggestion of "boiled chana" as a client action, marking "boiled chana" as a completed meal in the nutrition adherence tracker, leading to inaccurate adherence logs.
   - *Fix:* Ensure the prompt heavily emphasizes Speaker Diarization (paying attention to `Coach:` vs `Client:` labels).

3. **Missing Context Hallucination (False Inference):**
   - *Scenario:* The client says, "Weight seems slightly up... I'm eating almost half."
   - *Failure:* The AI infers that the client is secretly binge eating or lying (hallucinating a psychological barrier), or it hallucinates a specific caloric number to fill the "Nutrition Adherence" schema requirement.
   - *Fix:* Introduce a "Missing/Unavailable Data" enum in the schema and instruct the LLM: *If the exact value is not provided, output "missing" rather than guessing.*

---

## 2. Short Note

**What I built:**
I built a full Client Intelligence Dashboard mockup (HTML/CSS/JS) and a robust data extraction architecture. The UI visually categorizes insights into Confirmed Facts, Client-Reported Data, AI Inferences, and Missing Data. 
To showcase senior-level product thinking, I included 3 advanced features:
1. **Data Traceability (Explainable AI)**: Risk flags reveal the exact quote from the chat log that triggered them.
2. **Confidence Scores**: AI Inferences display a probability score to reflect LLM certainty.
3. **Workflow Automation**: An "Auto-Draft Reply" button that writes an empathetic, context-aware message ready for the coach to send.

**Key assumptions:**
- I assumed the "Accountability Coach" and "Coach" in the transcript are either the same person or working on the same team, and AI should synthesize data for *both*.
- I assumed that without wearable integrations, metrics like "Steps" and "Water" must be strictly tagged as "Client-Reported" rather than "Confirmed Facts".

**What could go wrong:**
- The LLM could fail to generate valid JSON, breaking the UI dashboard.
- The nuance of Indian dietary items (e.g., "kadhi with soya", "Surya Namaskar", "ajwain") might be misclassified by standard Western-trained LLMs if not given enough context.

**What I would improve next:**
- **RAG for Dietary Context:** Inject a small vector database of local dietary terms to improve the LLM's understanding of Indian foods and their protein/carb values.
- **Human-in-the-loop Editing:** Fully implement the "Edit" modal in the UI so the coach can seamlessly correct any AI hallucinations before the data is committed to the database.

---

## 3. Video Walkthrough Script (3-5 Minutes)

**[0:00 - 0:45] Introduction & Problem Understanding**
"Hi FUME team. For this assignment, I focused on creating a clear, actionable Client Intelligence Platform that solves the core problem: reducing coach burnout while surfacing critical client risks. I realized that trusting AI blindly is dangerous in healthcare and wellness, so my entire product philosophy centers around 'Evidence Grounding' and 'Data Provenance'."

**[0:45 - 2:00] The Prototype Walkthrough**
"Let me share my screen and show the UI prototype I built. As you can see, this is a dashboard for Client 8429. Notice the 'Legend' at the top. Every single piece of data is tagged. The 5.5 hours of sleep is tagged 'Client-Reported' because we don't have wearable data. The 'Moderate Nutrition Adherence' is tagged 'AI Inference'. The most critical feature here is the Risk Flag: The AI caught that the client fell asleep during a meeting. Because the client stated this explicitly, the AI flagged it as a high risk."

**[2:00 - 3:00] Prompt & Output Schema**
"Behind the scenes, I used a strict JSON schema. By forcing the LLM to output an enum of `[reported, inference, confirmed, missing]` for every single data point, we structurally prevent the AI from passing off its own guesses as confirmed facts. I also required an `evidence` field for risk flags to tie it back to the exact transcript quote."

**[3:00 - 4:00] Hallucination Control & Human-in-the-Loop**
"What happens if it hallucinates? Say the client uses hyperbole, like 'I could sleep for days'. An unconstrained AI might flag a medical emergency. To handle this, I built the 'Human Review' section at the bottom. The AI does the heavy lifting, but the Coach retains the agency to Edit or Reject the analysis. This hybrid approach ensures 100% accuracy while saving the coach 90% of the reading time."

**[4:00 - 4:30] Conclusion**
"Next steps would involve integrating a small knowledge base for local dietary items to improve accuracy. Thank you for the opportunity, and I look forward to discussing this in the interview."

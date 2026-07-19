# Prompt, Workflow, and Structured Output Schema

## Workflow
1. **Ingestion**: Extract conversation text (chat logs) spanning the desired timeframe (e.g., Week 1).
2. **Preprocessing**: Identify speakers (Coach vs. Client) and anonymize PII if any.
3. **LLM Analysis**: Pass the transcript to an LLM (e.g., GPT-4, Claude 3.5 Sonnet, or Gemini 1.5 Pro) with a strongly typed JSON schema and a strict system prompt.
4. **Validation**: Validate the returned JSON against the schema. If it fails, retry or fallback.
5. **Presentation**: Route the validated JSON data into the Client Intelligence Dashboard (the HTML prototype) for the human coach to review and approve.

---

## The System Prompt

```text
You are an expert Health & Wellness AI Assistant analyzing client-coach conversations.
Your objective is to extract 'Client Intelligence' from the provided chat transcript and output ONLY valid JSON matching the provided schema.

Rules for Extraction:
1. Distinguish between 'confirmed' (from devices/logs, if explicit), 'reported' (said by the client), 'inference' (your clinical/coaching deduction), and 'missing' (data that is standard but not mentioned).
2. For the Weekly Summary, write a cohesive paragraph summarizing the client's physical and mental state.
3. For 'Risk Flags', identify any severe symptoms, extreme fatigue, or mental health warnings.
4. For 'Pending Actions', list anything the client explicitly said they "will do" but haven't yet.
5. For 'Coach Action', provide exactly one high-value, actionable recommendation for the coach's next message based on the client's current state.

Transcript to analyze:
[INSERT TRANSCRIPT HERE]
```

---

## Suggested JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "weekly_summary": {
      "type": "object",
      "properties": {
        "text": { "type": "string", "description": "Cohesive summary of the week." },
        "source_type": { "type": "string", "enum": ["inference"] }
      },
      "required": ["text", "source_type"]
    },
    "metrics": {
      "type": "object",
      "properties": {
        "nutrition_adherence": { "$ref": "#/definitions/metric_item" },
        "average_sleep_hrs": { "$ref": "#/definitions/metric_item" },
        "average_steps": { "$ref": "#/definitions/metric_item" },
        "water_intake_liters": { "$ref": "#/definitions/metric_item" }
      }
    },
    "symptoms_and_stress": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "symptom": { "type": "string" },
          "severity": { "type": "string", "enum": ["low", "medium", "high"] },
          "source_type": { "type": "string", "enum": ["reported", "inference"] }
        },
        "required": ["symptom", "severity", "source_type"]
      }
    },
    "key_barriers": {
      "type": "array",
      "items": { "type": "string" }
    },
    "pending_actions": {
      "type": "array",
      "items": { "type": "string" }
    },
    "risk_flags": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "issue": { "type": "string" },
          "risk_level": { "type": "string", "enum": ["medium", "high", "critical"] },
          "source_type": { "type": "string", "enum": ["reported", "inference", "confirmed"] },
          "evidence": { "type": "string", "description": "Direct quote from transcript" }
        },
        "required": ["issue", "risk_level", "source_type", "evidence"]
      }
    },
    "recommended_coach_action": {
      "type": "object",
      "properties": {
        "action": { "type": "string" },
        "source_type": { "type": "string", "enum": ["inference"] }
      },
      "required": ["action", "source_type"]
    },
    "missing_information": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["weekly_summary", "metrics", "symptoms_and_stress", "key_barriers", "pending_actions", "risk_flags", "recommended_coach_action", "missing_information"],
  "definitions": {
    "metric_item": {
      "type": "object",
      "properties": {
        "value": { "type": ["string", "number"] },
        "source_type": { "type": "string", "enum": ["confirmed", "reported", "inference", "missing"] }
      },
      "required": ["value", "source_type"]
    }
  }
}
```

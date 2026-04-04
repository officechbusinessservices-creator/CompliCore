def run(payload: dict) -> dict:
    objective = payload.get("objective", "Advance opportunity")
    return {
        "objective": objective,
        "drafts": [
            {
                "channel": "email",
                "subject": "Quick follow-up",
                "body": f"Hi there — following up to {objective.lower()}. Are you available for a 20-minute call?",
            }
        ],
    }

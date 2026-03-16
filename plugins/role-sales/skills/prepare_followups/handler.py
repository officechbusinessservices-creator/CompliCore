from packages.shared.run_store import list_actions, list_contacts, list_opportunities


def run(payload: dict) -> dict:
    workspace = payload.get("workspace", "complicore")
    opportunities = list_opportunities(workspace=workspace)
    contacts = list_contacts(workspace=workspace)
    pending_actions = [a for a in list_actions(workspace=workspace) if a["status"] == "pending_approval"]

    contact_lookup = {c["id"]: c for c in contacts}
    followups = []
    for item in opportunities[:10]:
        contact = contact_lookup.get(item.get("contact_id"), {})
        followups.append(
            {
                "opportunity_id": item["id"],
                "opportunity": item["name"],
                "contact": contact.get("full_name", "Unknown"),
                "email": contact.get("email"),
                "recommended_message": f"Checking in on next step: {item.get('next_step') or 'alignment call'}",
            }
        )

    return {"workspace": workspace, "followups": followups, "pending_approvals": pending_actions}

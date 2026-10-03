from typing import List, Dict, Any

def calculate_milestones(delivery_type: str) -> List[Dict[str, Any]]:
    if delivery_type == "issued":
        return [
            {
                "key": "delivery_and_retirement",
                "pct": 100.0,
                "status": "funded"
            }
        ]
    # Forward credits: 30/40/30 milestones
    return [
        {
            "key": "Contract Signing",
            "pct": 30.0,
            "status": "funded"
        },
        {
            "key": "Mid-season Verification",
            "pct": 40.0,
            "status": "pending"
        },
        {
            "key": "Issuance Delivery",
            "pct": 30.0,
            "status": "pending"
        }
    ]

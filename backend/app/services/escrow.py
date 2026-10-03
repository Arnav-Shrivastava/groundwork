from typing import List, Dict, Any

def calculate_milestones() -> List[Dict[str, Any]]:
    return [
        {
            "key": "signing",
            "pct": 30.0,
            "status": "funded"
        },
        {
            "key": "planting_verified",
            "pct": 40.0,
            "status": "pending"
        },
        {
            "key": "mrv_verified",
            "pct": 30.0,
            "status": "pending"
        }
    ]

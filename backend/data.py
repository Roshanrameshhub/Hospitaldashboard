import random
from datetime import datetime, timedelta

random.seed(42)

DEPARTMENTS = ["ER", "ICU", "Pharmacy", "Radiology", "Billing"]
ISSUE_TYPES = ["Equipment", "Complaint", "Delay", "Cleaning", "IT"]
PRIORITIES = ["High", "Medium", "Low"]
STATUSES = ["Open", "In Progress", "Resolved"]
STAFF = ["Nurse A", "Nurse B", "Nurse C", "Nurse D", "Nurse E"]
SHIFTS = ["Morning", "Afternoon", "Night"]

SLA_LIMITS = {
    "High": 60,
    "Medium": 240,
    "Low": 1440,
}

NOW = datetime(2026, 3, 1, 14, 0, 0)


def generate_tickets(n=200):
    tickets = []
    seven_days_ago = NOW - timedelta(days=7)

    for i in range(1, n + 1):
        created = seven_days_ago + timedelta(
            seconds=random.randint(0, int(7 * 24 * 3600))
        )
        department = random.choice(DEPARTMENTS)
        issue_type = random.choice(ISSUE_TYPES)
        priority = random.choices(PRIORITIES, weights=[25, 45, 30])[0]
        status = random.choices(STATUSES, weights=[20, 15, 65])[0]
        staff = random.choice(STAFF)

        hour = created.hour
        if 6 <= hour < 14:
            shift = "Morning"
        elif 14 <= hour < 22:
            shift = "Afternoon"
        else:
            shift = "Night"

        resolved_datetime = None
        if status == "Resolved":
            sla_limit = SLA_LIMITS[priority]
            if random.random() < 0.78:
                resolution_minutes = random.randint(10, sla_limit)
            else:
                resolution_minutes = random.randint(sla_limit + 1, sla_limit * 3)
            resolved_datetime = created + timedelta(minutes=resolution_minutes)
            if resolved_datetime > NOW:
                resolved_datetime = NOW

        tickets.append({
            "ticket_id": f"TKT-{i:04d}",
            "department": department,
            "issue_type": issue_type,
            "priority": priority,
            "status": status,
            "created_datetime": created.isoformat(),
            "resolved_datetime": resolved_datetime.isoformat() if resolved_datetime else None,
            "staff_assigned": staff,
            "shift": shift,
        })

    return tickets


def generate_staff_details():
    doctor_names = [
        "Dr. Sarah Mitchell", "Dr. James Chen", "Dr. Priya Sharma",
        "Dr. Michael Brown", "Dr. Elena Rodriguez", "Dr. David Kim",
        "Dr. Amanda Foster", "Dr. Robert Taylor", "Dr. Lisa Wang",
        "Dr. Thomas Anderson", "Dr. Fatima Al-Hassan", "Dr. Kevin O'Brien",
        "Dr. Maria Santos", "Dr. Andrew Park", "Dr. Rachel Green",
    ]
    specs = {
        "ER": "Emergency Medicine", "ICU": "Critical Care",
        "Pharmacy": "Clinical Pharmacy", "Radiology": "Diagnostic Radiology",
        "Billing": "Healthcare Admin",
    }
    doctors = []
    for i, name in enumerate(doctor_names):
        dept = DEPARTMENTS[i % len(DEPARTMENTS)]
        doctors.append({
            "id": f"DOC-{i+1:03d}", "name": name, "role": "Doctor",
            "department": dept, "specialization": specs[dept],
            "status": random.choices(["Active", "On Leave"], weights=[85, 15])[0],
            "patients_assigned": random.randint(5, 25),
        })

    nurse_names = [
        "Nurse A", "Nurse B", "Nurse C", "Nurse D", "Nurse E",
        "Nurse F", "Nurse G", "Nurse H", "Nurse I", "Nurse J",
    ]
    nurses = []
    for i, name in enumerate(nurse_names):
        dept = DEPARTMENTS[i % len(DEPARTMENTS)]
        nurses.append({
            "id": f"NRS-{i+1:03d}", "name": name, "role": "Nurse",
            "department": dept, "shift": SHIFTS[i % len(SHIFTS)],
            "status": random.choices(["Active", "On Leave"], weights=[85, 15])[0],
            "patients_assigned": random.randint(8, 20),
        })

    tech_names = [
        "Tech Alpha", "Tech Bravo", "Tech Charlie", "Tech Delta",
        "Tech Echo", "Tech Foxtrot", "Tech Golf", "Tech Hotel",
    ]
    tech_roles = [
        "Lab Technician", "Radiology Tech", "Pharmacy Tech",
        "IT Support", "Equipment Tech",
    ]
    technicians = []
    for i, name in enumerate(tech_names):
        dept = DEPARTMENTS[i % len(DEPARTMENTS)]
        technicians.append({
            "id": f"TECH-{i+1:03d}", "name": name,
            "role": tech_roles[i % len(tech_roles)],
            "department": dept,
            "status": random.choices(["Active", "On Leave"], weights=[85, 15])[0],
        })

    return {"doctors": doctors, "nurses": nurses, "technicians": technicians}


def generate_patients():
    data = []
    for dept in DEPARTMENTS:
        current = random.randint(20, 60)
        crit = random.randint(2, 10)
        data.append({
            "department": dept,
            "current_count": current,
            "admitted_today": random.randint(3, 15),
            "discharged_today": random.randint(2, 12),
            "critical": crit,
            "stable": current - crit,
        })
    return data


tickets = generate_tickets()
staff_details = generate_staff_details()
patients = generate_patients()

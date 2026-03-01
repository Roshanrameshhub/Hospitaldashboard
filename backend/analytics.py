from datetime import datetime, timedelta
from collections import defaultdict, Counter
from data import SLA_LIMITS, NOW


def _parse_dt(s):
    return datetime.fromisoformat(s)


def _resolution_minutes(ticket):
    if ticket["resolved_datetime"]:
        created = _parse_dt(ticket["created_datetime"])
        resolved = _parse_dt(ticket["resolved_datetime"])
        return (resolved - created).total_seconds() / 60
    return None


def _is_breach(ticket):
    mins = _resolution_minutes(ticket)
    if mins is not None:
        return mins > SLA_LIMITS[ticket["priority"]]
    return False


# ── KPIs ──────────────────────────────────────────────────────────────

def get_kpis(tickets):
    total = len(tickets)
    open_issues = sum(1 for t in tickets if t["status"] in ("Open", "In Progress"))
    resolved = sum(1 for t in tickets if t["status"] == "Resolved")

    resolution_times = [_resolution_minutes(t) for t in tickets if _resolution_minutes(t) is not None]
    sla_breaches = sum(1 for t in tickets if t["status"] == "Resolved" and _is_breach(t))

    avg_resolution = sum(resolution_times) / len(resolution_times) if resolution_times else 0
    sla_compliance = ((resolved - sla_breaches) / resolved * 100) if resolved > 0 else 100

    return {
        "total_issues": total,
        "open_issues": open_issues,
        "resolved_issues": resolved,
        "avg_resolution_time_minutes": round(avg_resolution, 1),
        "sla_compliance_percent": round(sla_compliance, 1),
        "total_sla_breaches": sla_breaches,
    }


# ── Workload ──────────────────────────────────────────────────────────

def get_workload(tickets):
    dept_total = Counter(t["department"] for t in tickets)
    dept_open = Counter(t["department"] for t in tickets if t["status"] in ("Open", "In Progress"))

    return [
        {"department": dept, "total": dept_total.get(dept, 0), "open": dept_open.get(dept, 0)}
        for dept in ["ER", "ICU", "Pharmacy", "Radiology", "Billing"]
    ]


# ── Resolution Trend ─────────────────────────────────────────────────

def get_resolution_trend(tickets):
    trend = []
    for i in range(6, -1, -1):
        date = (NOW - timedelta(days=i)).date()
        count = sum(
            1 for t in tickets
            if t["status"] == "Resolved" and t["resolved_datetime"]
            and _parse_dt(t["resolved_datetime"]).date() == date
        )
        trend.append({"date": date.isoformat(), "resolved": count})
    return trend


# ── Distributions ────────────────────────────────────────────────────

def get_priority_distribution(tickets):
    counter = Counter(t["priority"] for t in tickets)
    return [{"priority": p, "count": counter.get(p, 0)} for p in ["High", "Medium", "Low"]]


def get_issue_type_analysis(tickets):
    counter = Counter(t["issue_type"] for t in tickets)
    return [{"issue_type": it, "count": counter.get(it, 0)} for it in ["Equipment", "Complaint", "Delay", "Cleaning", "IT"]]


def get_shift_analysis(tickets):
    counter = Counter(t["shift"] for t in tickets)
    return [{"shift": s, "count": counter.get(s, 0)} for s in ["Morning", "Afternoon", "Night"]]


# ── Staff Performance ────────────────────────────────────────────────

def get_staff_performance(tickets):
    staff_data = defaultdict(lambda: {
        "handled": 0, "resolved": 0, "resolution_times": [],
        "breaches": 0, "open": 0,
    })

    for t in tickets:
        s = t["staff_assigned"]
        staff_data[s]["handled"] += 1
        if t["status"] == "Resolved" and t["resolved_datetime"]:
            staff_data[s]["resolved"] += 1
            mins = _resolution_minutes(t)
            staff_data[s]["resolution_times"].append(mins)
            if _is_breach(t):
                staff_data[s]["breaches"] += 1
        if t["status"] in ("Open", "In Progress"):
            staff_data[s]["open"] += 1

    result = []
    for staff, d in staff_data.items():
        avg_time = sum(d["resolution_times"]) / len(d["resolution_times"]) if d["resolution_times"] else 0
        sla_rate = ((d["resolved"] - d["breaches"]) / d["resolved"] * 100) if d["resolved"] > 0 else 100
        score = round(
            (sla_rate * 0.5)
            + ((1 - min(avg_time, 1440) / 1440) * 100 * 0.3)
            + (min(d["handled"], 50) / 50 * 100 * 0.2),
            1,
        )
        result.append({
            "staff": staff,
            "issues_handled": d["handled"],
            "avg_resolution_time": round(avg_time, 1),
            "sla_compliance_rate": round(sla_rate, 1),
            "performance_score": score,
            "open_tickets": d["open"],
        })

    result.sort(key=lambda x: x["performance_score"], reverse=True)

    top = result[0]["staff"] if result else None
    overloaded = max(result, key=lambda x: x["open_tickets"])["staff"] if result else None
    underutilized = min(result, key=lambda x: x["issues_handled"])["staff"] if result else None

    return {
        "staff": result,
        "top_performer": top,
        "overloaded_staff": overloaded,
        "underutilized_staff": underutilized,
    }


# ── SLA ──────────────────────────────────────────────────────────────

def get_sla_breaches(tickets):
    breaches = []
    for t in tickets:
        if t["status"] == "Resolved" and _is_breach(t):
            mins = _resolution_minutes(t)
            breaches.append({
                "ticket_id": t["ticket_id"],
                "department": t["department"],
                "priority": t["priority"],
                "staff_assigned": t["staff_assigned"],
                "resolution_time_minutes": round(mins, 1),
                "sla_limit_minutes": SLA_LIMITS[t["priority"]],
                "breach_amount_minutes": round(mins - SLA_LIMITS[t["priority"]], 1),
            })
    return breaches


def get_sla_trend(tickets):
    trend = []
    for i in range(6, -1, -1):
        date = (NOW - timedelta(days=i)).date()
        breaches = sum(
            1 for t in tickets
            if t["status"] == "Resolved" and t["resolved_datetime"]
            and _parse_dt(t["resolved_datetime"]).date() == date
            and _is_breach(t)
        )
        total_resolved = sum(
            1 for t in tickets
            if t["status"] == "Resolved" and t["resolved_datetime"]
            and _parse_dt(t["resolved_datetime"]).date() == date
        )
        compliance = round((total_resolved - breaches) / total_resolved * 100, 1) if total_resolved > 0 else 100
        trend.append({
            "date": date.isoformat(),
            "breaches": breaches,
            "resolved": total_resolved,
            "compliance": compliance,
        })
    return trend


# ── Alerts ───────────────────────────────────────────────────────────

def get_alerts(tickets):
    alerts = []
    dept_high_open = defaultdict(int)
    for t in tickets:
        if t["priority"] == "High" and t["status"] in ("Open", "In Progress"):
            dept_high_open[t["department"]] += 1

    for dept, count in dept_high_open.items():
        if count > 5:
            alerts.append({
                "type": "overload", "severity": "critical",
                "message": f"{dept} has {count} open high-priority tickets — immediate attention required!",
                "department": dept, "count": count,
            })
        elif count > 3:
            alerts.append({
                "type": "warning", "severity": "warning",
                "message": f"{dept} has {count} open high-priority tickets — monitor closely.",
                "department": dept, "count": count,
            })

    shift_counts = Counter(t["shift"] for t in tickets)
    peak_shift = shift_counts.most_common(1)[0] if shift_counts else None
    if peak_shift:
        alerts.append({
            "type": "insight", "severity": "info",
            "message": f"{peak_shift[0]} shift has the highest ticket volume ({peak_shift[1]} tickets).",
        })

    sla_pct = get_kpis(tickets)["sla_compliance_percent"]
    if sla_pct < 80:
        alerts.append({
            "type": "sla_warning", "severity": "critical",
            "message": f"SLA compliance is critically low at {sla_pct}%!",
        })
    elif sla_pct < 90:
        alerts.append({
            "type": "sla_warning", "severity": "warning",
            "message": f"SLA compliance is below target at {sla_pct}%.",
        })

    return alerts


# ── Prediction ───────────────────────────────────────────────────────

def get_prediction(tickets):
    daily_counts = []
    for i in range(3, 0, -1):
        date = (NOW - timedelta(days=i)).date()
        count = sum(
            1 for t in tickets
            if _parse_dt(t["created_datetime"]).date() == date
        )
        daily_counts.append(count)

    predicted = round(sum(daily_counts) / len(daily_counts)) if daily_counts else 0
    risk = "High" if predicted > 40 else "Medium" if predicted > 25 else "Low"

    return {
        "last_3_days": daily_counts,
        "predicted_issue_count": predicted,
        "risk_level": risk,
    }


# ── NEW: Recent Activity ────────────────────────────────────────────

def get_recent_activity(tickets, limit=20):
    sorted_tickets = sorted(tickets, key=lambda t: t["created_datetime"], reverse=True)
    activities = []
    for t in sorted_tickets[:limit]:
        if t["status"] == "Resolved":
            action = "Resolved"
        elif t["status"] == "Open":
            action = "Opened"
        else:
            action = "In Progress"
        activities.append({
            "ticket_id": t["ticket_id"],
            "department": t["department"],
            "action": action,
            "priority": t["priority"],
            "staff": t["staff_assigned"],
            "timestamp": t["resolved_datetime"] or t["created_datetime"],
            "issue_type": t["issue_type"],
        })
    return activities


# ── NEW: Patient Stats ──────────────────────────────────────────────

def get_patient_stats(patients_data):
    total = sum(p["current_count"] for p in patients_data)
    critical = sum(p["critical"] for p in patients_data)
    admitted = sum(p["admitted_today"] for p in patients_data)
    discharged = sum(p["discharged_today"] for p in patients_data)
    return {
        "total_patients": total,
        "critical_patients": critical,
        "admitted_today": admitted,
        "discharged_today": discharged,
        "departments": patients_data,
    }


# ── NEW: Staff Stats ───────────────────────────────────────────────

def get_staff_stats(staff_details):
    all_staff = staff_details["doctors"] + staff_details["nurses"] + staff_details["technicians"]
    active = sum(1 for s in all_staff if s["status"] == "Active")
    on_leave = sum(1 for s in all_staff if s["status"] == "On Leave")

    by_role = {
        "doctors": len(staff_details["doctors"]),
        "nurses": len(staff_details["nurses"]),
        "technicians": len(staff_details["technicians"]),
    }

    by_dept = {}
    for s in all_staff:
        dept = s["department"]
        by_dept[dept] = by_dept.get(dept, 0) + 1

    return {
        "total_staff": len(all_staff),
        "active_staff": active,
        "on_leave": on_leave,
        "by_role": by_role,
        "by_department": [{"department": d, "count": c} for d, c in by_dept.items()],
        "details": staff_details,
    }

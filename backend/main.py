from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data import tickets, staff_details, patients
from analytics import (
    get_kpis,
    get_workload,
    get_resolution_trend,
    get_priority_distribution,
    get_issue_type_analysis,
    get_shift_analysis,
    get_staff_performance,
    get_sla_breaches,
    get_sla_trend,
    get_alerts,
    get_prediction,
    get_recent_activity,
    get_patient_stats,
    get_staff_stats,
)

app = FastAPI(title="Hospital Administrative Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/kpis")
def kpis():
    return get_kpis(tickets)


@app.get("/workload")
def workload():
    return get_workload(tickets)


@app.get("/resolution-trend")
def resolution_trend():
    return get_resolution_trend(tickets)


@app.get("/priority-distribution")
def priority_distribution():
    return get_priority_distribution(tickets)


@app.get("/issue-type-analysis")
def issue_type_analysis():
    return get_issue_type_analysis(tickets)


@app.get("/shift-analysis")
def shift_analysis():
    return get_shift_analysis(tickets)


@app.get("/staff-performance")
def staff_performance():
    return get_staff_performance(tickets)


@app.get("/sla-breaches")
def sla_breaches():
    return get_sla_breaches(tickets)


@app.get("/sla-trend")
def sla_trend():
    return get_sla_trend(tickets)


@app.get("/alerts")
def alerts():
    return get_alerts(tickets)


@app.get("/prediction")
def prediction():
    return get_prediction(tickets)


@app.get("/recent-activity")
def recent_activity():
    return get_recent_activity(tickets)


@app.get("/patients")
def patients_route():
    return get_patient_stats(patients)


@app.get("/staff-details")
def staff_details_route():
    return get_staff_stats(staff_details)

import os

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
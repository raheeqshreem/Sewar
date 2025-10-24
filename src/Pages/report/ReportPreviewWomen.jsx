import React from "react";

// WeeklyCaseReport.jsx

export default function ReportPreviewWomen() 
{ 
  const turquoiseBorder = { border: "1px solid #2a7371", padding: "8px" };
  const largeBox = { minHeight: "220px", border: "1px solid #2a7371", padding: "12px", background: "#fff" }; 
  const headerStyle = { textAlign: "center", fontWeight: 600, margin: "50px 0", color: "#2a7371" };

  return (
    <div className="container" style={{ fontFamily: "serif", fontSize: "16px", fontWeight: 600, color: "#2a7371", lineHeight: 1.5, paddingTop: "100px" }}>
      <h4 style={headerStyle}>Weekly case Report Guide</h4>

      {/* Subjective block */}
      <div className="row mb-2" style={{ marginBottom: 8 }}>
        <div className="col-12" style={turquoiseBorder}>

          {/* Date / Week field */}
          <div className="mb-2">
            <label className="mb-0">Date :</label>
            <div style={{  minHeight: 24 }} />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div style={{ width: "25%" }}>
              <label className="mb-0">Patient name:</label>
              <div style={{ borderBottom: "1px solid #2a7371", minHeight: 24 }} />
            </div>
            <div style={{ width: "15%" }}>
              <label className="mb-0">Age:</label>
              <div style={{ borderBottom: "1px solid #2a7371", minHeight: 24 }} />
            </div>
            <div style={{ width: "15%" }}>
              <label className="mb-0">Gender:</label>
              <div style={{ borderBottom: "1px solid #2a7371", minHeight: 24 }} />
            </div>
            <div style={{ width: "40%" }}>
              <label className="mb-0">Occupation:</label>
              <div style={{ borderBottom: "1px solid #2a7371", minHeight: 24 }} />
            </div>
          </div>

          <div className="mt-2">
            <label className="mb-0">Diagnosis :-</label>

            <div className="mt-3">
              <label className="mb-0">Medical diagnosis</label>
              <textarea className="form-control" rows={3} style={{ borderColor: "#2a7371" }} />
            </div>

            <div className="mt-3">
              <label className="mb-0">Physiotherapy diagnosis</label>
              <textarea className="form-control" rows={3} style={{ borderColor: "#2a7371" }} />
            </div>

            <div style={{ borderBottom: "1px solid #2a7371", minHeight: 24 }} />
          </div>

          <div className="mt-3">
            <label className="mb-0">Present history (briefly)</label>
            <textarea className="form-control" rows={3} style={{ borderColor: "#2a7371" }} />
          </div>
        </div>
      </div>

      {/* باقي الكود كما هو دون تغيير */}
      {/* Past medical history */}
      <div className="row mb-3">
        <div className="col-12" style={{ ...turquoiseBorder }}>
          <h6 className="mt-1">Past medical history</h6>
          <div className="row text-center">
            <div className="col-md-3 p-2" style={{ borderRight: "1px solid #2a7371" }}>
              <strong>Chronic diseases</strong>
              <div style={{ minHeight: 80 }} />
            </div>
            <div className="col-md-3 p-2" style={{ borderRight: "1px solid #2a7371" }}>
              <strong>Medications</strong>
              <div style={{ minHeight: 80 }} />
            </div>
            <div className="col-md-3 p-2" style={{ borderRight: "1px solid #2a7371" }}>
              <strong>Previous surgeries</strong>
              <div style={{ minHeight: 80 }} />
            </div>
            <div className="col-md-3 p-2">
              <strong>Family history</strong>
              <div style={{ minHeight: 80 }} />
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-0">Social history: <small className="text-muted">(how his condition affects environment and work life including family accommodation and transportation)</small></label>
            <textarea className="form-control" rows={3} style={{ borderColor: "#2a7371" }} />
          </div>

          <div className="mt-3">
            <label className="mb-0">Other investigations findings (lab, X-ray, other imaging)</label>
            <div style={{ border: "1px solid #2a7371", minHeight: 40, padding: 8 }} />
          </div>
        </div>
      </div>

      {/* Objectives: Observation findings */}
      <div className="row mb-3">
        <div className="col-12" style={{ ...turquoiseBorder }}>
          <label className="mb-0">Objectives :-</label>
          <h6 className="mt-1"> Observation findings : </h6>
          <div style={{ minHeight: 30 }} />
        </div>
      </div>

      {/* Big objective findings block */}
      <div className="row mb-3">
        <div className="col-12" style={largeBox}>
          <div style={{ minHeight: 12 }} />
          <p><strong>Palpation findings</strong></p>
          <div style={{ borderBottom: "1px dashed #2a7371", marginBottom: 12 }} />

          <p><strong>Pain assessment findings</strong></p>
          <div style={{ borderBottom: "1px dashed #2a7371", marginBottom: 12 }} />

          <p><strong>Sensation findings</strong></p>
          <div style={{ borderBottom: "1px dashed #2a7371", marginBottom: 12 }} />

          <p><strong>Joints and muscle circumference findings</strong></p>
          <div style={{ borderBottom: "1px dashed #2a7371", marginBottom: 12 }} />

          <p><strong>ROM Findings</strong></p>
          <div style={{ borderBottom: "1px dashed #2a7371", marginBottom: 12 }} />

          <p><strong>MMT findings</strong></p>
          <div style={{ borderBottom: "1px dashed #2a7371", marginBottom: 12 }} />

          <p><strong>Reflexes findings</strong></p>
          <div style={{ borderBottom: "1px dashed #2a7371", marginBottom: 12 }} />

          <p><strong>Special test findings</strong></p>
          <div style={{ borderBottom: "1px dashed #2a7371" }} />
        </div>
      </div>

      {/* Assessment evaluation */}
      <div className="row mb-3">
        <div className="col-12" style={turquoiseBorder}>
          <h6 className="mt-1">Assessment evaluation :-</h6>
          <label>List of problem : </label>
          <div style={{ border: "1px solid #2a7371", minHeight: 120, padding: 8 }} />
        </div>
      </div>

      {/* Goals */}
      <div className="row mb-3">
        <h6 className="mt-1">Goals :-</h6>
        <div className="col-md-6" style={{ border: "1px solid #2a7371", padding: 12 }}>
          <h6>Short term goals</h6>
          <div style={{ minHeight: 120 }} />
        </div>
        <div className="col-md-6" style={{ border: "1px solid #2a7371", padding: 12 }}>
          <h6>Long term goals</h6>
          <div style={{ minHeight: 120 }} />
        </div>
      </div>

      {/* Plan of care */}
      <div className="row mb-4">
        <div className="col-12" style={{ border: "1px solid #2a7371", padding: 12 }}>
          <h6>Plan of care : </h6>
          <div style={{ minHeight: 260 }} />
        </div>
      </div>

      {/* Home Program */}
      <div className="row mb-4">
        <div className="col-12" style={{ border: "1px solid #2a7371", padding: 12 }}>
          <h6>Home Program : </h6>
          <div style={{ minHeight: 260 }} />
        </div>
      </div>

      {/* Footer / notes */}
      <div className="row">
        <div className="col-12 text-right text-muted">PT.Sewar shreem</div>
      </div>
    </div>
  );
}
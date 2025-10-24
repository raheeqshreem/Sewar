import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function FormCaseReportWomen() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: "",
    clinicalPlacement: "",
    supervisor: "",
    dateWeek: "",
    patientName: "",
    age: "",
    gender: "",
    occupation: "",
    diagnosis: "",
    presentHistory: "",
    chronicDiseases: "",
    medications: "",
    previousSurgeries: "",
    familyHistory: "",
    socialHistory: "",
    investigations: "",
    observation: "",
    palpation: "",
    painAssessment: "",
    sensation: "",
    jointsCircumference: "",
    rom: "",
    mmt: "",
    reflexes: "",
    specialTests: "",
    assessment: "",
    problems: "",
    shortTermAims: "",
    longTermAims: "",
    planOfCare: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/report", { state: { formData } });
  };

  // 🎨 تنسيقات موحدة للحقل
  const inputStyle = {
    border: "2px solid #2a7371",
    borderRadius: "7px",
    color: "#2a7371",
    backgroundColor: "#f9f9f9",
    textAlign: "right",
  };

  const labelStyle = {
    color: "#2a7371",
    fontWeight: "bold",
  };

  return (
    <Container className="my-5" style={{ maxWidth: "900px", paddingTop: "100px" }}>
      <h2 className="text-center mb-4" style={{ color: "#2a7371" }}>
        Weekly Case Report Form
      </h2>

      {/* ✅ التاريخ الحالي */}
      <Form.Group className="mb-4">
        <Form.Label style={labelStyle}>Date</Form.Label>
        <div>
          <Form.Control
            type="text"
            value={new Date().toLocaleDateString("en-GB")}
            readOnly
            style={{
              ...inputStyle,
              width: "200px",
              height: "40px",
              textAlign: "center",
              fontWeight: "500",
              display: "inline-block",
            }}
          />
        </div>
      </Form.Group>

      <Form onSubmit={handleSubmit}>
        {/* Subjective */}
        <h5 className="mt-4" style={{ color: "#2a7371", fontWeight: "bold" }}>Subjective</h5>
        <Row className="mb-3">
          {["patientName", "age", "gender", "occupation"].map((field, idx) => (
            <Col key={idx}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                </Form.Label>
                <Form.Control name={field} onChange={handleChange} style={inputStyle} />
              </Form.Group>
            </Col>
          ))}
        </Row>

        <h5 className="mt-4" style={{ color: "#2a7371", fontWeight: "bold" }}>Diagnosis</h5>
        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>Medical diagnosis</Form.Label>
          <Form.Control as="textarea" rows={2} name="diagnosis" onChange={handleChange} style={inputStyle} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>Physiotherapy diagnosis</Form.Label>
          <Form.Control as="textarea" rows={2} name="physioDiagnosis" onChange={handleChange} style={inputStyle} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>Present history (briefly)</Form.Label>
          <Form.Control as="textarea" rows={3} name="presentHistory" onChange={handleChange} style={inputStyle} />
        </Form.Group>

        {/* Past Medical History */}
        <h5 className="mt-4" style={{ color: "#2a7371", fontWeight: "bold" }}>Past medical history</h5>
        {["chronicDiseases", "medications", "previousSurgeries", "familyHistory"].map((field, idx) => (
          <Form.Group className="mb-3" key={idx}>
            <Form.Label style={labelStyle}>
              {field.replace(/([A-Z])/g, " $1")}
            </Form.Label>
            <Form.Control as="textarea" rows={2} name={field} onChange={handleChange} style={inputStyle} />
          </Form.Group>
        ))}

        {/* Social History */}
        <h5 className="mt-4" style={{ color: "#2a7371", fontWeight: "bold" }}>Social history</h5>
        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>How the condition affects environment and work life</Form.Label>
          <Form.Control as="textarea" rows={3} name="socialHistory" onChange={handleChange} style={inputStyle} />
        </Form.Group>

        {/* Other Investigations */}
        <h5 className="mt-4" style={{ color: "#2a7371", fontWeight: "bold" }}>Other investigations</h5>
        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>Investigations</Form.Label>
          <Form.Control as="textarea" rows={2} name="investigations" onChange={handleChange} style={inputStyle} />
        </Form.Group>

        {/* Objectives */}
        <h5 className="mt-4" style={{ color: "#2a7371", fontWeight: "bold" }}>Objectives</h5>
        {[
          "Palpation Findings",
          "Pain Assessment Findings",
          "Sensation Findings",
          "Joints and Muscle circumference findings",
          "ROM Findings",
          "MMT Findings",
          "Reflexes Findings",
          "Special Test Findings",
        ].map((field, index) => (
          <Form.Group className="mb-3" key={index}>
            <Form.Label style={labelStyle}>{field}</Form.Label>
            <Form.Control as="textarea" rows={2} name={field} onChange={handleChange} style={inputStyle} />
          </Form.Group>
        ))}

        {/* Assessment Evaluation */}
        <h5 className="mt-4" style={{ color: "#2a7371", fontWeight: "bold" }}>Assessment Evaluation</h5>
        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>List of problems</Form.Label>
          <Form.Control as="textarea" rows={2} name="problems" onChange={handleChange} style={inputStyle} />
        </Form.Group>

        {/* Goals */}
        <h5 className="mt-4" style={{ color: "#2a7371", fontWeight: "bold" }}>Goals</h5>
        {[
          { label: "Short term goals", name: "shortTermAims" },
          { label: "Long term goals", name: "longTermAims" },
          { label: "Plan of care", name: "planOfCare" },
          { label: "Home program", name: "homeProgram" },
        ].map((item, idx) => (
          <Form.Group className="mb-3" key={idx}>
            <Form.Label style={labelStyle}>{item.label}</Form.Label>
            <Form.Control as="textarea" rows={2} name={item.name} onChange={handleChange} style={inputStyle} />
          </Form.Group>
        ))}

        <div className="text-center mt-4">
          <button
            className="btn px-4 py-2 fw-bold"
            style={{
              backgroundColor: "#2a7371",
              color: "beige",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Submit
          </button>
        </div>
      </Form>
    </Container>
  );
}
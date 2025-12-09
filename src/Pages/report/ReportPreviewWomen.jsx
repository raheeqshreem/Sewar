 import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function ReportPreviewWomen() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const accentColor = "#2a7371"; // أي لون يناسب التصميم
  const turquoiseBorder = { border: "1px solid #2a7371", padding: "8px" };
  const largeBox = { minHeight: "220px", border: "1px solid #2a7371", padding: "12px", background: "#fff" };
  const headerStyle = { textAlign: "center", fontWeight: 600, margin: "50px 0", color: "#2a7371" };
const [otherImages, setOtherImages] = useState([]);
const [zoomImage, setZoomImage] = useState(null);
  // 🔹 كل البيانات رح تنحفظ هون
  
  
  
  
  
  
  
  
  const [formData, setFormData] = useState({
    date: "",
    patientName: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    diagnosis: "",
    medicalDiagnosis: "",
    physioDiagnosis: "",
    presentHistory: "",
    chronicDiseases: "",
    medications: "",
    surgeries: "",
    familyHistory: "",
    socialHistory: "",
    otherFindings: "",
    observationFindings: "",
    palpationFindings: "",
    painFindings: "",
    sensationFindings: "",
    jointsFindings: "",
    romFindings: "",
    mmtFindings: "",
    reflexFindings: "",
    specialTestFindings: "",
    listOfProblem: "",
    shortGoals: "",
    longGoals: "",
    planOfCare: "",
    homeProgram: ""
  });
const [planImages, setPlanImages] = useState([]);
const [homeImages, setHomeImages] = useState([]);






// 🔹 متابعة أي تحديث للـ homeImages
useEffect(() => {
  console.log("HomeImages updated:", homeImages);
}, [homeImages]);


useEffect(() => {
  console.log("PlanImages updated:", planImages);
}, [planImages]);




useEffect(() => {
  const savedDraft = localStorage.getItem("reportDraft_" + reportId);

  if (savedDraft) {
    setFormData(JSON.parse(savedDraft));
  }
}, [reportId]);

useEffect(() => {
  const fetchReport = async () => {
    try {
      const response = await axios.get(
        `https://sewarwellnessclinic1.runasp.net/api/FilesPage/report-details/${reportId}`
      );

      const data = response.data;

      const apiData = {
        patientName: data.childInfo?.fullname || "",
        gender: data.name === 0 ? "Kid" : data.name === 1 ? "Women" : "",
        occupation: data.childInfo?.occupation || "",
        dateOfBirth: data.childInfo?.birthDate ? data.childInfo.birthDate.split("T")[0] : "",
        diagnosis: data.caseReport?.dignosis || "",
        presentHistory: data.caseReport?.present_History || "",
        chronicDiseases: data.caseReport?.chronic_Disease || "",
        medications: data.caseReport?.medication || "",
        surgeries: data.caseReport?.previous_Surgeries || "",
        familyHistory: data.caseReport?.family_History || "",
        socialHistory: data.caseReport?.social_History || "",
        otherFindings: data.caseReport?.other_Investigations || "",

        observationFindings: data.objectivesAndFindings?.observation || "",
        palpationFindings: data.objectivesAndFindings?.palpation || "",
        painFindings: data.objectivesAndFindings?.pain_assesment || "",
        sensationFindings: data.objectivesAndFindings?.sensation || "",
        jointsFindings: data.objectivesAndFindings?.join_muscle_circufernec || "",
        romFindings: data.objectivesAndFindings?.rom_findings || "",
        mmtFindings: data.objectivesAndFindings?.mmt_findings || "",
        reflexFindings: data.objectivesAndFindings?.reflexes || "",
        specialTestFindings: data.objectivesAndFindings?.special_tests || "",
        date: data.date ? data.date.split("T")[0] : "",

        listOfProblem: data.assesment?.problemlist || "",
        shortGoals: data.assesment?.shortTermText || "",
        longGoals: data.assesment?.longTermText || "",
        planOfCare: data.assesment?.planOfcareText || "",
        homeProgram: data.assesment?.homeprogrem || "",

        medicalDiagnosis: data.caseReport?.dignosis || "",
        physioDiagnosis: data.caseReport?.phDignosis || ""
      };

      const draft = localStorage.getItem("reportDraft_" + reportId);
      const draftData = draft ? JSON.parse(draft) : {};

      setFormData({
        ...apiData,
        ...draftData
      });

      setOtherImages(data.caseReport?.cimages || []);
      setPlanImages(data.assesment?.aimages || []);
      setHomeImages(data.objectivesAndFindings?.oimages || []);
    } catch (err) {
      console.error(err);
      alert("فشل جلب بيانات التقرير من السيرفر.");
    }
  };

  fetchReport();
}, [reportId]);



  // 🔹 دالة التغيير لأي حقل
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    const updated = { ...prev, [name]: value };

    // ✨ احفظ التغييرات في localStorage
    localStorage.setItem("reportDraft_" + reportId, JSON.stringify(updated));

    return updated;
  });
};

  // 🔹 دالة الإرسال (زر الحفظ)
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // نبني FormData
    const formDataToSend = new FormData();

    // الحقول النصية
    formDataToSend.append("ReportId", parseInt(reportId));
    formDataToSend.append("ChildInfo.Fullname", formData.patientName);
    formDataToSend.append("ChildInfo.Occupation", formData.occupation);
    formDataToSend.append("ChildInfo.BirthDate", formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00` : "");
    formDataToSend.append("ChildInfo.Gender", formData.gender);
formDataToSend.append(
  "date",
  formData.date ? `${formData.date}T00:00:00` : ""
);

    formDataToSend.append("CaseReport.Chronic_Disease", formData.chronicDiseases);
    formDataToSend.append("CaseReport.Medication", formData.medications);
        formDataToSend.append("CaseReport.phDignosis", formData.physioDiagnosis);

    formDataToSend.append("CaseReport.Family_History", formData.familyHistory);
    formDataToSend.append("CaseReport.Previous_Surgeries", formData.surgeries);
    formDataToSend.append("CaseReport.Present_History", formData.presentHistory);
    formDataToSend.append("CaseReport.Social_History", formData.socialHistory);
    formDataToSend.append("CaseReport.Dignosis", formData.medicalDiagnosis);
    formDataToSend.append("CaseReport.Other_Investigations", formData.otherFindings);

    formDataToSend.append("Assesment.ShortTermText", formData.shortGoals);
    formDataToSend.append("Assesment.Problemlist", formData.listOfProblem);
    formDataToSend.append("Assesment.PlanOfcareText", formData.planOfCare);
    formDataToSend.append("Assesment.LongTermText", formData.longGoals);

    formDataToSend.append("ObjectivesAndFindings.Observation", formData.observationFindings);
    formDataToSend.append("ObjectivesAndFindings.palpation", formData.palpationFindings);
    formDataToSend.append("ObjectivesAndFindings.pain_assesment", formData.painFindings);
    formDataToSend.append("ObjectivesAndFindings.sensation", formData.sensationFindings);
    formDataToSend.append("ObjectivesAndFindings.rom_findings", formData.romFindings);
    formDataToSend.append("ObjectivesAndFindings.mmt_findings", formData.mmtFindings);
    formDataToSend.append("ObjectivesAndFindings.reflexes", formData.reflexFindings);
    formDataToSend.append("ObjectivesAndFindings.join_muscle_circufernec", formData.jointsFindings); // ✅ أضف هذا السطر
formDataToSend.append("Assesment.homeprogrem", formData.homeProgram);

    formDataToSend.append("ObjectivesAndFindings.special_tests", formData.specialTestFindings);
// Other investigations
otherImages.forEach(file => {
  if (file instanceof File) {
    formDataToSend.append("CaseReport.OtherInvestigationsFiles", file);
  } else {
    formDataToSend.append("CaseReport.ExistingImageUrls", file.id);
  }
});

// Plan of Care
planImages.forEach(file => {
  if (file instanceof File) {
    formDataToSend.append("Assesment.AssesmentFiles", file);
  } else {
    formDataToSend.append("Assesment.ExistingImageUrls", file.id);
  }
});

// Home Program
homeImages.forEach(file => {
  if (file instanceof File) {
    formDataToSend.append("ObjectivesAndFindings.ObjectivesAndFindingsFiles", file);
  } else {
    formDataToSend.append("ObjectivesAndFindings.ExistingImageUrls", file.id);
  }
});

    // إرسال الطلب
    const response = await axios.post(
      "https://sewarwellnessclinic1.runasp.net/api/kidReport/update-report",
      formDataToSend,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("Response:", response.data);
alert("تم حفظ التقرير بنجاح!");
localStorage.removeItem("reportDraft_" + reportId);
  } catch (err) {
    console.error(err);
    alert("❌ حدث خطأ أثناء رفع التقرير.");
  }
};



  const handleGoBack = () => {
  navigate("/FilesPage");
};

  return (
    <div
      className="container"
      style={{
        fontFamily: "serif",
        fontSize: "16px",
        fontWeight: 600,
        color: "#2a7371",
        lineHeight: 1.5,
        paddingTop: "100px"
      }}
    >




      <div
  onClick={handleGoBack}
  style={{
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: accentColor,
    marginBottom: "20px",
    fontWeight: 600,
  }}
>
  <span style={{ fontSize: "22px", marginRight: "8px" }}>←</span>
  <span>الرجوع للخلف</span>
</div>
      <h4 style={headerStyle}>Weekly case Report Guide</h4>

      <form onSubmit={handleSubmit}>
        {/* Subjective block */}
        <div className="row mb-2">
          <div className="col-12" style={turquoiseBorder}>
          <div className="mb-2" style={{ width: "25%" }}>
  <label className="mb-0">Date :</label>
  <input
    type="date"
    name="date"                   // ⬅️ ربط الاسم بالـ state
    value={formData.date}         // ⬅️ ربط القيمة بالـ state
    onChange={handleChange}       // ⬅️ دالة التغيير
    className="form-control"
    style={{
      borderColor: "#2a7371",
      color: "#2a7371",
      fontWeight: 600,
      height: "35px",
    }}
  />
</div>

        <div
  className="row g-3 align-items-center flex-wrap"
  style={{ marginTop: "10px" }}
>
  <div className="col-12 col-md-3">
    <label>Patient name:</label>
    <input
      type="text"
      name="patientName"
      value={formData.patientName}
      onChange={handleChange}
      className="form-control"
      style={{
        borderColor: "#2a7371",
        color: "#2a7371",
        fontWeight: 600,
        height: "35px",
      }}
    />
  </div>

  <div className="col-12 col-md-3">
  <label>Date of birth:</label>
  <input
    type="date"
    name="dateOfBirth"
    value={formData.dateOfBirth}
    onChange={handleChange}
    className="form-control"
    style={{
      borderColor: "#2a7371",
      color: "#2a7371",
      fontWeight: 600,
      height: "35px",
    }}
  />
</div>

  <div className="col-12 col-md-2">
    <label>Gender:</label>
    <select
      name="gender"
      value={formData.gender}
      onChange={handleChange}
      className="form-control"
      style={{
        borderColor: "#2a7371",
        color: "#2a7371",
        fontWeight: 600,
        height: "35px",
      }}
    >
      <option value="">Select</option>
      <option  value="kid">Kid</option>
      <option value="Women">Women</option>
    </select>
  </div>

  <div className="col-12 col-md-4">
    <label>Occupation:</label>
    <input
      type="text"
      name="occupation"
      value={formData.occupation}
      onChange={handleChange}
      className="form-control"
      style={{
        borderColor: "#2a7371",
        color: "#2a7371",
        fontWeight: 600,
        height: "35px",
      }}
    />
  </div>
</div>

           

            <div className="mt-3">
              <label>Medical diagnosis</label>
              <textarea name="medicalDiagnosis" rows={3} value={formData.medicalDiagnosis} onChange={handleChange} className="form-control" style={{ borderColor: "#2a7371" }} />
            </div>

            <div className="mt-3">
              <label>Physiotherapy diagnosis</label>
              <textarea name="physioDiagnosis" rows={3} value={formData.physioDiagnosis}
 onChange={handleChange} className="form-control" style={{ borderColor: "#2a7371" }} />
            </div>

            <div className="mt-3">
              <label>Present history (briefly)</label>
              <textarea name="presentHistory" rows={3} value={formData.presentHistory} onChange={handleChange} className="form-control" style={{ borderColor: "#2a7371" }} />
            </div>
          </div>
        </div>

        {/* Past medical history */}
        <div className="row mb-3">
          <div className="col-12" style={{ ...turquoiseBorder }}>
            <h6 className="mt-1">Past medical history</h6>
           <div
  className="d-flex text-center"
  style={{
    border: "1px solid #2a7371",
    borderRadius: "8px",
    overflow: "hidden",
  }}
>
  <div style={{ flex: 1, padding: "10px", borderRight: "1px solid #2a7371" }}>
    <strong>Chronic diseases</strong>
    <textarea
      name="chronicDiseases"
      rows={3}
      value={formData.chronicDiseases}
      onChange={handleChange}
      className="form-control border-0"
      style={{ background: "transparent", resize: "none", textAlign: "center" }}
    />
  </div>

  <div style={{ flex: 1, padding: "10px", borderRight: "1px solid #2a7371" }}>
    <strong>Medications</strong>
    <textarea
      name="medications"
      rows={3}
      value={formData.medications}
      onChange={handleChange}
      className="form-control border-0"
      style={{ background: "transparent", resize: "none", textAlign: "center" }}
    />
  </div>

  <div style={{ flex: 1, padding: "10px" }}>
    <strong>Previous surgeries</strong>
    <textarea
      name="surgeries"
      rows={3}
      value={formData.surgeries}
      onChange={handleChange}
      className="form-control border-0"
      style={{ background: "transparent", resize: "none", textAlign: "center" }}
    />
  </div>
</div>

            <div className="mt-3">
              <label>Social history:</label>
              <textarea name="socialHistory" rows={3} value={formData.socialHistory} onChange={handleChange} className="form-control" style={{ borderColor: "#2a7371" }} />
            </div>

         {/* Other investigations images */}
<div className="mt-3" style={{ border: "1px solid #2a7371", padding: "12px", borderRadius: "8px" }}>
  <label>Other investigations findings (lab, X-ray, other imaging)</label>
  <textarea
    name="otherFindings"
    rows={2}
    value={formData.otherFindings}
    onChange={handleChange}
    className="form-control mb-2"
    style={{ borderColor: "#2a7371" }}
  />

  {/* Image Upload Section */}
  <div>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => {
        const files = Array.from(e.target.files);
        // نخزّن الملفات نفسها (File objects)
        setOtherImages((prev) => [...prev, ...files]);
      }}
      style={{ display: "none" }}
      id="otherUpload"
    />
    <label
      htmlFor="otherUpload"
      className="btn btn-sm"
      style={{
        backgroundColor: "#2a7371",
        color: "white",
        fontWeight: 600,
        marginBottom: "10px",
      }}
    >
      + Add Images
    </label>

    <div className="d-flex flex-wrap gap-2">
      {otherImages.map((file, i) => {
        // إذا الملف File نعمل URL مؤقت، وإذا كان مسار من السيرفر نلصق الـ base URL
        const src = file instanceof File ? URL.createObjectURL(file) : `https://sewarwellnessclinic1.runasp.net${file.imgUrl}`;
        return (
          <div
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              marginRight: "10px",
            }}
          >
            <img
              src={src}
              alt="Other Investigation"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "2px solid #2a7371",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => setZoomImage(src)}
            />
            <button
              type="button"
              onClick={() => setOtherImages((prev) => prev.filter((_, idx) => idx !== i))}
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "#2a7371",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  </div>
</div>
          </div>
        </div>

        {/* Objectives */}
        <div className="row mb-3">
          <div className="col-12" style={turquoiseBorder}>
            <label>Objectives :-</label>
            <h6>Observation findings:</h6>
            <textarea name="observationFindings" rows={3} value={formData.observationFindings} onChange={handleChange} className="form-control" style={{ borderColor: "#2a7371" }} />
          </div>
        </div>

        {/* Palpation and others */}
        <div className="row mb-3">
          <div className="col-12" style={largeBox}>
            <p><strong>Palpation findings</strong></p>
            <textarea name="palpationFindings" rows={2} value={formData.palpationFindings} onChange={handleChange} className="form-control mb-2" style={{ borderColor: "#2a7371" }} />

            <p><strong>Pain assessment findings</strong></p>
            <textarea name="painFindings" rows={2} value={formData.painFindings} onChange={handleChange} className="form-control mb-2" style={{ borderColor: "#2a7371" }} />

            <p><strong>Sensation findings</strong></p>
            <textarea name="sensationFindings" rows={2} value={formData.sensationFindings} onChange={handleChange} className="form-control mb-2" style={{ borderColor: "#2a7371" }} />

            <p><strong>Joints and muscle circumference findings</strong></p>
            <textarea name="jointsFindings" rows={2} value={formData.jointsFindings} onChange={handleChange} className="form-control mb-2" style={{ borderColor: "#2a7371" }} />

            <p><strong>ROM Findings</strong></p>
            <textarea name="romFindings" rows={2} value={formData.romFindings} onChange={handleChange} className="form-control mb-2" style={{ borderColor: "#2a7371" }} />

            <p><strong>MMT findings</strong></p>
            <textarea name="mmtFindings" rows={2} value={formData.mmtFindings} onChange={handleChange} className="form-control mb-2" style={{ borderColor: "#2a7371" }} />

            <p><strong>Reflexes findings</strong></p>
            <textarea name="reflexFindings" rows={2} value={formData.reflexFindings} onChange={handleChange} className="form-control mb-2" style={{ borderColor: "#2a7371" }} />

            <p><strong>Special test findings</strong></p>
            <textarea name="specialTestFindings" rows={2} value={formData.specialTestFindings} onChange={handleChange} className="form-control" style={{ borderColor: "#2a7371" }} />
          </div>
        </div>

        {/* Assessment */}
        <div className="row mb-3">
          <div className="col-12" style={turquoiseBorder}>
            <h6>Assessment evaluation :-</h6>
            <label>List of problem:</label>
            <textarea name="listOfProblem" rows={4} value={formData.listOfProblem} onChange={handleChange} className="form-control" style={{ borderColor: "#2a7371" }} />
          </div>
        </div>

        {/* Goals */}
        <div className="row mb-3">
          <h6>Goals :-</h6>
          <div className="col-md-6" style={{ border: "1px solid #2a7371", padding: 12 }}>
            <h6>Short term goals</h6>
            <textarea name="shortGoals" rows={4} value={formData.shortGoals} onChange={handleChange} className="form-control" style={{ borderColor: "#2a7371" }} />
          </div>
          <div className="col-md-6" style={{ border: "1px solid #2a7371", padding: 12 }}>
            <h6>Long term goals</h6>
            <textarea name="longGoals" rows={4} value={formData.longGoals} onChange={handleChange} className="form-control" style={{ borderColor: "#2a7371" }} />
          </div>
        </div>

      {/* Plan of care */}
<div className="row mb-4">
  <div className="col-12" style={{ border: "1px solid #2a7371", padding: 12 }}>
    <h6 style={{ color: "#2a7371" }}>Plan of care:</h6>

    {/* Text Area */}
    <textarea
      name="planOfCare"
      rows={4}
      value={formData.planOfCare}
      onChange={handleChange}
      className="form-control mb-3"
      style={{ borderColor: "#2a7371", color: "#2a7371", fontWeight: 600 }}
    />

    {/* Image Upload Section */}
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
       onChange={(e) => {
  const files = Array.from(e.target.files);
  setPlanImages((prev) => [...prev, ...files]);
}}

        style={{ display: "none" }}
        id="planUpload"
      />
      <label
        htmlFor="planUpload"
        className="btn btn-sm"
        style={{
          backgroundColor: "#2a7371",
          color: "white",
          fontWeight: 600,
          marginBottom: "10px",
        }}
      >
        + Add Images
      </label>

      <div className="d-flex flex-wrap gap-2">
      {planImages.map((file, i) => {
  const src = file instanceof File
    ? URL.createObjectURL(file)
    : `https://sewarwellnessclinic1.runasp.net${file.imgUrl}`;
  return (
    <div key={i} style={{ position: "relative", display: "inline-block", marginRight: "10px" }}>
      <img
        src={src}
        alt="Plan Image"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          border: "2px solid #2a7371",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={() => setZoomImage(src)}
      />
      <button
        type="button"
        onClick={() => setPlanImages((prev) => prev.filter((_, idx) => idx !== i))}
        style={{
          position: "absolute",
          top: "-8px",
          right: "-8px",
          backgroundColor: "#2a7371",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
})}

      </div>
    </div>
  </div>
</div>

{/* Home Program */}
{/* Home Program */}
<div className="row mb-4">
  <div className="col-12" style={{ border: "1px solid #2a7371", padding: 12 }}>
    <h6 style={{ color: "#2a7371" }}>Home Program:</h6>

    {/* Text Area */}
    <textarea
      name="homeProgram"
      rows={4}
      value={formData.homeProgram}
      onChange={handleChange}
      className="form-control mb-3"
      style={{ borderColor: "#2a7371", color: "#2a7371", fontWeight: 600 }}
    />

    {/* Image Upload Section */}
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files);
          setHomeImages(prev => [...prev, ...files]); // نفس طريقة البلين
        }}
        style={{ display: "none" }}
        id="homeUpload"
      />
      <label
        htmlFor="homeUpload"
        className="btn btn-sm"
        style={{
          backgroundColor: "#2a7371",
          color: "white",
          fontWeight: 600,
          marginBottom: "10px",
        }}
      >
        + Add Images
      </label>

      <div className="d-flex flex-wrap gap-2">
       {homeImages.map((file, i) => {
  const src = file instanceof File 
    ? URL.createObjectURL(file) 
    : `https://sewarwellnessclinic1.runasp.net${file.imgUrl}`;
          return (
            <div key={i} style={{ position: "relative", display: "inline-block", marginRight: "10px" }}>
              <img
              
                src={src}
                alt="Home Program"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  border: "2px solid #2a7371",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => setZoomImage(src)}
              />
              <button
                type="button"
                onClick={() => setHomeImages(prev => prev.filter((_, idx) => idx !== i))}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#2a7371",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>


        {/* Footer */}
        <div className="row">
          <div className="col-12 text-right text-muted">PT.Sewar shreem</div>
        </div>

        <div className="text-center mt-4 mb-5">
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#2a7371",
              color: "white",
              fontWeight: 600,
              padding: "10px 30px"
            }}
          >
            حفظ التقرير
          </button>
        </div>



  {/* كل الحقول ورفع الصور هنا */}

{/* Zoom Image Section */}
{zoomImage && (
  <div
    onClick={() => setZoomImage(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      cursor: "zoom-out",
    }}
  >
    <img
      src={zoomImage}
      alt="Zoomed"
      style={{
        maxWidth: "90%",
        maxHeight: "90%",
        border: "4px solid white",
        borderRadius: "12px",
        boxShadow: "0 0 20px rgba(255,255,255,0.3)",
      }}
    />
  </div>
)}





      </form>
    </div>
  );

}
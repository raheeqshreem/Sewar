import React, { useState, useEffect } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { useLocation, useParams } from "react-router-dom";

const accentColor = "#2a7371";

// بيانات Muscle Tone أولية (للاستخدام قبل جلب البيانات)

const initialMuscleTone = [
  { joint: "Shoulder", right: "", left: "" },

  { joint: "Elbow", right: "", left: "" },

  { joint: "Wrist", right: "", left: "" },

  { joint: "Hip", right: "", left: "" },

  { joint: "Knee", right: "", left: "" },

  { joint: "Ankle", right: "", left: "" },
];

// بيانات Milestones كبير أولية

const initialMilestones = [
  {
    age: 1,
    milestone: "Head up in prone position\nAttempts to lift head in midline",
    status: "",
  },

  { age: 2, milestone: "Chest up in prone position", status: "" },

  {
    age: 3,
    milestone: "Head control\nRolling supine to side-lying",
    status: "",
  },

  {
    age: 4,
    milestone: "Up on elbows in prone position\nRoll over from prone to supine",
    status: "",
  },

  {
    age: 5,
    milestone: "Roll over from supine to prone\nProne on extended arms",
    status: "",
  },

  {
    age: 6,
    milestone: "Sit support (tripod)\nTransferring objects hand to hand",
    status: "",
  },

  { age: 7, milestone: "Sit unsupported", status: "" },

  { age: 8, milestone: "Creeping\nBeginning pull to stand", status: "" },

  { age: 9, milestone: "Crawling", status: "" },

  { age: 10, milestone: "Standing with support", status: "" },

  { age: 11, milestone: "Standing without support", status: "" },

  { age: 12, milestone: "Walking", status: "" },

  { age: 15, milestone: "Creeps up stairs\n Running", status: "" },

  { age: 18, milestone: "Walks up stairs with help or handrail", status: "" },
];

// بيانات Milestones صغير أولية

const initialSmallMilestones = [
  { age: 3, milestone: "Finger and hand play", status: "" },

  { age: 6, milestone: "Whole hand palmer grasp", status: "" },

  { age: 9, milestone: "Primitive Pincer", status: "" },

  { age: 12, milestone: "Primitive tripod", status: "" },

  { age: 15, milestone: "Palmer grasp", status: "" },
];

export default function ReportPreviewKids() {
  const navigate = useNavigate();

  const location = useLocation();

  const { reportId } = useParams();

  const turquoiseBorder = { border: "1px solid #2a7371", padding: "8px" };

  const headerStyle = {
    textAlign: "center",
    fontWeight: 600,
    margin: "50px 0",
    color: "#2a7371",
  };

  const [zoomImage, setZoomImage] = useState(null);
  const [planImages, setPlanImages] = useState([]);

  const [homeImages, setHomeImages] = useState([]);

  const [otherImages, setOtherImages] = useState([]);

  const largeBox = {
    minHeight: "220px",
    border: "1px solid #2a7371",
    padding: "12px",
    background: "#fff",
  };

  // بيانات التقرير

  const [formData, setFormData] = useState({
    patientName: "",

    dateOfBirth: "",

    gender: "",

    occupation: "",

    chronicDiseases: "",

    medications: "",

    surgeries: "",

    familyHistory: "",

    presentHistory: "",

    socialHistory: "",

    medicalDiagnosis: "",

    physioDiagnosis: "",

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

    homeProgram: "",
  });

  // Muscle Tone & Milestones & Images

  const [muscleTone, setMuscleTone] = useState(initialMuscleTone);

  const [milestones, setMilestones] = useState(initialMilestones);

  const [smallMilestones, setSmallMilestones] = useState(
    initialSmallMilestones
  );


  const [muscleToneIds, setMuscleToneIds] = useState([]);

  const [milestoneIds, setMilestoneIds] = useState([]);

// 🔹 متابعة أي تحديث للـ homeImages
useEffect(() => {
  console.log("HomeImages updated:", homeImages);
}, [homeImages]);


useEffect(() => {
  console.log("PlanImages updated:", planImages);
}, [planImages]);
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `https://sewarwellnessclinic1.runasp.net/api/FilesPage/report-details/${reportId}`
        );

        const data = response.data;
    console.log("بيانات التقرير من الباك:", data);
console.log("✅ Milestones from backend:", response.data.milestones);

        // تحديث formData

        setFormData({
          patientName: data.childInfo?.fullname || "",

  gender: data.name === 0 ? "Kid" : data.name === 1 ? "Women" : "",

          occupation: data.childInfo?.occupation || "",

          dateOfBirth: data.childInfo?.birthDate
            ? data.childInfo.birthDate.split("T")[0]
            : "",

          developmentalAge: data.caseReport?.developmentalage || "",

          diagnosis: data.caseReport?.dignosis || "",

          presentHistory: data.caseReport?.present_History || "",

          chronicDiseases: data.caseReport?.chronic_Disease || "",

          medications: data.caseReport?.medication || "",

          surgeries: data.caseReport?.previous_Surgeries || "",

          familyHistory: data.caseReport?.family_History || "",

          socialHistory: data.caseReport?.social_History || "",

          otherFindings: data.caseReport?.other_Investigations || "",

          date: data.date ? data.date.split("T")[0] : "",

          observationFindings: data.objectivesAndFindings?.observation || "",

          palpationFindings: data.objectivesAndFindings?.palpation || "",

          painFindings: data.objectivesAndFindings?.pain_assesment || "",

          sensationFindings: data.objectivesAndFindings?.sensation || "",

          jointsFindings:
            data.objectivesAndFindings?.join_muscle_circufernec || "",

          romFindings: data.objectivesAndFindings?.rom_findings || "",

          mmtFindings: data.objectivesAndFindings?.mmt_findings || "",

          reflexFindings: data.objectivesAndFindings?.reflexes || "",

          specialTestFindings: data.objectivesAndFindings?.special_tests || "",

          listOfProblem: data.assesment?.problemlist || "",

          shortGoals: data.assesment?.shortTermText || "",

          longGoals: data.assesment?.longTermText || "",

          planOfCare: data.assesment?.planOfcareText || "",

          homeProgram: data.assesment?.homeprogrem || "",

          medicalDiagnosis: data.caseReport?.dignosis || "",

          physioDiagnosis: data.caseReport?.phDignosis || "",
        });

setOtherImages(data.caseReport?.cimages || []);
setPlanImages(data.assesment?.aimages || []);
setHomeImages(data.objectivesAndFindings?.oimages || []);
console.log("Other images from backend:", data.caseReport?.cimages);
// للـ plan images
console.log("Other images from plan:", data.assesment?.aimages);

// للـ home images
console.log("Other images home:", data.objectivesAndFindings?.oimages);
        // تحديث Muscle Tone مع البيانات من الباك

        setMuscleTone(
          data.muscleTones.map((mt) => ({
            joint: mt.joint,

            right: mt.rightStatus || "",

            left: mt.leftStatus || "",
          }))
        );

        setMuscleToneIds(data.muscleTones.map((mt) => mt.id));

        // تحديث Milestones

   // نفصل البيانات الكبيرة والصغيرة حسب ما ترجع من الـ API
      const bigMs = data.milestones.slice(0, 14);
      const smallMs = data.milestones.slice(14, 19);

      // ✅ نرتب الكبير حسب initialMilestones
      const sortedBig = initialMilestones.map((item) => {
        const match = bigMs.find((ms) => ms.age === item.age);
        return {
          age: item.age,
          milestone: item.milestone,
          status: match ? mapStatus(match.status) : "",
        };
      });

      // ✅ نرتب الصغير حسب initialSmallMilestones
      const sortedSmall = initialSmallMilestones.map((item) => {
        const match = smallMs.find((ms) => ms.age === item.age);
        return {
          age: item.age,
          milestone: item.milestone,
          status: match ? mapStatus(match.status) : "",
        };
      });

      setMilestones(sortedBig);
      setSmallMilestones(sortedSmall);

        setMilestoneIds(data.milestones.map((ms) => ms.id));
      } catch (err) {
        console.error(err);

        alert("فشل جلب بيانات التقرير من السيرفر.");
      }
    };

    if (reportId) fetchReport();
  }, [reportId]);

  // دالة مساعدة لتحويل الرقم من الباك إلى "good/fair/poor/notAchieved"

  function mapStatus(status) {
    switch (status) {
      case 0:
        return "notAchieved";

      case 1:
        return "poor";

      case 2:
        return "fair";

      case 3:
        return "good";

      default:
        return "";
    }
  }



  // دوال Muscle Tone & Milestones

  const handleToneChange = (index, side, value) => {
    const newTone = [...muscleTone];

    newTone[index][side] = value;

    setMuscleTone(newTone);
  };

  const handleMilestoneChange = (index, value) => {
    const updated = [...milestones];

    updated[index].status = value;

    setMilestones(updated);
  };

  const handleSmallMilestoneChange = (index, value) => {
    const updated = [...smallMilestones];

    updated[index].status = value;

    setSmallMilestones(updated);
  };

  // 🔹 دالة الإرسال (زر الحفظ)

  // 🔹 دالة التغيير لأي حقل
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // 🔹 دالة الإرسال (زر الحفظ)


  const handleGoBack = () => navigate("/FilesPage");
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formDataToSend = new FormData();

    // الحقول الأساسية
    formDataToSend.append("ReportId", parseInt(reportId));
    formDataToSend.append("ChildInfo.Fullname", formData.patientName);
    formDataToSend.append("ChildInfo.Occupation", formData.occupation);
    formDataToSend.append(
      "ChildInfo.BirthDate",
      formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00` : ""
    );
    formDataToSend.append("ChildInfo.Gender", formData.gender);
    formDataToSend.append(
      "CaseReport.Developmentalage",
      formData.developmentalAge
    );

    formDataToSend.append(
      "date",
      formData.date ? `${formData.date}T00:00:00` : ""
    );

    formDataToSend.append(
      "CaseReport.Chronic_Disease",
      formData.chronicDiseases
    );
    formDataToSend.append("CaseReport.Medication", formData.medications);
    formDataToSend.append("CaseReport.phDignosis", formData.physioDiagnosis);
    formDataToSend.append("CaseReport.Family_History", formData.familyHistory);
    formDataToSend.append(
      "CaseReport.Previous_Surgeries",
      formData.surgeries
    );
    formDataToSend.append(
      "CaseReport.Present_History",
      formData.presentHistory
    );
    formDataToSend.append("CaseReport.Social_History", formData.socialHistory);
    formDataToSend.append("CaseReport.Dignosis", formData.medicalDiagnosis);
    formDataToSend.append(
      "CaseReport.Other_Investigations",
      formData.otherFindings
    );

    formDataToSend.append("Assesment.ShortTermText", formData.shortGoals);
    formDataToSend.append("Assesment.Problemlist", formData.listOfProblem);
    formDataToSend.append("Assesment.PlanOfcareText", formData.planOfCare);
    formDataToSend.append("Assesment.LongTermText", formData.longGoals);

    formDataToSend.append(
      "ObjectivesAndFindings.Observation",
      formData.observationFindings
    );
    formDataToSend.append(
      "ObjectivesAndFindings.palpation",
      formData.palpationFindings
    );
    formDataToSend.append(
      "ObjectivesAndFindings.pain_assesment",
      formData.painFindings
    );
    formDataToSend.append(
      "ObjectivesAndFindings.sensation",
      formData.sensationFindings
    );
    formDataToSend.append(
      "ObjectivesAndFindings.rom_findings",
      formData.romFindings
    );
    formDataToSend.append(
      "ObjectivesAndFindings.mmt_findings",
      formData.mmtFindings
    );
    formDataToSend.append(
      "ObjectivesAndFindings.reflexes",
      formData.reflexFindings
    );
    formDataToSend.append(
      "ObjectivesAndFindings.join_muscle_circufernec",
      formData.jointsFindings
    );
    formDataToSend.append("Assesment.homeprogrem", formData.homeProgram);
    formDataToSend.append(
      "ObjectivesAndFindings.special_tests",
      formData.specialTestFindings
    );

    // 🔹 الصور
    otherImages.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append("CaseReport.OtherInvestigationsFiles", file);
      } else {
        formDataToSend.append("CaseReport.ExistingImageUrls", file.id);
      }
    });

    planImages.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append("Assesment.AssesmentFiles", file);
      } else {
        formDataToSend.append("Assesment.ExistingImageUrls", file.id);
      }
    });

    homeImages.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append(
          "ObjectivesAndFindings.ObjectivesAndFindingsFiles",
          file
        );
      } else {
        formDataToSend.append("ObjectivesAndFindings.ExistingImageUrls", file.id);
      }
    });

    // إرسال التقرير الرئيسي
    const response = await axios.post(
      "https://sewarwellnessclinic1.runasp.net/api/kidReport/update-report",
      formDataToSend,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("✅ Report updated:", response.data);

    // 🔹 بعد ما نرفع التقرير، نرفع الـ Muscle و Milestones
    await handleUpdateMuscleAndMilestones();
console.log("📥 كامل الرد من الباك:", response.data);

    alert("✅ تم رفع التقرير والصور بنجاح!");
  } catch (err) {
    console.error(err);
    alert("❌ حدث خطأ أثناء رفع التقرير.");
  }
};

// ⬇️ الدالة المخصصة لتحديث الـ Muscle و Milestones
const handleUpdateMuscleAndMilestones = async () => {
  try {
    const muscleTonesToSend = muscleToneIds.map((id, index) => ({
      id,
      rightStatus: muscleTone[index]?.right || "",
      leftStatus: muscleTone[index]?.left || "",
    }));

    // ✅ ندمج كل الـ milestones بعد التأكد إنهم جاهزين
   const allMilestones = [...milestones, ...smallMilestones];

const milestonesToSend = allMilestones.map((ms, index) => ({
  id: milestoneIds[index] || 0, // ✅ هنا نجيب id من milestoneIds
  status: ms.status || "notAchieved",
}));




    // 🧩 طباعة كاملة للديباغ
    console.log("🧩 --- DEBUG INFO ---");
    console.log("Report ID:", reportId);
    console.log("Milestone IDs:", milestoneIds);
    console.log("Total milestones:", allMilestones.length);

    console.table(
      milestonesToSend.map((m, i) => ({
        index: i + 1,
        id: m.id,
        status: m.status,
        label:
          i < milestones.length
            ? milestones[i].milestone
            : smallMilestones[i - milestones.length].milestone,
      }))
    );

    console.log("--------------------");

    // 🔹 إرسال للباك
    const payload = {
      reportId: parseInt(reportId),
      muscleTones: muscleTonesToSend,
      milestones: milestonesToSend,
    };

    const response = await axios.post(
      "https://sewarwellnessclinic1.runasp.net/api/kidReport/update-muscle-and-milestones",
      payload
    );
console.log("📥 كامل الرد من الباك:", response);
console.log("📥 response.data:", response.data);

console.log("📤 Payload to backend :", JSON.stringify(payload, null, 2));
    alert("✅ تم حفظ كل Milestones بنجاح!");
  } catch (err) {
    console.error("❌ Error while updating Muscle & Milestones:", err);
    alert("❌ حدث خطأ أثناء تحديث Muscle Tone و Milestones");
  }
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
        paddingTop: "100px",
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
                name="date" // ⬅️ ربط الاسم بالـ state
                value={formData.date} // ⬅️ ربط القيمة بالـ state
                onChange={handleChange} // ⬅️ دالة التغيير
                className="form-control"
                style={{
                  borderColor: "#2a7371",

                  color: "#2a7371",

                  fontWeight: 600,

                  height: "35px",
                }}
              />
            </div>
            {/* Patient info section */}

            <div className="row align-items-center g-3">
              {" "}
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
              </div>{" "}
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
              </div>{" "}
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

                  <option value="Kid">Kid</option>

                  <option value="Women">Women</option>
                </select>
              </div>{" "}
              <div className="col-12 col-md-3">
                <label>Occupation of mother:</label>

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
              </div>{" "}
              <div className="col-12 col-md-2">
                <label>Developmental age:</label>

                <input
                  type="text"
                  name="developmentalAge"
                  value={formData.developmentalAge}
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

              <textarea
                name="medicalDiagnosis"
                rows={3}
                value={formData.medicalDiagnosis}
                onChange={handleChange}
                className="form-control"
                style={{ borderColor: "#2a7371" }}
              />
            </div>

            <div className="mt-3">
              <label>Physiotherapy diagnosis</label>

              <textarea
                name="physioDiagnosis"
                rows={3}
                value={formData.physioDiagnosis}
                onChange={handleChange}
                className="form-control"
                style={{ borderColor: "#2a7371" }}
              />
            </div>

            <div className="mt-3">
              <label>Present history (briefly)</label>

              <textarea
                name="presentHistory"
                rows={3}
                value={formData.presentHistory}
                onChange={handleChange}
                className="form-control"
                style={{ borderColor: "#2a7371" }}
              />
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
              <div
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRight: "1px solid #2a7371",
                }}
              >
                <strong>Chronic diseases</strong>

                <textarea
                  name="chronicDiseases"
                  rows={3}
                  value={formData.chronicDiseases}
                  onChange={handleChange}
                  className="form-control border-0"
                  style={{
                    background: "transparent",
                    resize: "none",
                    textAlign: "center",
                  }}
                />
              </div>{" "}
              <div
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRight: "1px solid #2a7371",
                }}
              >
                <strong>Medications</strong>

                <textarea
                  name="medications"
                  rows={3}
                  value={formData.medications}
                  onChange={handleChange}
                  className="form-control border-0"
                  style={{
                    background: "transparent",
                    resize: "none",
                    textAlign: "center",
                  }}
                />
              </div>{" "}
              <div style={{ flex: 1, padding: "10px" }}>
                <strong>Previous surgeries</strong>

                <textarea
                  name="surgeries"
                  rows={3}
                  value={formData.surgeries}
                  onChange={handleChange}
                  className="form-control border-0"
                  style={{
                    background: "transparent",
                    resize: "none",
                    textAlign: "center",
                  }}
                />
              </div>
            </div>
            <div className="mt-3">
              <label>Social history:</label>

              <textarea
                name="socialHistory"
                rows={3}
                value={formData.socialHistory}
                onChange={handleChange}
                className="form-control"
                style={{ borderColor: "#2a7371" }}
              />
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

            <textarea
              name="observationFindings"
              rows={3}
              value={formData.observationFindings}
              onChange={handleChange}
              className="form-control"
              style={{ borderColor: "#2a7371" }}
            />
          </div>
        </div>

        {/* Palpation and others */}

        <div className="row mb-3">
          <div className="col-12" style={largeBox}>
            <p>
              <strong>Palpation findings</strong>
            </p>

            <textarea
              name="palpationFindings"
              rows={2}
              value={formData.palpationFindings}
              onChange={handleChange}
              className="form-control mb-2"
              style={{ borderColor: "#2a7371" }}
            />

            <p>
              <strong>Pain assessment findings</strong>
            </p>

            <textarea
              name="painFindings"
              rows={2}
              value={formData.painFindings}
              onChange={handleChange}
              className="form-control mb-2"
              style={{ borderColor: "#2a7371" }}
            />

            <p>
              <strong>Sensation findings</strong>
            </p>

            <textarea
              name="sensationFindings"
              rows={2}
              value={formData.sensationFindings}
              onChange={handleChange}
              className="form-control mb-2"
              style={{ borderColor: "#2a7371" }}
            />

            <p>
              <strong>Joints and muscle circumference findings</strong>
            </p>

            <textarea
              name="jointsFindings"
              rows={2}
              value={formData.jointsFindings}
              onChange={handleChange}
              className="form-control mb-2"
              style={{ borderColor: "#2a7371" }}
            />

            <p>
              <strong>ROM Findings</strong>
            </p>

            <textarea
              name="romFindings"
              rows={2}
              value={formData.romFindings}
              onChange={handleChange}
              className="form-control mb-2"
              style={{ borderColor: "#2a7371" }}
            />

            <p>
              <strong>MMT findings</strong>
            </p>

            <textarea
              name="mmtFindings"
              rows={2}
              value={formData.mmtFindings}
              onChange={handleChange}
              className="form-control mb-2"
              style={{ borderColor: "#2a7371" }}
            />

            <p>
              <strong>Reflexes findings</strong>
            </p>

            <textarea
              name="reflexFindings"
              rows={2}
              value={formData.reflexFindings}
              onChange={handleChange}
              className="form-control mb-2"
              style={{ borderColor: "#2a7371" }}
            />

            <p>
              <strong>Special test findings</strong>
            </p>

            <textarea
              name="specialTestFindings"
              rows={2}
              value={formData.specialTestFindings}
              onChange={handleChange}
              className="form-control"
              style={{ borderColor: "#2a7371" }}
            />
          </div>
        </div>

        {/* === جدول Muscle Tone === */}

        <div className="card shadow-sm mb-4 mt-4">
          <div className="card-body " style={{ turquoiseBorder }}>
            <h5 className="mb-3" style={{ color: accentColor }}>
              Muscle Tone
            </h5>

            {/* === جدول Muscle Tone === */}

            <table
              className="table table-bordered text-center"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              <thead style={{ backgroundColor: "#ffffff", color: accentColor }}>
                <tr>
                  <th
                    style={{
                      borderColor: accentColor,
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    Joint
                  </th>

                  <th
                    style={{
                      borderColor: accentColor,
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    Right
                  </th>

                  <th
                    style={{
                      borderColor: accentColor,
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    Left
                  </th>
                </tr>
              </thead>

              <tbody>
                {muscleTone.map((row, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        borderColor: accentColor,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      {row.joint}
                    </td>

                    <td
                      style={{
                        borderColor: accentColor,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={row.right}
                        onChange={(e) =>
                          handleToneChange(i, "right", e.target.value)
                        }
                        style={{
                          color: accentColor,
                          borderColor: accentColor,
                          textAlign: "center",
                        }}
                      />
                    </td>

                    <td
                      style={{
                        borderColor: accentColor,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={row.left}
                        onChange={(e) =>
                          handleToneChange(i, "left", e.target.value)
                        }
                        style={{
                          color: accentColor,
                          borderColor: accentColor,
                          textAlign: "center",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border rounded p-3  bg-light">
              <strong>Scoring:</strong>

              <ul className="small mt-2">
                <li>0 No increase in tone</li>

                <li>1 Slight increase giving a catch</li>

                <li>1+ Minimal resistance through range</li>

                <li>2 More marked increase in tone</li>

                <li>3 Considerable increase, movement difficult</li>

                <li>4 Limb rigid in flexion/extension</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4 mt-4">
          <div className="card-body" style={turquoiseBorder}>
            <h5 className="mb-3" style={{ color: accentColor }}>
              Developmental Milestones{" "}
            </h5>

            <div className="table-responsive">
              <table
                className="table table-bordered text-center"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                <thead
                  style={{ backgroundColor: "#ffffff", color: accentColor }}
                >
                  <tr>
                    <th
                      rowSpan="2"
                      style={{
                        borderColor: accentColor,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Age
                    </th>

                    <th
                      rowSpan="2"
                      style={{
                        borderColor: accentColor,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Milestone
                    </th>

                    <th
                      colSpan="3"
                      style={{
                        borderColor: accentColor,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Achieved
                    </th>

                    <th
                      rowSpan="2"
                      style={{
                        borderColor: accentColor,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Not Achieved
                    </th>
                  </tr>

                  <tr>
                    <th
                      style={{
                        borderColor: accentColor,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Good
                    </th>

                    <th
                      style={{
                        borderColor: accentColor,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Fair
                    </th>

                    <th
                      style={{
                        borderColor: accentColor,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Poor
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {milestones.map((row, i) => (
                    <tr key={row.id}>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        {row.age}
                      </td>

                      <td
                        style={{
                          whiteSpace: "pre-line",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
{row.milestoneText}
                      </td>

                      {["good", "fair", "poor"].map((level) => (
                        <td
                          key={level}
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={row.status === level}
                            onChange={() =>
                              handleMilestoneChange(
                                i,
                                row.status === level ? "" : level
                              )
                            }
                            style={{
                              width: "26px",
                              height: "26px",
                              cursor: "pointer",
                              accentColor,
                            }}
                          />
                        </td>
                      ))}

                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        <input
                          type="checkbox"
                          checked={row.status === "notAchieved"}
                          onChange={() =>
                            handleMilestoneChange(
                              i,
                              row.status === "notAchieved" ? "" : "notAchieved"
                            )
                          }
                          style={{
                            width: "26px",
                            height: "26px",
                            cursor: "pointer",
                            accentColor,
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* === جدول Milestones صغير مستقل (Age 1-5) === */}

        <div className="card shadow-sm mb-4 mt-4">
          <div className="card-body" style={turquoiseBorder}>
            <h5 className="mb-3" style={{ color: accentColor }}>
              Fine motor{" "}
            </h5>

            <div className="table-responsive">
              <table
                className="table table-bordered text-center"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                <thead
                  style={{ backgroundColor: "#ffffff", color: accentColor }}
                >
                  <tr>
                    <th rowSpan="2" style={{ borderColor: accentColor }}>
                      Age
                    </th>

                    <th rowSpan="2" style={{ borderColor: accentColor }}>
                      Milestone
                    </th>

                    <th colSpan="3" style={{ borderColor: accentColor }}>
                      Achieved
                    </th>

                    <th rowSpan="2" style={{ borderColor: accentColor }}>
                      Not Achieved
                    </th>
                  </tr>

                  <tr>
                    <th style={{ borderColor: accentColor }}>Good</th>

                    <th style={{ borderColor: accentColor }}>Fair</th>

                    <th style={{ borderColor: accentColor }}>Poor</th>
                  </tr>
                </thead>

                <tbody>
                  {smallMilestones.map((row, i) => (
                    <tr key={i}>
                      <td>{row.age}</td>

                      <td style={{ whiteSpace: "pre-line" }}>
                        {row.milestone}
                      </td>

                      {["good", "fair", "poor"].map((level) => (
                        <td key={level}>
                          <input
                            type="checkbox"
                            checked={row.status === level}
                            onChange={() =>
                              handleSmallMilestoneChange(
                                i,
                                row.status === level ? "" : level
                              )
                            }
                            style={{
                              width: "24px",
                              height: "24px",
                              cursor: "pointer",
                              accentColor,
                            }}
                          />
                        </td>
                      ))}

                      <td>
                        <input
                          type="checkbox"
                          checked={row.status === "notAchieved"}
                          onChange={() =>
                            handleSmallMilestoneChange(
                              i,
                              row.status === "notAchieved" ? "" : "notAchieved"
                            )
                          }
                          style={{
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            accentColor,
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Assessment */}

        <div className="row mb-3" style={{ marginTop: "30px" }}>
          <div className="col-12" style={turquoiseBorder}>
            <h6>Assessment evaluation :-</h6>

            <label>List of problem:</label>

            <textarea
              name="listOfProblem"
              rows={4}
              value={formData.listOfProblem}
              onChange={handleChange}
              className="form-control"
              style={{ borderColor: "#2a7371" }}
            />
          </div>
        </div>

        {/* Goals */}

        <div className="row mb-3">
          <h6>Goals :-</h6>

          <div
            className="col-md-6"
            style={{ border: "1px solid #2a7371", padding: 12 }}
          >
            <h6>Short term goals</h6>

            <textarea
              name="shortGoals"
              rows={4}
              value={formData.shortGoals}
              onChange={handleChange}
              className="form-control"
              style={{ borderColor: "#2a7371" }}
            />
          </div>

          <div
            className="col-md-6"
            style={{ border: "1px solid #2a7371", padding: 12 }}
          >
            <h6>Long term goals</h6>

            <textarea
              name="longGoals"
              rows={4}
              value={formData.longGoals}
              onChange={handleChange}
              className="form-control"
              style={{ borderColor: "#2a7371" }}
            />
          </div>
        </div>

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

              padding: "10px 30px",
            }}
          >
            حفظ التقرير
          </button>
        </div>

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
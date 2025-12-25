import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./File.css";

const FilesPage = () => {
  const accentColor = "#2a7371";
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noDataMessage, setNoDataMessage] = useState("");
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportNames, setReportNames] = useState({});

  // صفحة التنقل داخل المودال
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 4;
  const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));
const token = user?.token;
  const isSchedulerAdmin = user?.userType?.toLowerCase() === "scheduler_admin";

  const fetchFiles = async (date = null, search = "") => {
    setLoading(true);
    setError("");
    setNoDataMessage("");
    try {
      let url =
        "https://sewarwellnessclinic1.runasp.net/api/FilesPage/files?all=false";

      if (date) url += `&date=${encodeURIComponent(date)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await axios.get(url);
      setFiles(response.data);

      if (response.data.length === 0) {
        if (date && search) {
          setNoDataMessage("⚠️ لا توجد ملفات لهذا التاريخ والبحث المدخل.");
        } else if (date) {
          setNoDataMessage("⚠️ لا توجد ملفات لهذا التاريخ.");
        } else if (search) {
          setNoDataMessage(
            "⚠️ لا توجد ملفات مطابقة لاسم المريض أو رقم الهوية."
          );
        } else {
          setNoDataMessage("⚠️ لا توجد ملفات.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ فشل تحميل البيانات من السيرفر، حاول لاحقًا.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth", // لو بدك بدون حركة احذفها
  });
}, []);


  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSearch = async (term) => {
    setSearchTerm(term);

    // استخدم التعريف العام dateRegex بدل إنشاء واحد جديد
    const dateMatch = term.match(dateRegex);
    const date = dateMatch ? dateMatch[0] : null;

    const searchWithoutDate = date ? term.replace(dateRegex, "").trim() : term;

    await fetchFiles(date, searchWithoutDate);
  };

  const filteredFiles = files.filter((file) => {
    const dateRegex = /\b([0-2]?\d|3[01])\/(0?\d|1[0-2])\/\d{4}\b/;
    const termWithoutDate = searchTerm
      .replace(dateRegex, "")
      .trim()
      .toLowerCase();
    return (
      file.fullName?.toLowerCase().includes(termWithoutDate) ||
      file.idNumber?.toString().includes(termWithoutDate)
    );
  });

  const handleFetchReports = async (childId) => {
    if (!childId) return alert("خطأ: رقم تعريف المريض غير موجود.");

    try {
      const response = await axios.get(
        `https://sewarwellnessclinic1.runasp.net/api/FilesPage/child-reports?childId=${childId}`
      );
      const data = response.data;
      console.log("بيانات التقارير من الباك:", data);

      if (data.reportsCount > 0 && data.reports?.length > 0) {
        setModalData({
          ...data,
          fullName: files.find((f) => f.id === childId)?.fullName,
          gender: data.gender,
          reports: data.reports,
          reportIds: data.reports.map((r) => r.id), // نحولها لحقل reportIds عشان باقي الكود يشتغل كما هو
        });
      } else {
        alert("لا توجد تقارير لهذا المريض.");
      }
    } catch (err) {
      console.error(err);
      alert("فشل جلب التقارير من السيرفر.");
    }
  };

  const handleCloseModal = () => setModalData(null);

  const handleOpenReport = async (reportId) => {
    try {
      const response = await axios.get(
        `https://sewarwellnessclinic1.runasp.net/api/FilesPage/report-details/${reportId}`
      );

      const reportDetails = response.data;

      // خذ قيمة name من السيرفر
      const numericGender = Number(reportDetails.name);

      console.log("value from API:", numericGender);

      // توجيه حسب القيمة
      navigate(
        numericGender === 0
          ? `/ReportPreviewKids/${reportId}`
          : `/ReportPreviewWomen/${reportId}`,
        { state: { reportDetails } }
      );

      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("فشل جلب بيانات التقرير من السيرفر.");
    }
  };

  const [deleteMessage, setDeleteMessage] = useState(""); // رسالة نجاح الحذف

  const handleDeleteReport = async (reportId) => {
    const confirmDelete = window.confirm(
      "هل أنت متأكد أنك تريد حذف هذا التقرير؟"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://sewarwellnessclinic1.runasp.net/api/FilesPage/delete-report/${reportId}`
      );

      // تحديث بيانات المودال بعد الحذف
      setModalData((prev) => ({
        ...prev,
        reports: prev.reports.filter((r) => r.id !== reportId),
        reportIds: prev.reportIds.filter((id) => id !== reportId),
      }));

      // عرض رسالة نجاح
      setDeleteMessage("تم حذف التقرير بنجاح ✅");

      // اخفاء الرسالة بعد 3 ثواني
      setTimeout(() => setDeleteMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("فشل حذف التقرير.");
    }
  };

  const handleReportNameSave = async (reportId) => {
    const newName = reportNames[reportId];
    if (!newName) return;

    try {
      await axios.put(
        `https://sewarwellnessclinic1.runasp.net/api/FilesPage/update-report-name/${reportId}`,
        { reportName: newName }
      );

      // تحديث الاسم في المودال محليًا
      setModalData((prev) => ({
        ...prev,
        reports: prev.reports.map((r) =>
          r.id === reportId ? { ...r, reportName: newName } : r
        ),
      }));

      alert("تم تحديث اسم التقرير بنجاح ✅");
    } catch (err) {
      console.error(err);
      alert("فشل تحديث اسم التقرير.");
    }
  };
  const handleEditPhone = async (childId) => {
  // 1️⃣ فتح prompt لأخذ الرقم الجديد
  const newPhone = window.prompt("أدخل رقم الهاتف الجديد:");
  if (!newPhone) return; // إذا ضغط على إلغاء أو ترك الحقل فارغ

  try {
    // 2️⃣ إرسال الطلب للـ API
    const url = `https://sewarwellnessclinic1.runasp.net/api/FilesPage/update-phone/${childId}`;
    await axios.put(
      url,
      { phoneNumber: newPhone },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 3️⃣ تحديث الـ state محلياً ليظهر الرقم الجديد فوراً
   setFiles((prevFiles) =>
  prevFiles.map((f) =>
    f.id === childId ? { ...f, phonenumber: newPhone } : f
  )
);


    alert("تم تحديث رقم الهاتف بنجاح ✅");
  } catch (err) {
    console.error(err);
    alert("فشل تحديث رقم الهاتف.");
  }
};



  useEffect(() => {
    // كلما تغيرت بيانات المودال (عند فتح مودال جديد)
    if (modalData) {
      const totalReports = modalData.reportIds?.length || 0;
      const totalPages = Math.max(1, Math.ceil(totalReports / reportsPerPage));
      setCurrentPage(totalPages); // خلي آخر صفحة تظهر أول
    }
  }, [modalData]);

  const handleCreateReport = async () => {
    try {
      const response = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/FilesPage/create-report",
        { childId: modalData.childId }
      );

      console.log("رد السيرفر عند إنشاء التقرير:", response.data);

      const newReport = response.data;

      // لو الرد ما فيه reportId نوقف
      if (!newReport.reportId) {
        alert("حدث خطأ أثناء إنشاء التقرير.");
        return;
      }

      const gender = Number(newReport.genderr); // 0 أو 1

      // نعمل انتقال حسب الجندر
      navigate(
        gender === 0
          ? `/ReportPreviewKids/${newReport.reportId}`
          : `/ReportPreviewWomen/${newReport.reportId}`,
        { state: { reportDetails: newReport } }
      );

      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("فشل إنشاء التقرير.");
    }
  };

  const dateRegex = /\b([0-2]?\d|3[01])\/(0?\d|1[0-2])\/\d{4}\b/;
  const isSearchingByDate = dateRegex.test(searchTerm);

  // الشرط الجديد
  const showAppointmentColumn = searchTerm.trim() === "" || isSearchingByDate;

  return (
    <div
      className="container"
      dir="rtl"
      style={{
        minHeight: "calc(100vh - 200px)",
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      <div
        className="card shadow-lg p-4 p-md-5 border-0 rounded-4"
        style={{ width: "100%", margin: "0 auto" }}
      >
        <h3 className="text-center mb-4 fw-bold" style={{ color: accentColor }}>
          📁 ملفات المرضى
        </h3>

       <div className="mb-4 d-flex justify-content-center">
  <input
    type="text"
    className="form-control rounded-3 shadow-sm text-center"
    placeholder="ابحث بالاسم أو رقم الهوية أو التاريخ ( dd/mm/yyyy )"
    style={{
      border: `2px solid ${accentColor}`,
      width: "100%", // 👈 خلي العرض 100% افتراضي
      maxWidth: "500px", // 👈 الحد الأقصى للعرض على الشاشات الكبيرة
      direction: "rtl",
      textAlign: "center",
    }}
    value={searchTerm}
    onChange={(e) => handleSearch(e.target.value)}
  />
</div>


        {loading && (
          <div className="text-center text-secondary py-3">
            <div
              className="spinner-border"
              role="status"
              style={{ color: accentColor }}
            ></div>
            <p className="mt-2">جاري تحميل البيانات...</p>
          </div>
        )}

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && noDataMessage && (
          <div className="alert alert-warning text-center">{noDataMessage}</div>
        )}

        {!loading && filteredFiles.length > 0 && (
          <div className="table-responsive">  {/* <-- هنا */}
    <table className="table table-hover table-bordered text-center align-middle" style={{ width: "100%", tableLayout: "fixed" }}>
    



              <thead
                style={{
                  backgroundColor: accentColor,
                  color: "#fff",
                  fontSize: "1.1rem", // ⬅️ تكبير الخط
                  fontWeight: "700", // ⬅️ خط أوضح
                }}
              >
                <tr>
                  <th style={{ width: "20%" }}>رقم المريض</th>
                  <th style={{ width: "20%" }}>اسم المريض</th>
                  {showAppointmentColumn && (
                    <th style={{ width: "20%" }}>موعد الزيارة</th>
                  )}
                  {showAppointmentColumn && (
                    <th style={{ width: "20%" }}>مكان الجلسة</th>
                  )}
                  <th style={{ width: "20%" }}>رقم الهوية</th>
                  <th style={{ width: "22%" }}>رقم الهاتف</th>
                  <th style={{ width: "20%" }}>المواعيد</th>
                  <th style={{ width: "20%" }}>التقارير</th>
                </tr>
              </thead>
            <tbody>
  {filteredFiles.map((file, index) => {
    console.log(
      "file.appointmentType:",
      file.appointmentType,
      typeof file.appointmentType
    );

    return (
      <tr
        key={index}
        data-highlight={file.appointmentType ? "true" : "false"}
      >
        <td data-label="رقم المريض">{index + 1}</td>
        <td data-label="اسم المريض" className="fw-semibold">
          {file.fullName}
        </td>
        {showAppointmentColumn && (
          <td data-label="موعد الزيارة" className="fw-semibold">
            {file.appointmentHour
              ? file.appointmentHour.split(":").slice(0, 2).join(":")
              : ""}
          </td>
        )}
        {showAppointmentColumn && (
          <td data-label="مكان الجلسة">
            {file.appointmentLocation ? file.appointmentLocation : ""}
          </td>
        )}
        <td data-label="رقم الهوية">{file.idNumber}</td>


                    
<td style={{ direction: "ltr", textAlign: "right" }}>
  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
    <span style={{ marginLeft: "10px" }}>{file.phonenumber}</span>
  {isSchedulerAdmin && (
  <button
    onClick={() => handleEditPhone(file.id)}
    style={{
      background: "none",
      border: "none",
      padding: "0",
      marginLeft: "5px",
      cursor: "pointer"
    }}
    title="تعديل الرقم"
  >
    <i className="bi bi-pencil-fill" style={{ fontSize: "14px", color: "#2a7371" }}></i>
  </button>
)}

  </div>
</td>




        
        <td data-label="المواعيد">
          <button
            type="button"
            className="btn btn-sm"
            style={{
              backgroundColor: accentColor,
              color: "#fff",
              fontWeight: 600,
              padding: "10px 18px",
              fontSize: "1rem",
              borderRadius: "8px",
            }}
            onClick={() =>
              navigate("/visites", {
                state: {
                  childId: file.id,
                  fullName: file.fullName,
                  gender: file.gender,
                },
              })
            }
          >
            المواعيد
          </button>
        </td>
        <td data-label="التقارير">
          <button
            type="button"
            className="btn btn-sm"
            style={{
              backgroundColor: accentColor,
              color: "#fff",
              fontWeight: 600,
              padding: "10px 18px",
              fontSize: "1rem",
              borderRadius: "8px",
            }}
            onClick={() => handleFetchReports(file.id)}
          >
            التقارير
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

            </table>
          </div>
        )}

        {modalData && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div
              className="modal-dialog modal-dialog-centered custom-modal-width"
              role="document"
            >
              <div
                className="modal-content rounded-4 shadow-lg border-0"
                style={{
                  backgroundColor: "#2a7371",
                  color: "#f0e4d7",
                  border: `3px solid ${accentColor}`,
                }}
              >
                <div className="modal-header border-bottom-0">
                  <h6 className="modal-title fw-bold text-center w-100">
                    تقارير{" "}
                    {modalData.fullName
                      ? modalData.fullName
                      : `تقرير ${currentPage}`}
                  </h6>
                </div>

                <div className="modal-body text-center">
                  {(() => {
                    const reports = modalData.reports || [];
                    const totalReports = reports.length;
                    const totalPages = Math.max(
                      1,
                      Math.ceil(totalReports / reportsPerPage)
                    );
                    const startIdx = (currentPage - 1) * reportsPerPage;
                    const visibleReports = reports.slice(
                      startIdx,
                      startIdx + reportsPerPage
                    );

                    return (
                      <>
                        {/* أزرار التقارير */}
                        <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                          {visibleReports.map((report, idx) => {
                            const name = report.reportName
                              ? report.reportName.trim()
                              : "";
                            const isInvalidName =
                              name === "" ||
                              name === "غير محدد" ||
                              name.toLowerCase() === "undefined" ||
                              name.toLowerCase() === "null" ||
                              name === null;
                            const reportLabel = isInvalidName
                              ? `تقرير ${startIdx + idx + 1}`
                              : name;

                            return (
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{
                                  border: "2px solid #f0e4d7",
                                  color: "#f0e4d7",
                                  fontSize: "0.85rem",
                                  padding: "4px 8px",
                                  minWidth: "120px", // زيادة الحجم الأدنى
                                  maxWidth: "250px", // زيادة الحجم الأعلى
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <input
                                  type="text"
                                  value={reportNames[report.id] ?? reportLabel}
                                  onChange={(e) =>
                                    setReportNames((prev) => ({
                                      ...prev,
                                      [report.id]: e.target.value,
                                    }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      handleReportNameSave(report.id);
                                  }}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#f0e4d7",
                                    fontSize: "0.85rem",
                                    outline: "none",
                                    flexGrow: 1, // تجعل الـ input يملأ المساحة المتاحة
                                    minWidth: "0", // لتجنب مشاكل Flexbox
                                  }}
                                />

                                <button
                                  onClick={() =>
                                    handleOpenReport(report.id, report.name)
                                  }
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#f0e4d7",
                                    cursor: "pointer",
                                    fontSize: "0.85rem",
                                    marginRight: "5px",
                                  }}
                                >
                                  📄 فتح
                                </button>

                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteReport(report.id);
                                  }}
                                  title="حذف التقرير"
                                  style={{
                                    color: "#ff4d4f",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  🗑️
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* دوائر الصفحات */}
                        {totalReports > reportsPerPage && (
                          <div
                            className="d-flex justify-content-center align-items-center mt-3"
                            style={{ flexDirection: "row" }}
                          >
                            {Array.from({ length: totalPages }).map(
                              (_, pageIndex) => (
                                <div
                                  key={pageIndex}
                                  onClick={() => setCurrentPage(pageIndex + 1)}
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "50%",
                                    margin: "0 6px",
                                    cursor: "pointer",
                                    backgroundColor:
                                      currentPage === pageIndex + 1
                                        ? "#f0e4d7"
                                        : "rgba(240,228,215,0.4)",
                                    transform:
                                      currentPage === pageIndex + 1
                                        ? "scale(1.3)"
                                        : "scale(1)",
                                    transition: "all 0.3s ease",
                                  }}
                                ></div>
                              )
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {deleteMessage && (
                  <div className="alert alert-success text-center">
                    {deleteMessage}
                  </div>
                )}

                <div className="modal-footer border-top-0 w-100">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <button
                      type="button"
                      className="btn fw-bold py-2"
                      style={{
                        backgroundColor: "#f0e4d7",
                        color: accentColor,
                        fontSize: "0.9rem",
                      }}
                      onClick={handleCreateReport}
                    >
                      + إضافة تقرير
                    </button>

                    {/* زر إغلاق */}
                    <button
                      type="button"
                      className="btn fw-bold py-2"
                      style={{
                        backgroundColor: "#f0e4d7",
                        color: accentColor,
                        fontSize: "0.9rem",
                      }}
                      onClick={handleCloseModal}
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesPage;

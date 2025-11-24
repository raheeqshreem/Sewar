import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const FilesPagePatient = () => {
  const accentColor = "#2a7371";
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [reportNames, setReportNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 4;
  const [deleteMessage, setDeleteMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // جلب ملفات المرضى
  const fetchFiles = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      const url = "https://sewarwellnessclinic1.runasp.net/api/FilesPage/mother-files";
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = response.data;
      if (search) {
        const term = search.toLowerCase();
        data = data.filter(
          (f) =>
            f.fullName?.toLowerCase().includes(term) ||
            f.idNumber?.toString().includes(term)
        );
      }

      setFiles(data);
    } catch (err) {
      console.error(err);
      setError("⚠️ فشل تحميل البيانات من السيرفر.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // جلب تقارير المريض وفتح المودال
  const handleFetchReports = async (childId) => {
    try {
      const response = await axios.get(
        `https://sewarwellnessclinic1.runasp.net/api/FilesPage/child-reports?childId=${childId}`
      );
      const data = response.data;

      if (data.reportsCount > 0 && data.reports?.length > 0) {
        setModalData({
          ...data,
          fullName: files.find((f) => f.id === childId)?.fullName,
          reports: data.reports,
          reportIds: data.reports.map((r) => r.id),
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
      const numericGender = Number(reportDetails.name);

      navigate(
        numericGender === 0
          ? `/ReportKids/${reportId}`
          : `/ReportWomen/${reportId}`,
        { state: { reportDetails } }
      );

      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("فشل جلب بيانات التقرير من السيرفر.");
    }
  };

  const handleDeleteReport = async (reportId) => {
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا التقرير؟");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://sewarwellnessclinic1.runasp.net/api/FilesPage/delete-report/${reportId}`
      );

      setModalData((prev) => ({
        ...prev,
        reports: prev.reports.filter((r) => r.id !== reportId),
        reportIds: prev.reportIds.filter((id) => id !== reportId),
      }));

      setDeleteMessage("تم حذف التقرير بنجاح ✅");
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

  const handleCreateReport = async () => {
    try {
      const response = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/FilesPage/create-report",
        { childId: modalData.childId }
      );

      const newReport = response.data;

      if (!newReport.reportId) {
        alert("حدث خطأ أثناء إنشاء التقرير.");
        return;
      }

      const gender = Number(newReport.genderr);

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

  useEffect(() => {
    if (modalData) {
      const totalReports = modalData.reportIds?.length || 0;
      const totalPages = Math.max(1, Math.ceil(totalReports / reportsPerPage));
      setCurrentPage(totalPages);
    }
  }, [modalData]);

  return (
    <div className="container" dir="rtl" style={{ minHeight: "calc(100vh - 200px)", paddingTop: "120px", paddingBottom: "80px" }}>
      <div className="card shadow-lg p-4 border-0 rounded-4" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h3 className="text-center mb-4 fw-bold" style={{ color: accentColor }}>
          📁 ملفات المرضى
        </h3>

        <div className="mb-4 text-center">
          <input
            type="text"
            className="form-control rounded-3 shadow-sm text-center"
            placeholder="ابحث بالاسم أو رقم الهوية"
            style={{ border: `2px solid ${accentColor}`, maxWidth: "100%" }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              fetchFiles(e.target.value);
            }}
          />
        </div>

        {loading && <div className="text-center text-secondary py-3">
          <div className="spinner-border" role="status" style={{ color: accentColor }}></div>
          <p className="mt-2">جاري تحميل البيانات...</p>
        </div>}

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && files.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover table-bordered text-center align-middle">
              <thead style={{ backgroundColor: accentColor, color: "#fff" }}>
                <tr>
                  <th>الاسم الكامل</th>
                  <th>رقم الهوية</th>
                  <th>المواعيد</th>
                  <th>التقارير</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="fw-semibold">{file.fullName}</td>
                    <td>{file.idNumber}</td>
                    <td>
                      <button
                        className="btn btn-sm fw-bold"
                        style={{ backgroundColor: accentColor, color: "#fff" }}
                        onClick={() => navigate(`/VisitePatient/${file.id}`, { state: { childId: file.id, fullName: file.fullName, gender: file.gender } })}
                      >
                        المواعيد
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm fw-bold"
                        style={{ backgroundColor: accentColor, color: "#fff" }}
                        onClick={() => handleFetchReports(file.id)}
                      >
                        التقارير
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* مودال التقارير */}
       {modalData && (
  <div className="modal show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog modal-dialog-centered custom-modal-width" role="document">
      <div className="modal-content rounded-4 shadow-lg border-0" style={{ backgroundColor: "#2a7371", color: "#f0e4d7", border: `3px solid ${accentColor}` }}>
        <div className="modal-header border-bottom-0">
          <h6 className="modal-title fw-bold text-center w-100">
            تقارير {modalData.fullName}
          </h6>
        </div>

        <div className="modal-body text-center">
          {(() => {
            const reports = modalData.reports || [];
            const totalReports = reports.length;
            const totalPages = Math.max(1, Math.ceil(totalReports / reportsPerPage));
            const startIdx = (currentPage - 1) * reportsPerPage;
            const visibleReports = reports.slice(startIdx, startIdx + reportsPerPage);

            return (
              <>
                {/* أزرار التقارير */}
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                  {visibleReports.map((report, idx) => {
                    const name = report.reportName?.trim() || "";
                    const isInvalid = !name || ["غير محدد", "undefined", "null"].includes(name.toLowerCase());
                    const reportLabel = isInvalid ? `تقرير ${startIdx + idx + 1}` : name;

                    return (
                      <button
                        key={report.id}
                        className="btn"
                        style={{
                          backgroundColor: "#f0e4d7",
                          color: accentColor,
                          fontWeight: "600",
                          minWidth: "120px",
                          maxWidth: "250px",
                          whiteSpace: "nowrap",
                          margin: "2px",
                        }}
                        onClick={() => handleOpenReport(report.id)}
                      >
                        {reportLabel}
                      </button>
                    );
                  })}
                </div>

                {/* دوائر الصفحات */}
                {totalReports > reportsPerPage && (
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    {Array.from({ length: totalPages }).map((_, pageIndex) => (
                      <div
                        key={pageIndex}
                        onClick={() => setCurrentPage(pageIndex + 1)}
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          margin: "0 6px",
                          cursor: "pointer",
                          backgroundColor: currentPage === pageIndex + 1 ? "#f0e4d7" : "rgba(240,228,215,0.4)",
                          transform: currentPage === pageIndex + 1 ? "scale(1.3)" : "scale(1)",
                          transition: "all 0.3s ease",
                        }}
                      ></div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>

        <div className="modal-footer border-top-0 w-100">
          <button
            type="button"
            className="btn fw-bold py-2"
            style={{ backgroundColor: "#f0e4d7", color: accentColor, fontSize: "0.9rem" }}
            onClick={handleCloseModal}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default FilesPagePatient;

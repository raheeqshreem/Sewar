/*import "bootstrap/dist/css/bootstrap.min.css";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, Trash2, CornerUpRight } from "lucide-react";
import Loader from "../../Components/loader/Loader";

const MyInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // تعديل الاستشارة
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // تعديل الرد
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");
  const [editMessageImages, setEditMessageImages] = useState([]);
  const [editMessageImagesToDelete, setEditMessageImagesToDelete] = useState([]);

  const [newReplyToScroll, setNewReplyToScroll] = useState(null);
  const inquiryRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchInquiries();

    if (location.state?.newReply) {
      const reply = location.state.newReply;

      setInquiries(prev =>
        prev.map(i => {
          if (i.id === reply.consultationId) {
            if (reply.parentMessageId) {
              return {
                ...i,
                messages: i.messages.map(msg =>
                  msg.id === reply.parentMessageId
                    ? { ...msg, replies: [...(msg.replies || []), reply] }
                    : msg
                )
              };
            }
            return { ...i, messages: [...(i.messages || []), reply] };
          }
          return i;
        })
      );

      setNewReplyToScroll(reply.parentMessageId || reply.consultationId);
      navigate(location.pathname, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (newReplyToScroll) {
      const ref = inquiryRefs.current[newReplyToScroll];
      if (ref) ref.scrollIntoView({ behavior: "smooth", block: "start" });
      setNewReplyToScroll(null);
    }
  }, [inquiries, newReplyToScroll]);

  const fetchInquiries = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      toast.error("يرجى تسجيل الدخول أولاً!");
      localStorage.setItem("redirectAfterLogin", "/myinquiry");
      navigate("/signin");
      return;
    }
    try {
      const res = await axios.get(
        "https://sewarwellnessclinic1.runasp.net/api/Consultation/my",
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setInquiries(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ خطأ عند جلب الاستشارات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    console.log("ID الاستشارة اللي رح تنحذف:", id);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.delete(
        `https://sewarwellnessclinic1.runasp.net/api/Consultation/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setInquiries(prev => prev.filter(i => i.id !== id));
      toast.success("تم الحذف");
    } catch (err) {
      console.error(err);
      toast.error("❌ فشل الحذف");
    }
  };

  const handleEditOpen = (inq) => {
    setEditId(inq.id);
    setEditText(inq.questionText || "");
    const normalizedImages = inq.images?.map(img => ({
      id: img.id ?? null,
      imageUrl: img.imageUrl ?? img,
    })) || [];
    setEditImages(normalizedImages);
    setImagesToDelete([]);
  };

  const handleEditImageChange = (e) => {
    setEditImages(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeEditImage = (index) => {
    const img = editImages[index];
    if (img.id) setImagesToDelete(prev => [...prev, img.id]);
    setEditImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSave = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      if (editText) formData.append("QuestionText", editText);

      const newImages = editImages.filter(img => img instanceof File);
      const existingImages = editImages.filter(img => !(img instanceof File));

      newImages.forEach(file => formData.append("NewImages", file));
      existingImages.forEach(img => { if (img.id) formData.append("ImagesToKeep", img.id); });
      imagesToDelete.forEach(id => formData.append("ImagesToDelete", id.toString()));

      await axios.put(
        `https://sewarwellnessclinic1.runasp.net/api/Consultation/edit/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      toast.success("✅ تم تعديل الاستشارة بنجاح");
      setEditId(null);
      setEditImages([]);
      setImagesToDelete([]);
      fetchInquiries();
    } catch (err) {
      console.error(err);
      toast.error("❌ فشل تعديل الاستشارة");
    }
  };

  const removeEditMessageImage = (index) => {
    const img = editMessageImages[index];
    if (img.id) setEditMessageImagesToDelete(prev => [...prev, img.id]);
    setEditMessageImages(prev => prev.filter((_, i) => i !== index));
  };

  // دالة تحديث الردود المتداخلة بشكل متكرر
  const updateMessageRecursively = (messages, messageId, newData) => {
    return messages.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, ...newData };
      }
      if (msg.replies && msg.replies.length > 0) {
        return { ...msg, replies: updateMessageRecursively(msg.replies, messageId, newData) };
      }
      return msg;
    });
  };

  const handleEditReply = async (messageId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      formData.append("MessageText", editMessageText);

      const newFiles = editMessageImages.filter(img => img instanceof File);
      newFiles.forEach(file => formData.append("NewImages", file));
      editMessageImagesToDelete.forEach(id => formData.append("ImagesToDelete", id.toString()));

      const res = await axios.put(
        `https://sewarwellnessclinic1.runasp.net/api/Consultation/reply/${messageId}`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' } }
      );

      const updatedImages = res.data.images?.map(img => ({
        id: img.id,
        imageUrl: img.imageUrl
      })) || [];

      // تحديث الرسائل المتداخلة باستخدام الدالة recursive
      setInquiries(prev =>
        prev.map(inq => ({
          ...inq,
          messages: updateMessageRecursively(inq.messages, messageId, { messageText: editMessageText, senderName: res.data.senderName, images: updatedImages })
        }))
      );

      setEditMessageId(null);
      setEditMessageText("");
      setEditMessageImages([]);
      setEditMessageImagesToDelete([]);

      toast.success("✅ تم تعديل الرد بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("❌ فشل تعديل الرد");
    }
  };

  const renderReplies = (replies, inq) => {
    if (!replies || replies.length === 0) return null;
    return (
      <div style={{ marginTop: "10px", marginRight: "20px", borderRight: "2px solid #2a7371", paddingRight: "10px" }}>
        {replies.map((rep, rIdx) => (
          <div key={rep.id} style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "10px", marginTop: "10px", backgroundColor: "#f8f8f8" }}>
            <p style={{ marginBottom: "5px", color: "#2a7371", fontWeight: "bold" }}>{rep.senderName || "-"}</p>
            <p style={{ marginBottom: "10px", color: "#2a7371" }}>{rep.messageText}</p>

            {rep.images?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                {rep.images.map((img, i) => (
                  <img key={i} src={img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`} alt="reply-nested" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }} />
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Trash2
                color="#dc3545"
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  if (!window.confirm("هل أنت متأكد من حذف هذا الرد؟")) return;

                  console.log("ID الرد اللي رح ينحذف:", rep.id);
                  try {
                    const user = JSON.parse(localStorage.getItem("user"));
                    await axios.delete(
                      `https://sewarwellnessclinic1.runasp.net/api/Consultation/reply/${rep.id}`,
                      { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    setInquiries(prev =>
                      prev.map(i => {
                        if (i.id === inq.id) {
                          const removeReplyRecursively = (msgs, rid) => msgs.filter(m => {
                            if (m.id === rid) return false;
                            if (m.replies) m.replies = removeReplyRecursively(m.replies, rid);
                            return true;
                          });
                          return { ...i, messages: removeReplyRecursively(i.messages, rep.id) };
                        }
                        return i;
                      })
                    );
                    toast.success("تم حذف الرد");
                  } catch (err) {
                    console.error(err);
                    toast.error("❌ فشل حذف الرد");
                  }
                }}
              />
              <Edit
                color="#2a7371"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setEditMessageId(rep.id);
                  setEditMessageText(rep.messageText);
                  const normalizedImages = rep.images?.map(img => ({
                    id: img.id,
                    imageUrl: img.imageUrl
                  })) || [];
                  setEditMessageImages(normalizedImages);
                  setEditMessageImagesToDelete([]);
                }}
              />
            </div>

            {editMessageId === rep.id && (
              <div style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "15px", backgroundColor: "#f0f0f0", marginTop: "10px", textAlign: "right" }}>
                <textarea
                  className="form-control"
                  value={editMessageText}
                  onChange={(e) => setEditMessageText(e.target.value)}
                  style={{ marginBottom: "10px" }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                  {editMessageImages.map((img, index) => (
                    <div key={img.id || (img instanceof File ? img.name : index)} style={{ position: "relative" }}>
                      <img
                        src={img instanceof File ? URL.createObjectURL(img) : img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`}
                        alt="edit-reply"
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
                      />
                      <button onClick={() => removeEditMessageImage(index)} style={{ position: "absolute", top: "-5px", right: "-5px", background: "#c0392b", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}>×</button>
                    </div>
                  ))}
                </div>
                <input type="file" multiple onChange={(e) => setEditMessageImages(prev => [...prev, ...Array.from(e.target.files)])} style={{ marginBottom: "10px" }} />
                <button className="btn btn-success w-100" onClick={() => handleEditReply(rep.id)}>حفظ التعديل</button>
              </div>
            )}

            {renderReplies(rep.replies, inq)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", paddingTop: "calc(100px + 20px)" }}>
      <h2 style={{ textAlign: "center", color: "#2a7371", marginBottom: "30px" }}>استشاراتي</h2>

      {loading ? (
        <Loader />
      ) : inquiries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h3>لا توجد استشارات سابقة</h3>
        </div>
      ) : (
        inquiries.map((inq) => (
          <div key={inq.id} ref={el => inquiryRefs.current[inq.id] = el} style={{ marginBottom: "30px" }}>
            <div style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "20px", backgroundColor: "#f9f9f9", textAlign: "right" }}>
              <h5 style={{ color: "#2a7371" }}>👤 {inq.patientName || "مستخدم"}</h5>
              <p style={{ color: "#2a7371", marginBottom: "20px" }}><strong>الاستشارة:</strong> {inq.questionText || "-"}</p>

              {inq.images?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                  {inq.images.map((img, idx) => (
                    <img key={img.id || idx} src={img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`} alt="img" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }} />
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "15px" }}>
                <Trash2 color="#dc3545" style={{ cursor: "pointer" }} onClick={() => handleDelete(inq.id)} />
                <Edit color="#2a7371" style={{ cursor: "pointer" }} onClick={() => handleEditOpen(inq)} />
                <CornerUpRight color="#2a7371" style={{ cursor: "pointer" }} onClick={() => navigate(`/consultation-replies/${inq.id}`)} />
              </div>
            </div>

            {editId === inq.id && (
              <div style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "20px", backgroundColor: "#fff", marginTop: "10px", textAlign: "right" }}>
                <textarea className="form-control" value={editText} onChange={e => setEditText(e.target.value)} style={{ marginBottom: "10px" }} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                  {editImages.map((img, index) => (
                    <div key={img.id || (img instanceof File ? img.name : index)} style={{ position: "relative" }}>
                      <img src={img instanceof File ? URL.createObjectURL(img) : img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`} alt="edit" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }} />
                      <button onClick={() => removeEditImage(index)} style={{ position: "absolute", top: "-5px", right: "-5px", background: "#c0392b", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}>×</button>
                    </div>
                  ))}
                </div>
                <input type="file" multiple onChange={handleEditImageChange} style={{ marginBottom: "10px" }} />
                <button className="btn btn-success w-100" onClick={() => handleEditSave(editId)}>حفظ التعديل</button>
              </div>
            )}

            {inq.messages?.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                {inq.messages.map(msg => (
                  <div key={msg.id} style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "10px", marginTop: "10px", backgroundColor: "#fff", textAlign: "right" }}>
                    <p style={{ marginBottom: "5px", color: "#2a7371", fontWeight: "bold" }}>{msg.senderName || "-"}</p>
                    <p style={{ marginBottom: "10px", color: "#2a7371" }}>{msg.messageText}</p>

                    {msg.images?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                        {msg.images.map((img, i) => (
                          <img
                            key={i}
                            src={img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`}
                            alt="reply"
                            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
                          />
                        ))}
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <Trash2
                        color="#dc3545"
                        style={{ cursor: "pointer" }}
                        onClick={async () => {
                          if (!window.confirm("هل أنت متأكد من حذف هذا الرد؟")) return;

                          console.log("ID الرد اللي رح ينحذف:", msg.id);
                          try {
                            const user = JSON.parse(localStorage.getItem("user"));
                            await axios.delete(
                              `https://sewarwellnessclinic1.runasp.net/api/Consultation/reply/${msg.id}`,
                              { headers: { Authorization: `Bearer ${user.token}` } }
                            );
                            setInquiries(prev =>
                              prev.map(i => {
                                if (i.id === inq.id) {
                                  const removeReplyRecursively = (msgs, rid) => msgs.filter(m => {
                                    if (m.id === rid) return false;
                                    if (m.replies) m.replies = removeReplyRecursively(m.replies, rid);
                                    return true;
                                  });
                                  return { ...i, messages: removeReplyRecursively(i.messages, msg.id) };
                                }
                                return i;
                              })
                            );
                            toast.success("تم حذف الرد");
                          } catch (err) {
                            console.error(err);
                            toast.error("❌ فشل حذف الرد");
                          }
                        }}
                      />
                      <Edit
                        color="#2a7371"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setEditMessageId(msg.id);
                          setEditMessageText(msg.messageText);
                          const normalizedImages = msg.images?.map(img => ({
                            id: img.id,
                            imageUrl: img.imageUrl
                          })) || [];
                          setEditMessageImages(normalizedImages);
                          setEditMessageImagesToDelete([]);
                        }}
                      />
                      <CornerUpRight
                        color="#2a7371"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/consultation-replies/${inq.id}`, { state: { replyToMessageId: msg.id } })
                        }
                      />
                    </div>

                    {editMessageId === msg.id && (
                      <div style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "15px", backgroundColor: "#f0f0f0", marginTop: "10px", textAlign: "right" }}>
                        <textarea
                          className="form-control"
                          value={editMessageText}
                          onChange={(e) => setEditMessageText(e.target.value)}
                          style={{ marginBottom: "10px" }}
                        />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                          {editMessageImages.map((img, index) => (
                            <div key={img.id || (img instanceof File ? img.name : index)} style={{ position: "relative" }}>
                              <img
                                src={img instanceof File ? URL.createObjectURL(img) : img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`}
                                alt="edit-reply"
                                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
                              />
                              <button onClick={() => removeEditMessageImage(index)} style={{ position: "absolute", top: "-5px", right: "-5px", background: "#c0392b", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}>×</button>
                            </div>
                          ))}
                        </div>
                        <input type="file" multiple onChange={(e) => setEditMessageImages(prev => [...prev, ...Array.from(e.target.files)])} style={{ marginBottom: "10px" }} />
                        <button className="btn btn-success w-100" onClick={() => handleEditReply(msg.id)}>حفظ التعديل</button>
                      </div>
                    )}

                    {renderReplies(msg.replies, inq)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyInquiry;*/



import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, Trash2, CornerUpRight } from "lucide-react";
import Loader from "../../Components/loader/Loader";

const MyInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");
  const [editMessageImages, setEditMessageImages] = useState([]);
  const [editMessageImagesToDelete, setEditMessageImagesToDelete] = useState([]);

  const [newReplyToScroll, setNewReplyToScroll] = useState(null);
  const inquiryRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchInquiries();

    if (location.state?.newReply) {
      const reply = location.state.newReply;

      setInquiries(prev =>
        prev.map(i => {
          if (i.id === reply.consultationId) {
            if (reply.parentMessageId) {
              return {
                ...i,
                messages: i.messages.map(msg =>
                  msg.id === reply.parentMessageId
                    ? { ...msg, replies: [...(msg.replies || []), reply] }
                    : msg
                )
              };
            }
            return { ...i, messages: [...(i.messages || []), reply] };
          }
          return i;
        })
      );

      setNewReplyToScroll(reply.parentMessageId || reply.consultationId);
      navigate(location.pathname, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (newReplyToScroll) {
      const ref = inquiryRefs.current[newReplyToScroll];
      if (ref) ref.scrollIntoView({ behavior: "smooth", block: "start" });
      setNewReplyToScroll(null);
    }
  }, [inquiries, newReplyToScroll]);

  const fetchInquiries = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      toast.error("يرجى تسجيل الدخول أولاً!");
      localStorage.setItem("redirectAfterLogin", "/myinquiry");
      navigate("/signin");
      return;
    }
    try {
      const res = await axios.get(
        "https://sewarwellnessclinic1.runasp.net/api/Consultation/my",
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setInquiries(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ خطأ عند جلب الاستشارات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.delete(
        `https://sewarwellnessclinic1.runasp.net/api/Consultation/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setInquiries(prev => prev.filter(i => i.id !== id));
      toast.success("تم الحذف");
    } catch (err) {
      console.error(err);
      toast.error("❌ فشل الحذف");
    }
  };

  const handleEditOpen = (inq) => {
    setEditId(inq.id);
    setEditText(inq.questionText || "");
    const normalizedImages = inq.images?.map(img => ({
      id: img.id ?? null,
      imageUrl: img.imageUrl ?? img,
    })) || [];
    setEditImages(normalizedImages);
    setImagesToDelete([]);
  };

  const handleEditImageChange = (e) => {
    setEditImages(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeEditImage = (index) => {
    const img = editImages[index];
    if (img.id) setImagesToDelete(prev => [...prev, img.id]);
    setEditImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSave = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      if (editText) formData.append("QuestionText", editText);

      const newImages = editImages.filter(img => img instanceof File);
      const existingImages = editImages.filter(img => !(img instanceof File));

      newImages.forEach(file => formData.append("NewImages", file));
      existingImages.forEach(img => { if (img.id) formData.append("ImagesToKeep", img.id); });
      imagesToDelete.forEach(id => formData.append("ImagesToDelete", id.toString()));

      await axios.put(
        `https://sewarwellnessclinic1.runasp.net/api/Consultation/edit/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      toast.success("✅ تم تعديل الاستشارة بنجاح");
      setEditId(null);
      setEditImages([]);
      setImagesToDelete([]);
      fetchInquiries();
    } catch (err) {
      console.error(err);
      toast.error("❌ فشل تعديل الاستشارة");
    }
  };

  const removeEditMessageImage = (index) => {
    const img = editMessageImages[index];
    if (img.id) setEditMessageImagesToDelete(prev => [...prev, img.id]);
    setEditMessageImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateMessageRecursively = (messages, messageId, newData) => {
    return messages.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, ...newData };
      }
      if (msg.replies && msg.replies.length > 0) {
        return { ...msg, replies: updateMessageRecursively(msg.replies, messageId, newData) };
      }
      return msg;
    });
  };

  const handleEditReply = async (messageId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      formData.append("MessageText", editMessageText);

      const newFiles = editMessageImages.filter(img => img instanceof File);
      newFiles.forEach(file => formData.append("NewImages", file));
      editMessageImagesToDelete.forEach(id => formData.append("ImagesToDelete", id.toString()));

      const res = await axios.put(
        `https://sewarwellnessclinic1.runasp.net/api/Consultation/reply/${messageId}`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' } }
      );

      const updatedImages = res.data.images?.map(img => ({
        id: img.id,
        imageUrl: img.imageUrl
      })) || [];

      setInquiries(prev =>
        prev.map(inq => ({
          ...inq,
          messages: updateMessageRecursively(inq.messages, messageId, { messageText: editMessageText, senderName: res.data.senderName, images: updatedImages })
        }))
      );

      setEditMessageId(null);
      setEditMessageText("");
      setEditMessageImages([]);
      setEditMessageImagesToDelete([]);

      toast.success("✅ تم تعديل الرد بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("❌ فشل تعديل الرد");
    }
  };

  const renderReplies = (replies, inq) => {
    if (!replies || replies.length === 0) return null;
    return (
      <div style={{ marginTop: "10px", marginRight: "20px", borderRight: "2px solid #2a7371", paddingRight: "10px" }}>
        {replies.map((rep, rIdx) => (
          <div key={rep.id} style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "10px", marginTop: "10px", backgroundColor: "#f8f8f8" }}>
            <p style={{ marginBottom: "5px", color: "#2a7371", fontWeight: "bold" }}>{rep.senderName || "-"}</p>
            <p style={{ marginBottom: "10px", color: "#2a7371" }}>{rep.messageText}</p>

            {rep.images?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                {rep.images.map((img, i) => (
                  <img key={i} src={img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`} alt="reply-nested" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }} />
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Trash2 color="#dc3545" style={{ cursor: "pointer" }} onClick={async () => {
                if (!window.confirm("هل أنت متأكد من حذف هذا الرد؟")) return;
                try {
                  const user = JSON.parse(localStorage.getItem("user"));
                  await axios.delete(`https://sewarwellnessclinic1.runasp.net/api/Consultation/reply/${rep.id}`, { headers: { Authorization: `Bearer ${user.token}` } });
                  setInquiries(prev =>
                    prev.map(i => {
                      if (i.id === inq.id) {
                        const removeReplyRecursively = (msgs, rid) => msgs.filter(m => {
                          if (m.id === rid) return false;
                          if (m.replies) m.replies = removeReplyRecursively(m.replies, rid);
                          return true;
                        });
                        return { ...i, messages: removeReplyRecursively(i.messages, rep.id) };
                      }
                      return i;
                    })
                  );
                  toast.success("تم حذف الرد");
                } catch (err) {
                  console.error(err);
                  toast.error("❌ فشل حذف الرد");
                }
              }} />
              <Edit color="#2a7371" style={{ cursor: "pointer" }} onClick={() => {
                setEditMessageId(rep.id);
                setEditMessageText(rep.messageText);
                const normalizedImages = rep.images?.map(img => ({ id: img.id, imageUrl: img.imageUrl })) || [];
                setEditMessageImages(normalizedImages);
                setEditMessageImagesToDelete([]);
              }} />
              {/* زر الرد موجود لكل رسالة */}
              <CornerUpRight color="#2a7371" style={{ cursor: "pointer" }} onClick={() => navigate(`/consultation-replies/${inq.id}`, { state: { replyToMessageId: rep.id } })} />
            </div>

            {editMessageId === rep.id && (
              <div style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "15px", backgroundColor: "#f0f0f0", marginTop: "10px", textAlign: "right" }}>
                <textarea className="form-control" value={editMessageText} onChange={(e) => setEditMessageText(e.target.value)} style={{ marginBottom: "10px" }} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                  {editMessageImages.map((img, index) => (
                    <div key={img.id || (img instanceof File ? img.name : index)} style={{ position: "relative" }}>
                      <img src={img instanceof File ? URL.createObjectURL(img) : img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`} alt="edit-reply" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }} />
                      <button onClick={() => removeEditMessageImage(index)} style={{ position: "absolute", top: "-5px", right: "-5px", background: "#c0392b", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}>×</button>
                    </div>
                  ))}
                </div>
                <input type="file" multiple onChange={(e) => setEditMessageImages(prev => [...prev, ...Array.from(e.target.files)])} style={{ marginBottom: "10px" }} />
                <button className="btn btn-success w-100" onClick={() => handleEditReply(rep.id)}>حفظ التعديل</button>
              </div>
            )}

            {renderReplies(rep.replies, inq)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", paddingTop: "calc(100px + 20px)" }}>
      <h2 style={{ textAlign: "center", color: "#2a7371", marginBottom: "30px" }}>استشاراتي</h2>

      {loading ? (
        <Loader />
      ) : inquiries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h3>لا توجد استشارات سابقة</h3>
        </div>
      ) : (
        inquiries.map((inq) => (
          <div key={inq.id} ref={el => inquiryRefs.current[inq.id] = el} style={{ marginBottom: "30px" }}>
            <div style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "20px", backgroundColor: "#f9f9f9", textAlign: "right" }}>
              <h5 style={{ color: "#2a7371" }}>👤 {inq.patientName || "مستخدم"}</h5>
              <p style={{ color: "#2a7371", marginBottom: "20px" }}><strong>الاستشارة:</strong> {inq.questionText || "-"}</p>

              {inq.images?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                  {inq.images.map((img, idx) => (
                    <img key={img.id || idx} src={img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`} alt="img" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }} />
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "15px" }}>
                <Trash2 color="#dc3545" style={{ cursor: "pointer" }} onClick={() => handleDelete(inq.id)} />
                <Edit color="#2a7371" style={{ cursor: "pointer" }} onClick={() => handleEditOpen(inq)} />
                <CornerUpRight color="#2a7371" style={{ cursor: "pointer" }} onClick={() => navigate(`/consultation-replies/${inq.id}`)} />
              </div>
            </div>

            {editId === inq.id && (
              <div style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "20px", backgroundColor: "#fff", marginTop: "10px", textAlign: "right" }}>
                <textarea className="form-control" value={editText} onChange={e => setEditText(e.target.value)} style={{ marginBottom: "10px" }} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                  {editImages.map((img, index) => (
                    <div key={img.id || (img instanceof File ? img.name : index)} style={{ position: "relative" }}>
                      <img src={img instanceof File ? URL.createObjectURL(img) : img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`} alt="edit" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }} />
                      <button onClick={() => removeEditImage(index)} style={{ position: "absolute", top: "-5px", right: "-5px", background: "#c0392b", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}>×</button>
                    </div>
                  ))}
                </div>
                <input type="file" multiple onChange={handleEditImageChange} style={{ marginBottom: "10px" }} />
                <button className="btn btn-success w-100" onClick={() => handleEditSave(editId)}>حفظ التعديل</button>
              </div>
            )}

            {inq.messages?.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                {inq.messages.map(msg => (
                  <div key={msg.id} style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "10px", marginTop: "10px", backgroundColor: "#fff", textAlign: "right" }}>
                    <p style={{ marginBottom: "5px", color: "#2a7371", fontWeight: "bold" }}>{msg.senderName || "-"}</p>
                    <p style={{ marginBottom: "10px", color: "#2a7371" }}>{msg.messageText}</p>

                    {msg.images?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                        {msg.images.map((img, i) => (
                          <img key={i} src={img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`} alt="reply" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }} />
                        ))}
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <Trash2 color="#dc3545" style={{ cursor: "pointer" }} onClick={async () => {
                        if (!window.confirm("هل أنت متأكد من حذف هذا الرد؟")) return;
                        try {
                          const user = JSON.parse(localStorage.getItem("user"));
                          await axios.delete(`https://sewarwellnessclinic1.runasp.net/api/Consultation/reply/${msg.id}`, { headers: { Authorization: `Bearer ${user.token}` } });
                          setInquiries(prev =>
                            prev.map(i => {
                              if (i.id === inq.id) {
                                const removeReplyRecursively = (msgs, rid) => msgs.filter(m => {
                                  if (m.id === rid) return false;
                                  if (m.replies) m.replies = removeReplyRecursively(m.replies, rid);
                                  return true;
                                });
                                return { ...i, messages: removeReplyRecursively(i.messages, msg.id) };
                              }
                              return i;
                            })
                          );
                          toast.success("تم حذف الرد");
                        } catch (err) {
                          console.error(err);
                          toast.error("❌ فشل حذف الرد");
                        }
                      }} />
                      <Edit color="#2a7371" style={{ cursor: "pointer" }} onClick={() => {
                        setEditMessageId(msg.id);
                        setEditMessageText(msg.messageText);
                        const normalizedImages = msg.images?.map(img => ({ id: img.id, imageUrl: img.imageUrl })) || [];
                        setEditMessageImages(normalizedImages);
                        setEditMessageImagesToDelete([]);
                      }} />
                      {/* زر الرد موجود هنا بدون أي تغيير */}
                      <CornerUpRight color="#2a7371" style={{ cursor: "pointer" }} onClick={() => navigate(`/consultation-replies/${inq.id}`, { state: { replyToMessageId: msg.id } })} />
                    </div>

                    {editMessageId === msg.id && (
                      <div style={{ border: "1px solid #2a7371", borderRadius: "10px", padding: "15px", backgroundColor: "#f0f0f0", marginTop: "10px", textAlign: "right" }}>
                        <textarea className="form-control" value={editMessageText} onChange={(e) => setEditMessageText(e.target.value)} style={{ marginBottom: "10px" }} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end", marginBottom: "10px" }}>
                          {editMessageImages.map((img, index) => (
                            <div key={img.id || (img instanceof File ? img.name : index)} style={{ position: "relative" }}>
                              <img src={img instanceof File ? URL.createObjectURL(img) : img.imageUrl?.startsWith("http") ? img.imageUrl : `https://sewarwellnessclinic1.runasp.net${img.imageUrl}`} alt="edit-reply" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }} />
                              <button onClick={() => removeEditMessageImage(index)} style={{ position: "absolute", top: "-5px", right: "-5px", background: "#c0392b", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}>×</button>
                            </div>
                          ))}
                        </div>
                        <input type="file" multiple onChange={(e) => setEditMessageImages(prev => [...prev, ...Array.from(e.target.files)])} style={{ marginBottom: "10px" }} />
                        <button className="btn btn-success w-100" onClick={() => handleEditReply(msg.id)}>حفظ التعديل</button>
                      </div>
                    )}

                    {renderReplies(msg.replies, inq)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyInquiry;
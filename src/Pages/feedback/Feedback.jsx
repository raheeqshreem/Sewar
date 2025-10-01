/*import React from 'react'
import RatingToast from '../../Components/ratingToast/RatingToast'

export default function Feedback() {
  return (
    <div>
   
   <RatingToast/>

    
   </div>
   
  )
}*/
import React, { useEffect, useState } from "react";

const FeedbackPage = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/comments")
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "10px" }}>
      <h2>التعليقات</h2>
      {comments.length === 0 && <p>لا توجد تعليقات بعد.</p>}

      {comments.map((comment, i) => (
        <div key={i} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
          <div style={{ fontSize: "20px", color: "gold", marginBottom: "5px" }}>
            {"★".repeat(comment.stars) + "☆".repeat(5 - comment.stars)}
          </div>
          <p>{comment.feedback}</p>
          {comment.files.map((file, j) => {
            const url = `http://localhost:5000/${file}`;
            if (file.endsWith(".mp4") || file.endsWith(".webm")) {
              return <video key={j} src={url} controls style={{ width: "150px", marginRight: "5px" }} />;
            } else {
              return <img key={j} src={url} alt="preview" style={{ width: "150px", marginRight: "5px" }} />;
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default FeedbackPage;

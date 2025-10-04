import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./Components/footer/Footer";
import Navbar from "./Components/navbar/Navbar";
import Home from "./Pages/home/Home";
import Login from "./Pages/login/Login";
import Register from "./Pages/register/Register";
import Profile from "./Pages/profile/Profile";
import Appointment from "./Pages/appointment/Appointment";
import Communication from "./Pages/communication/Communication";
import Feedback from "./Pages/feedback/Feedback";
import Inquiry from "./Pages/inquiry/Inquiry";
import File from "./Pages/file/File";
import ForgetPassword from "./Pages/forgetPassword/ForgetPassword";
import ResetPassword from "./Pages/forgetPassword/ResetPassword";
import WriteFeedback from "./Pages/writeFeedback/WriteFeedback";

import ChatIcon from "./Components/chatIcon/ChatIcon";
import styles from "./App.module.css"; // ✅ استدعاء الـ CSS Module
import '@fortawesome/fontawesome-free/css/all.min.css';
import RatingToast from "./Components/ratingToast/RatingToast";
import FeedbackList from "./Components/ratingToast/FeedbackList";


function App() {
  const location = useLocation();
  const hideLayout = ["/signin", "/signup","/forgetPassword","/resetPassword"].includes(location.pathname);

  return (
    <div className={styles.appContainer}>
      <ChatIcon />
      
      {!hideLayout && <Navbar />}

      {/* هنا المحتوى */}
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/user" element={<Profile />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/file" element={<File />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/writefeedback" element={<WriteFeedback />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/ratingtoast" element={<RatingToast />} />
          <Route path="/feedbacklist" element={<FeedbackList />} />

        </Routes>
      </div>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
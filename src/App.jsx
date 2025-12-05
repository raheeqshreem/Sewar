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
import ForgetPassword from "./Pages/forgetPassword/ForgetPassword";
import ResetPassword from "./Pages/forgetPassword/ResetPassword";
import WriteFeedback from "./Pages/writeFeedback/WriteFeedback";

import ChatIcon from "./Components/chatIcon/ChatIcon";
import styles from "./App.module.css"; // ✅ استدعاء الـ CSS Module
import '@fortawesome/fontawesome-free/css/all.min.css';
import RatingToast from "./Components/ratingToast/RatingToast";
import FeedbackList from "./Components/ratingToast/FeedbackList";
import FormAppointment from "./Pages/appointment/FormAppointment";
import MyInquiry from "./Pages/inquiry/MyInquiry";
import ConsultationReplies from "./Pages/inquiry/ConsultationReplies";
import Loader from "./Components/loader/Loader";
import ConsultationDoctor from "./Pages/inquiry/ConsultationDoctor";
import Notifications from "./Pages/inquiry/Notifications";
import ReportPreviewKids from "./Pages/report/ReportPreviewKids";
import ReportPreviewWomen from "./Pages/report/ReportPreviewWomen";
import ViewAppointments from "./Pages/appointment/ViewAppointments";
import UsersList from './Pages/appointment/UsersList';
import FilesPage from "./Pages/file/FilesPage";
import Visite from "./Pages/file/Visite";
import FilesPagePatient from "./Pages/file/FilesPagePatient";
import VisitePatient from "./Pages/file/VisitePatient";
import ReportKids from "./Pages/report/ReportKids";
import ReportWomen from "./Pages/report/ReportWomen";
import Admin from "./Pages/home/Admin";
import OurSpecialties from "./Components/OurSpecialties/OurSpecialties";
import Cards from "./Components/OurSpecialties/Cards";
import FeedbackOnOurSpecialties from "./Pages/FeedbackOnOurSpecialties/FeedbackOnOurSpecialties";
import WriteFeedbackCards from "./Pages/writeFeedback/WriteFeedbackCards";
import FeedbackListCards from "./Components/ratingToast/FeedbackListCards";
import RatingToastCards from "./Components/ratingToast/RatingToastCards";
import Content from "./Components/OurSpecialties/Content";


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
                    <Route path="/loader" element={<Loader />} />

          <Route path="/users" element={<UsersList />} />

          <Route path="/viewappointments" element={<ViewAppointments />} />
          <Route path="/appointment" element={<Appointment />} />
           <Route path="/formappointment" element={<FormAppointment />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/feedback" element={<Feedback />} />
                    <Route path="/WriteFeedbackCards" element={<WriteFeedbackCards />} />

          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/FilesPage" element={<FilesPage/>} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/writefeedback/:id" element={<WriteFeedback />} />
          <Route path="/writefeedback" element={<WriteFeedback />} />


           <Route path="/writefeedbackCards/:id" element={<WriteFeedbackCards />} />
          <Route path="/writefeedbackCards" element={<WriteFeedbackCards />} />
          <Route path="/myinquiry" element={<MyInquiry />} />
          <Route path="/consultation-replies/:consultationId" element={<ConsultationReplies />} />
          <Route path="/consultation-doctor" element={<ConsultationDoctor/>} />
          <Route path="/consultation-doctor/:id" element={<ConsultationDoctor/>} />
          <Route path="/ReportPreviewKids" element={<ReportPreviewKids/>} />
          <Route path="/ReportPreviewWomen" element={<ReportPreviewWomen/>} />
<Route path="/ReportPreviewWomen/:reportId" element={<ReportPreviewWomen />} />
<Route path="/ReportWomen/:reportId" element={<ReportWomen />} />
          <Route path="/ReportKids/:reportId" element={<ReportKids/>} />

          <Route path="/ReportPreviewKids/:reportId" element={<ReportPreviewKids/>} />
          <Route path="/visites" element={<Visite/>} />
                    <Route path="/VisitePatient/:childId" element={<VisitePatient/>} />

          <Route path="/FilesPagePatient" element={<FilesPagePatient/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/OurSpecialties" element={<OurSpecialties/>} />
          <Route path="/Cards" element={<Cards/>} />
          <Route path="/FeedbackOnOurSpecialties" element={<FeedbackOnOurSpecialties/>} />
          <Route path="/ratingtoastCards/:serviceId" element={<RatingToastCards />} />

          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/feedback" element={<Feedback/>} />
          <Route path="/ratingtoast" element={<RatingToast/>} />
          <Route path="/feedbacklist" element={<FeedbackList/>} />
          <Route path="/feedbacklistCards" element={<FeedbackListCards/>} />
          <Route path="/ratingtoastCards" element={<RatingToastCards/>} />
          <Route path="/Content" element={<Content/>} />

        </Routes>






        
      </div>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
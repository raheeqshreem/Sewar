import { Route, Routes } from "react-router-dom";
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
import Loader from "./Components/loader/Loader";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";


function App() {
  
  return <> 
  
  
<Routes>
   <Route path='/' element={ <> <Navbar/> <Home/><Footer/></>}></Route>
   <Route path='/signin' element={<Login/>}></Route>
   <Route path='/signup' element={<Register/>}></Route>
   <Route path='/user' element={<> <Navbar/><Profile/><Footer/></>}></Route>
   <Route path='/appointment' element={<> <Navbar/><Appointment/><Footer/></>}></Route>
   <Route path='/communication' element={<> <Navbar/><Communication/><Footer/></>}></Route>
   <Route path='/feedback' element={<> <Navbar/><Feedback/><Footer/></>}></Route>
   <Route path='/inquiry' element={<> <Navbar/><Inquiry/><Footer/></>}></Route>
   <Route path='/file' element={<> <Navbar/><File/><Footer/></>}></Route>

</Routes>
  
  
    </>
}
export default App;
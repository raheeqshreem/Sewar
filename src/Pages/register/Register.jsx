

import { useForm } from 'react-hook-form';
import login from './../../assets/login.png'
import styles from'./Register.module.css'; // ملف CSS
import { useNavigate } from 'react-router-dom';
function Register() {

const {register,handleSubmit,reset,formState:{errors}} = useForm({mode:'onChange'});
const navigate=  useNavigate();
const registerForm =(values)=>{
console.log(values);
reset();
navigate("/signin")
}

  return <div className={`${styles.container} position-relative`}>
  <img src={login} className="card-img" alt="..." />
 <div className="card-img-overlay d-flex flex-column  justify-content-lg-center justify-content-end align-items-end p-3 vh-100"> 
  <div className="w-100 d-flex justify-content-end">


<form className={styles.formBox} style={{ maxWidth: "400px", width: "90%" }} onSubmit={handleSubmit(registerForm)}>
  <div className="d-flex justify-content-end p-4  " >
  <div style={{ width: "400px" }}>

     <div className="form-floating   mb-4 position-relative">
      <input  {...register("FirstName",{required:'Please Enter First Name'})}
     
        type="text"
        className={`form-control form-control-sm ${styles.customInput}`}
        id="firstName"
        placeholder="firstName"
      />
      <label htmlFor="firstName">First Name</label>

    {errors.FirstName && (
<p className={`${styles.textBeige} position-absolute`} style={{ bottom: "-25px", left: "5px", margin: 1 }}>
      {errors.FirstName.message}
    </p>       )}
     </div>
 <div className="form-floating  mb-4 position-relative" >
      <input {...register("LastName",{required:'Please Enter Last Name'})}
        type="text"
        className={`form-control  ${styles.customInput}`}
        id="lastName"
        placeholder="lastName"
      />
      <label htmlFor="lastName">Last Name</label>

    {errors.LastName && (
<p className={`${styles.textBeige} position-absolute`} style={{ bottom: "-25px", left: "5px", margin: 1 }}>
      {errors.LastName.message}
    </p>       )}
   
    </div>
    <div className="form-floating  mb-4 position-relative">
      <input {...register("Email",{required:'Please Enter Email'})}
        type="email"
        className={`form-control  ${styles.customInput}`}
        id="floatingEmail"
        placeholder="name@example.com"
      />
      <label htmlFor="floatingEmail">Email address</label>
      
    {errors.Email && (
<p className={`${styles.textBeige} position-absolute`} style={{ bottom: "-25px", left: "5px", margin: 1 }}>
      {errors.Email.message}
    </p>       )}
    
    </div>

    <div className="form-floating  mb-4 mt-1 position-relative " >
      <input{...register("Password",{required:'Please Enter Password',minLength:{value:3,message:'Minimum 3 Characters Required'}
                                                                     ,  maxLength:{value:8,message:'Max 8 Is Allowed'}  })}
       
        type="password"
        className={`form-control  ${styles.customInput}`}
        id="floatingPassword"
        placeholder="Password"
      />
      <label htmlFor="floatingPassword">Password</label>

    {errors.Password && (
<p className={`${styles.textBeige} position-absolute`} style={{ bottom: "-25px", left: "5px", margin: 1 }}>
      {errors.Password.message}
    </p>    )}
    
    </div>

     <div className="form-floating  mb-4 mt-2 position-relative" >
      <input {...register("ConfirmPass",{required:'Please Confirm Your Password'})}
        
        type="Password"
        className={`form-control  ${styles.customInput}`}
        id="ConfirmPassword"
        placeholder="ConfirmPassword"
      />
      <label htmlFor="ConfirmPassword">Confirm Password</label>

    {errors.ConfirmPass && (
<p className={`${styles.textBeige} position-absolute`} style={{ bottom: "-25px", left: "5px", margin: 1 }}>
      {errors.ConfirmPass.message}
    </p>      )}
  
    </div>


    <div className="col-md-6  mb-3 mt-2 position-relative" >
  
  <select id="inputState"  {...register("UserType")}

      className={` form-select text-secondary ${styles.customInput}`}>
    <option value="">User Type...</option>
    <option value="Patient">Patient</option>
     <option value="Doctor">Doctor</option>
      <option value="Secretary">Secretary</option>
  </select>
</div>
 <div className={`col-md-6 ${styles.myBtn}`}>
  <button type="submit" className=" text-secondary   btn w-100 h-100  " >
    Register
  </button>


</div>

  </div>
</div>

  </form>

</div>

  </div>
</div>
  }

export default Register;


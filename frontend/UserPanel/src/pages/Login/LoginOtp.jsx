import React, { useState, useEffect } from "react";
import "../Login/LoginOtp.css";
import {toast} from 'react-toastify';
import { useAuth } from "../../context/AuthContext.jsx";
import {getOTP,verifyOTPAndLogin, setupRecaptcha} from "../../service/OtpService.js"


const LoginOtp = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;
  const [phone, setPhone] = useState("");
  const [error, setError] = useState();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const {setAccessToken, setUser} = useAuth();


  const handlePhone = (e)=>{
    const value = e.target.value;
    setPhone(value);
    if(!value){
      setError("");
      return
    }

    const cleanedPhone = value.replace(/\s+/g, "").replace(/^\+91/,"");
    if (!/^[6-9]/.test(cleanedPhone) || !/^\d*$/.test(cleanedPhone)){
        setError("Please Enter Valid Indian Phone Number");
        return;
    }

    if(cleanedPhone.length == 10){
      
    }

    console.log(value);
    setError("");
  }

  //send otp
  const handleSubmit = async(e) => {
    e.preventDefault();

    if(!showOtpField){
        let cleanedPhone = phone.replace(/\s+/g, "").replace(/^\+91/,"");
        if (!/^[6-9]\d{9}$/.test(cleanedPhone)){
            setError("Please Enter Valid Phone Number");
            setShowSubmit(false);
            return;
        }
        
        cleanedPhone = "+91" + cleanedPhone;
        //show otp page
       
        // get opt from google
        await getOTP(cleanedPhone)
          .then(()=>{
              setTimeLeft(120); 
              setShowSubmit(false);  
              setShowOtpField(true);
            toast.success("OTP Send Successfully to : " + phone);
          })
          .catch(()=>
              {
                setShowSubmit(false); 
                toast.error("Error while Sending OTP");
              }
            )
        
    }
    else{
       if (otp.length !== 6) {
          toast.error("Please Enter 6 digit OTP");
          setShowSubmit(false);
          return;
        }
        
        const data = {
          phoneNumber : phone,
          OTP : otp
        } 
        
        //call verify fuction 
        await verifyOTPAndLogin(data)
          .then((res)=>{
            //set user JWT token in cookies
              setAccessToken(res.jwtAccessToken)
              setUser(res);
              onLoginSuccess();
              toast.success("Welcome");
              setShowSubmit(false);
              console.log(res);
          })
          .catch((err)=> {
            toast.error("Invalid OTP");
            setShowSubmit(false);
            console.log(err);
          }); 
        
    }

  };
 

// for timer counter
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // cleanup on unmount
  }, [timeLeft]);

//format time into mintues and seconds
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

//send otp again when its get over 
  const otpSendAgain = async()=>{
    let cleanedPhone = "+91" + phone;
    await getOTP(cleanedPhone)
          .then(()=>{
            setTimeLeft(120);
            toast.success("OTP Send Again Successfully to : " + phone);
          })
          .catch(()=>toast.error("Error While Sending OTP"))
    
  }

  const handleBack = ()=>{
    setShowOtpField(false);
    setShowSubmit(false);
  }

// login by google Oauth2

  const handleOauth2 = ()=>{
      
      window.location.href = `http://localhost:8080/oauth2/authorize/google`;
  }


  return (
    <div className="modal-overlay">
      
      <div className="">    
            <div className="login-modal">
                <button className="close-btn" onClick={onClose}>
                ✕
                </button>
                {
                  showOtpField && <button className="left-btn" onClick={handleBack}>
                                      <i className="bi bi-arrow-left"></i>
                                  </button>
                }
                <div className="modal-header">
                <div className="logo-circle">
                    <span className="logo-icon">🍴</span>
                </div>
                <h2>Welcome to FlavorExpress</h2>
                <p>Loin in/Create account to discover delicious meals near you</p>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    
                    <label>Phone Number</label>
                    <div className="input-box">
                          <span className="icon">📞</span>
                          <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => {
                                handlePhone(e);
                            }}
                            maxLength={10}
                            disabled = {showOtpField}
                          />
                    </div>
                    <p class="error">{error}</p>
                    <div id="recaptcha-container"></div>
                    {
                      showOtpField && (
                       <>
                         <label>Enter OTP</label>
                          <div className="input-box">
                                <i class="bi bi-chat-square-text-fill"></i>
                                <input
                                type="number"
                                placeholder="Enter your OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className="otpbtn"
                                />
                          </div>
                       </>
                      )
                    }

                    {
                      !showOtpField ? (
                          <button type="submit" className= { showSubmit ? "active" :"start-btn"} onClick={()=>setShowSubmit(true)}>
                              {
                                !showSubmit ? (<>Start Ordering</>): (<>Start Ordering...</>)
                              }
                          </button>
                      ) : (
                        <div className="btnTimer">
                           {
                             timeLeft > 0 ? 
                                (
                                  <p className="timer">Time Left: {formatTime(timeLeft)}</p>
                                ) : (
                                    <button className="resend-btn" onClick={otpSendAgain}>
                                      Resend OTP
                                    </button>
                                )
                           }
                          <button disabled={timeLeft <= 0} type="submit" className= {showSubmit ? "active" :"verify-btn"} onClick={()=>setShowSubmit(true)}>
                            {
                                !showSubmit ? (<>Verify</>) : (<>Verifying...</>)
                            }
                          </button>
                        </div>
                          
                           
                      )
                    }   
                    
                </form>

                <div className="divider">
                    <span>OR CONTINUE WITH</span>
                </div>

                <div className="social-login">
                  <button className="google-btn" onClick={handleOauth2}>
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" width={18} height={18} />
                      Continue with Google
                  </button>      
                </div> 
          </div>
         
      </div>
    </div>
  );
};

export default LoginOtp;

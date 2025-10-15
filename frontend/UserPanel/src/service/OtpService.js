import { toast } from "react-toastify";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";


// Firebase config (from your project settings)
const firebaseConfig = {
  apiKey: "AIzaSyD1wU2YfxefVRz1R34bzpsCcJZd8a_KUpg",
  authDomain: "foodies-52963.firebaseapp.com",
  projectId: "foodies-52963",
  storageBucket: "foodies-52963.appspot.com",  // corrected `.app` to `.appspot.com`
  messagingSenderId: "1087616455131",
  appId: "1:1087616455131:web:bd7f6c4e2565b1ad4917fe",
  measurementId: "G-K3DJER6EYX"
};

//Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let confirmationResult;


// Setup Recaptcha (fixed for Firebase v9+)
export const setupRecaptcha = () => {
 // if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("Recaptcha verified");
        },  
        "expired-callback": () => {
          console.log("Recaptcha expired, reset it.");
        },
      }
    );
    window.recaptchaVerifier.render();
 //}
};



// Send OTP
export const getOTP = async (phoneNumber) => {
  if (!phoneNumber) {
    toast.error("Please Enter Phone Number");
    return;
  }
  console.log(window.recaptchaVerifier);
  
  setupRecaptcha();

  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
   
  } catch (error) {
    console.error(error);
    throw error;
  }
};



// Verify OTP
export const verifyOTPAndLogin = async (data) => {
  
  const OTP = data.OTP;
  if (!OTP) {
    toast.error("Please Enter OTP");
    return;
  }

  try {
    const result = await confirmationResult.confirm(OTP);
    const user = result.user;
    // Get Firebase ID Token
    const idToken = await user.getIdToken(true);
    
    // Send token to backend
    const response = await fetch("http://localhost:8080/api/auth/login", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + idToken
                              },
                              credentials: "include",
                              body: JSON.stringify({ 
                                phoneNumber: data.phoneNumber,
                                deliveryPin: ""
                               })
                            })
    if(!response.ok){
       toast.error("Login failed");
       throw new Error(`Server error ${response.status}: ${errorText}`);
    }                
   // toast.success("WELCOME ");
    //return response.json();

    
    const finalResult = await response.json();
    console.log(finalResult);
    return finalResult;

  } catch (error) {
    console.error(error);
    throw error;
    
  }
};

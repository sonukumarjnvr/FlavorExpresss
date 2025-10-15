import React, { useEffect ,useRef} from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import {useNavigate} from "react-router-dom"

const Oauth2Success = () => {
    const {setUser, setAccessToken} = useAuth();
    const navigate = useNavigate();
    const hasFetched = useRef(false); // Prevent double call

    const fetchRefreshToken = async ()=>{
        //  Get the full query string
        const queryString = window.location.search;

        //  Parse query params
        const urlParams = new URLSearchParams(queryString);

        //  Get the token
        const accessToken = urlParams.get("accessToken");
        
        if(accessToken){
            try {
              
              const response = await fetch("http://localhost:8080/oauth2/getRefreshToken", {
                                        method: "GET",
                                        headers: {
                                          "Authorization": `Bearer ${accessToken}`
                                        },
                                        credentials: "include"
                                      });
              if(!response.ok){
                  toast.error("Login Failed");
                  navigate("/");
                 return;
              }

              const finalResult = await response.json();
              setAccessToken(finalResult.jwtAccessToken);
              setUser(finalResult);
              toast.success("Welcome");
              navigate("/");
            
            // Optional: remove token from URL
              window.history.replaceState({}, document.title, "/");
          } catch (error) {
              toast.error("Login Failed");
              navigate("/")
              throw error
          }
        }
        else{
            toast.error("Login Failed");
            navigate("/");
        }
        
    }

    useEffect(()=>{
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchRefreshToken();
    }, [])

  return (
    <div>
      
    </div>
  )
}

export default Oauth2Success

import React, {useContext, createContext, useState, useEffect} from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export  const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState("");
    
// fetch access token while page refresh
    useEffect(()=>{
        const refreshToken = async ()=>{
            try {
                
                const res = await fetch(
                    "http://localhost:8080/api/auth/refresh",{
                        method: "GET",
                        credentials:"include"
                });

                if(res.ok){
                    const data = await res.json();
                    console.log("user data after refresh : " , data)
                    setAccessToken(data.jwtAccessToken);
                    setUser(data);
                }

            } catch (error) {
                console.error("Refresh failed : ", error);
                setAccessToken(null);
                setUser(null);
            }finally{
                setLoading(false);
            }
        }

        refreshToken();
    }, []);

//logout  function
    const logout = async ()=>{
        try {
            const res = await fetch("http://localhost:8080/api/auth/logout", {
                method: "GET",
                credentials:"include"
            });

            if(res.ok){
                setAccessToken(null);
                setUser(null);
                toast.success("Logout Successfully")
            }  
        } catch (error) {
            toast.error("Failed to Logout")
            throw error;
        }
    };

//wrapper fuction with authomatic refresh

    const fetchWithAuth = async (url, options = {})=>{
        if(!options.headers) options.headers = {};
        if(accessToken) options.headers["Authorization"] = "Bearer "+ accessToken;

        options.credentials = "include"; // always include cookie for refresh token

        let response = await fetch(url, options);

        if(response.status == 401){
            const refreshRes = await fetch("http://localhost:8080/api/auth/refresh", {
                    method: "GET",
                    credentials: "include",
            });

            if(refreshRes.ok){
                const data = await refreshRes.json();
                setAccessToken(data.accessToken);
                setUser(data.user);

                //Retry with original request with new token
                options.headers["Authorization"] = "Bearer " + data.accessToken;
                response  = await fetch(url, options);
            }else{
                logout();
                throw new Error("Session Expired. Please login again.")
            }

        }

        return response;
    };


    return (
        <AuthContext.Provider
          value={{user, accessToken, setAccessToken, setUser, logout, fetchWithAuth, loading, address, setAddress}}
        >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext)

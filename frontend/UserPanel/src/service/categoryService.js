import axios from "axios";


const API_URL = "http://localhost:8080/api/category";


export const getAllCategory = async ()=>{
    try {
        const res = await axios.get(API_URL + "/allCategory");
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
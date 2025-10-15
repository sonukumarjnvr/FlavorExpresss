import axios from "axios";

const API_URL = "http://localhost:8080/api/foods"


//get food by category
export const getFoodsByCategory = async (id, accessToken)=>{
    try {
        const res = await axios.get(API_URL + "/getFoodByCategory/" + id);
        console.log("access token in new Food : " , accessToken);
        return res.data;
    }catch (error) {
        console.log(error);
        throw error;
    }
}

//get size and price by foodId

export const getSizeByFoodId = async (foodId)=>{
    try {
        const res = await axios.get("http://localhost:8080/api/size/foodId/" + foodId);
        const result = res.data;
        return result.sort((a, b) => a.price - b.price);
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}


import axios from "axios";


const API_URL = "http://localhost:8080/api/size"

export const getSizesByFoodId = async (foodId) => {
    try {
        const res = await axios.get(API_URL+ "/foodId/"+ foodId);
        return res.data;
    } catch (error) {
        console.log("Error while fetching sizes", error);
        throw error;
    }
}

export const addSize = async (newSize, selectedFood)=>{
    try {
        const res = await fetch(API_URL + "/addSize", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...newSize, foodId: selectedFood }),
                    })
        return res.json();
    } catch (error) {
        
    }
    
}

export const updateSizeById = async (id, updatedSize)=>{
    try {
        const res = await fetch(API_URL + "/editSize/" + id, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedSize),
                    });
        return res.json();
    } catch (error){
        console.log("unable to update size");
        throw error;
    }
}

export const deleteSize = async (id)=>{
    try {
        fetch(API_URL + "/deleteSize/" + id, { method: "DELETE" });
    } catch (error) {
        console.log("Unable to delete this size");
        throw error;
    }
}
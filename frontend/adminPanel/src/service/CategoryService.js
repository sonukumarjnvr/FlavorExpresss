import axios from "axios";


const API_URL = "http://localhost:8080/api/category";

export const addCategory = async(data, file) => {
    const formData = new FormData();
    formData.append('categoryName', JSON.stringify(data));
    formData.append('file', file);

    try {
        return await axios.post(API_URL + '/addCategory', formData,{
            headers : {"Content-Type" : "multipart/form-data"}
        });
    } catch (error) {
        console.log("Error while adding category : " + error);
        throw error;
    }
}


export const getAllCategory = async()=>{
    try {
        return await axios.get(API_URL + "/allCategory");     
    } catch (error) {
        console.log("error while fetching data : ", error);
        throw error;
    }     
}

export const deleteCategory = async(categoryId)=>{
    try {
        return await axios.delete(API_URL+ "/" + categoryId); 
    } catch (error) {
        console.log("error while deleting food", error);
        throw error;
    }
}


export const getCategory = async(categoryId)=>{
    try {
        return await axios.get(API_URL + "/" + categoryId);
    } catch (error) {
        console.log("error while getting category detail")
        throw error;
    }
}

export const editCategory = async(categoryId, category, newfile)=>{
    const formData = new FormData();
    formData.append('categoryName', JSON.stringify(category));
    formData.append('file', newfile);
    try {
            return axios.put(API_URL + "/editCategory/" + categoryId, formData, {
            headers : {"Content-Type" : "multipart/form-data"}
        })
    } catch (error) {
        console.log("Error while edit category")
        throw error;
    }
}
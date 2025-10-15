import axios from "axios";

const API_URL = "http://localhost:8080/api/foods";

export const addFood = async (data, files) => {
    const formData =  new FormData();
    formData.append('food', JSON.stringify(data));
    for(let i=0; i<files.length; i++){
      formData.append('files', files[i]);
    }

    try {
        await axios.post(API_URL, formData, {
            headers : {"Content-Type" : "multipart/form-data"}
          });
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
}

export const deleteFood = async (foodId)=>{
    try {
       const response =  await axios.delete(API_URL + '/' + foodId);
       return response;
    } catch (error) {
        console.log("Error while delete food", error);
        throw error;
    }
}

export const getAllFoods = async () => {
    try {
        return await axios.get(API_URL);
    } catch (error) {
        console.log("Error while fetching foods", error);
        throw error;
    }
}

export const getFood = async (foodId)=>{
    try {
       return await axios.get(API_URL + '/' + foodId);
    } catch (error) {
        console.log("Error while fetching food", error);
        throw error;
    }
}

export const editFood =async (foodId, data, newFiles, previousfiles)=>{
    const formData = new FormData();
    const newData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        previousfiles: previousfiles
    }

    formData.append('food', JSON.stringify(newData));
    for(let i=0; i<newFiles.length; i++){
      formData.append('newfiles', newFiles[i]);
    }

    try {
        console.log(API_URL + '/editFood/' + foodId);
        return await axios.put(API_URL + '/editFood/' + foodId, formData, {
            headers : {"Content-Type" : "multipart/form-data"}
        })
    } catch (error) {
        console.log("Error while editing food", error);
        throw error;
    }

}

export const getAllFoodByCategory = async (id)=>{
    try {
        
        const res = await axios.get(API_URL + "/getFoodByCategory/" + id);
        console.log(res);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

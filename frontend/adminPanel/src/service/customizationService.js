import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; 

// Fetch all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category/allCategory`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch customizations by categoryId
export const getCustomizationsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/customization/getByCategory/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching customizations:", error);
    throw error;
  }
};

// Update customization
export const updateCustomization = async (id, data) => {
  console.log(data);
  try {
    const response = await axios.put(
      `${API_BASE_URL}/customization/editCustomization/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating customization:", error);
    throw error;
  }
};

// Delete customization
export const deleteCustomization = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/customization/deleteCustomization/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting customization:", error);
    throw error;
  }
};

// Add customization
export const addCustomization = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customization/addCustomization`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding customization:", error);
    throw error;
  }
};


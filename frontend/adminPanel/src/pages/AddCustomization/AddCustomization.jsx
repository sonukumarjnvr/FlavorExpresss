import React, { useEffect, useState } from "react";
import "../AddCustomization/AddCustomization.css";
import { toast } from "react-toastify";
import { getCategories, addCustomization } from "../../service/customizationService";

const AddCustomization = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    customizationName: "",
    type: "",
    price: ""
  });

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.customizationName || !formData.type || !formData.price) {
      toast.warn("All fields are required!");
      return;
    }
    try {
      await addCustomization(formData);
      toast.success("Customization added successfully!");
      setFormData({ categoryId: "", customizationName: "", type: "", price: "" });
    } catch {
      toast.error("Failed to add customization");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2 className="form-title">Add Customization</h2>
        <form onSubmit={handleSubmit} className="custom-form">
          
          {/* Category */}
          <div className="form-group horizontal">
            <label>Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Customization Name */}
          <div className="form-group horizontal">
            <label>Customization Name</label>
            <input
              type="text"
              name="customizationName"
              value={formData.customizationName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter customization name"
            />
          </div>

          {/* Type */}
          <div className="form-group horizontal">
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select Type</option>
              <option value="Veg">Veg</option>
              <option value="Non-veg">Non-Veg</option>
            </select>
          </div>

          {/* Price */}
          <div className="form-group horizontal">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter price"
            />
          </div>

          {/* Submit */}
          <div className="form-group horizontal">
            <label></label>
            <button type="submit" className="btn-submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomization;

import React, { useEffect, useState } from "react";
import "../AllCustomization/AllCustomization.css"
import { toast } from "react-toastify";

// Example services (replace with your actual API calls)
import {
  getCategories,
  getCustomizationsByCategory,
  updateCustomization,
  deleteCustomization,
} from "../../service/customizationService";

const Customization = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customizations, setCustomizations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "", type:"" });
  

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  const handleSearch = () => {
    if (!selectedCategory) {
      toast.warn("Please select a category");
      return;
    }
    
    setCustomizations([]);
    getCustomizationsByCategory(selectedCategory)
      .then((res) => {
        const sorted = res.sort((a, b) =>
          a.type === "Veg" ? -1: 1
        );
        setCustomizations(sorted);
      })
      .catch(() => toast.error("Failed to fetch customizations"));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditData({ name: item.customizationName, price: item.price });
  };

  const handleSave = async (id, categoryId) => {
    try {
      await updateCustomization(id, {
        customizationName: editData.name,
        price: editData.price,
        categoryId:categoryId,
        type : editData.type
      });
      toast.success("Customization updated!");
      handleSearch();
      setEditingId(null);
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.alert("Do you want delete this customization ?")
    if(confirm === false){
      return;
    }

    try {
      await deleteCustomization(id);
      toast.success("Customization deleted!");
      setCustomizations(customizations.filter((c) => c.id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="customization-container">
      <div className="customization-box">
        <h1 className="title">Manage Customizations</h1>

        
        <div className="search-section">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="dropdown"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          <button onClick={handleSearch} className="btn btn-search">
            Search
          </button>
        </div>

        {/* Customization List */}
        {customizations.length > 0 ? (
          <table className="customization-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Price</th>
                <th className="center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customizations.map((item) => (
                <tr key={item.id}>
                  <td className="veg-cell">
                    {
                      editingId === item.id ? (<select name="type" value={editData.type} onChange={(e)=>setEditData({...editData, type:e.target.value})}>
                        <option value= "Veg" >Veg</option>
                        <option value= "Non-Veg" >Non-Veg</option>
                      </select>) : (
                        item.type
                      )
                    }
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="input-edit"
                      />
                    ) : (
                      item.customizationName
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData({ ...editData, price: e.target.value })
                        }
                        className="input-edit"
                      />
                    ) : (
                      `₹ ${item.price}`
                    )}
                  </td>
                  <td className="center">
                    {editingId === item.id ? (
                      <button
                        onClick={() => handleSave(item.id, item.categoryId)}
                        className="btn btn-save"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No customizations found.</p>
        )}
      </div>
    </div>
  );
};

export default Customization;

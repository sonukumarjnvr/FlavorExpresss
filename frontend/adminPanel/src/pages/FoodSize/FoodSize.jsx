import React, { useEffect, useState } from "react";
import "../FoodSize/FoodSize.css";
import { getAllCategory } from "../../service/CategoryService";
import { getAllFoodByCategory } from "../../service/AddFoodService";
import { getCategories } from "../../service/customizationService";
import { addSize } from "../../service/FoodSizeService";
import {toast} from "react-toastify"
import { getSizesByFoodId } from "../../service/FoodSizeService";
import { updateSizeById } from "../../service/FoodSizeService";
import { deleteSize } from "../../service/FoodSizeService";


const FoodSize = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFood, setSelectedFood] = useState("");

  const [newSize, setNewSize] = useState({ sizeName: "", price: "", discount: "" });
  const [editId, setEditId] = useState(null);

  // Fetch categories from DB
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // Fetch foods when category changes
  useEffect(() => {
    if (selectedCategory) {
        console.log(selectedCategory)
      getAllFoodByCategory(selectedCategory)
        .then((data) => setFoods(data))
        .catch((err) => toast.error("Failed to load foods"));
        console.log(foods);
    }
  }, [selectedCategory]);

  // Search sizes
  const handleSearch = () => {
    if(selectedFood){
        getSizesByFoodId(selectedFood)
            .then((data) => setSizes(data))
            .catch((err) => {
              
              setSizes([]);
            });
    }
   
  };

  // Delete size
  const handleDelete = (id) => {
    const confirm = window.confirm("Do You Want to Delete This Size");
    if(!confirm){
      return ;
    }

    deleteSize(id)
      .then(() => setSizes(sizes.filter((s) => s.id !== id)))
      .catch((err) => toast.error("Unable to Delete Size)"));
  };

  // Edit / Save size
  const handleSave = (id, updatedSize) => {
    updatedSize = {...updatedSize, foodId: selectedFood};
    updateSizeById(id, updatedSize)
      .then(() => {
        setSizes(
          sizes.map((s) => (s.id === id ? { ...s, ...updatedSize } : s))
        );
        setEditId(null);
        toast.success("Size is Updated Successfully");
      })
      .catch((err) => {
        toast.error("Unable to Save");
        setEditId(null);
        console.log(err);
      });
  };

  // Add new size
  const handleAdd = (e) => {
    e.preventDefault();
    console.log(newSize + selectedFood)
    addSize(newSize, selectedFood)
      .then((data) => {
        setSizes([...sizes, data]);
        setNewSize({ sizeName: "", price: "", discount: "" });
        toast.success("size added successfully");
      })
      .catch((err) => toast.error("Size is not added"));
  };

  return (
    <div className="size-management">
      <h2>Size Management</h2>

      {/* Dropdowns */}
      <div className="dropdown-section">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories && categories.map((cat) => (
            <option  key={cat.categoryName} value={cat.categoryName}>{cat.categoryName}</option>
          ))}
        </select>

        <select
          value={selectedFood}
          onChange={(e) => setSelectedFood(e.target.value)}
          disabled={!selectedCategory}
        >
          <option value="">Select Food</option>
          {foods && foods.map((food) => (
            <option key={food.id} value={food.id}>{food.name}</option>
          ))}
        </select>

        <button className="btn" onClick={handleSearch} disabled={!selectedFood}>
          Search
        </button>
      </div>

      {/* Add Size Form */}
      {selectedFood && (
        <form className="add-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Size Name"
            value={newSize.sizeName}
            onChange={(e) => setNewSize({ ...newSize, sizeName: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newSize.price}
            onChange={(e) => setNewSize({ ...newSize, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Discount (%)"
            value={newSize.discount}
            onChange={(e) => setNewSize({ ...newSize, discount: e.target.value })}
            required
          />
          <button type="submit" className="btn add-btn">Add</button>
        </form>
      )}

      {/* Size List */}
      <div className="size-list">
        {sizes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Size Name</th>
                <th>Price</th>
                <th>Discount (%)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr key={size.id}>
                  <td>
                    {editId === size.id ? (
                      <input
                        type="text"
                        defaultValue={size.sizeName}
                        onChange={(e) => size.sizeName = e.target.value}
                      />
                    ) : (
                      size.sizeName
                    )}
                  </td>
                  <td>
                    {editId === size.id ? (
                      <input
                        type="number"
                        defaultValue={size.price}
                        onChange={(e) => size.price = e.target.value}
                      />
                    ) : (
                      size.price
                    )}
                  </td>
                  <td>
                    {editId === size.id ? (
                      <input
                        type="number"
                        defaultValue={size.discount}
                        onChange={(e) => size.discount = e.target.value}
                      />
                    ) : (
                      size.discount
                    )}
                  </td>
                  <td>
                    {editId === size.id ? (
                      <button
                        className="btn save-btn"
                        onClick={() =>
                          handleSave(size.id, {
                            sizeName: size.sizeName,
                            price: size.price,
                            discount: size.discount,
                          })
                        }
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button className="btn edit-btn" onClick={() => setEditId(size.id)}>Edit</button>
                        <button className="btn delete-btn" onClick={() => handleDelete(size.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          selectedFood && <p className="no-data">No sizes found. Please add one.</p>
        )}
      </div>
    </div>
  );
};

export default FoodSize;

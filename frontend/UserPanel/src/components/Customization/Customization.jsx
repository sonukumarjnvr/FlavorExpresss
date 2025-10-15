import React, { useEffect, useState } from "react";
import "../Customization/Customization.css";
import {useAuth} from '../../context/AuthContext.jsx';
import { useCart } from "../../context/CartContext.jsx";
import { toast } from "react-toastify";

const Customization = ({ foodId, name, imageUrl, category = "Combo", onClose, onAddToCart, description}) => {
  const [sizes, setSizes] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const {fetchWithAuth} = useAuth();
  const [startingPrice, setStartingPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch sizes by foodId
    const fetchData = async () => {
      await fetchWithAuth(`http://localhost:8080/api/size/foodId/${foodId}`,
              {
                method: 'GET'
              }
            )
            .then(res => res.json())
            .then(data => {
              setSizes(data)
              const res = [...data].sort((a, b)=> a.price - b.price)[0];
              setSelectedSize(res.sizeName);
              setStartingPrice(res.price);
              setDiscountPrice(res.discount);
            })
            .catch(err => console.error("Error fetching sizes:", err));

      // Fetch customizations by category
      console.log("Category ID:", category);
      await fetchWithAuth(`http://localhost:8080/api/customization/getByCategory/${category}`,
                {
                  method: 'GET'
                }
            )
            .then(res => res.json())
            .then(data => setCustomizations(data))
            .catch(err => console.error("Error fetching customizations:", err));
      };
  
    fetchData();
    
  }, [foodId, category, fetchWithAuth]);

  // Prevent background scroll and clicks
  useEffect(() => {
     document.body.classList.add('modal-open');
     return () => document.body.classList.remove('modal-open');
  }, []);


  const handleCustomizationChange = (objectCustom) => {
    setSelectedCustomizations(prev => {
        const exits = prev.some(item => item.id === objectCustom.id);
        if(exits){
            return prev.filter(item => item.id !== objectCustom.id);
        }
        else{
            return [...prev, objectCustom];
        }  
    }  
    );
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart!");
      return;
    }

    const newitem = {
      foodId: foodId,
      imageUrl: imageUrl,
      name: name,
      size: selectedSize,
      customization: selectedCustomizations,
      price: startingPrice,
      discount: discountPrice,
      category: category,
      count: 1,
      description: description
    }

    console.log("cartt newItem before adding to cart :  ",newitem)
    //add item to cart
    addToCart(newitem);
    onAddToCart();
    onClose();
  };

  const discount = (price, discount) => {
    return (price * discount)/100;
  }

  return (
    <div className="modal-overlay" >
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2 className="modal-title">Customize Your Order</h2>

        {/* Size Section */}
        <div className="section">
          <h3>Choose Size</h3>
          <hr className="divider" />
          {sizes.length > 0 && sizes.length > 0 ? (
            <div className="options-row">
              {[...sizes].sort((a, b)=> a.price - b.price).map(size => (
                <label key={size.sizeName} className="option-item" >
                  <input
                    type="radio"
                    name="size"
                    value={size.sizeName}
                    checked={selectedSize === size.sizeName}
                    onChange={() =>{
                      setSelectedSize(size.sizeName)
                      setStartingPrice(size.price)
                      setDiscountPrice(size.discount)
                    } }
                  />
                  <span>{size.sizeName}</span>
                  <span className={size.discount=== 0 ? "original-price" : "price-line"}>₹{size.price}</span>
                  <span className={size.discount=== 0 ? "price-none" : "price"}>₹{size.price - discount(size.price, size.discount)}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="no-data">No size options available</p>
          )}
        </div>

        {/* Customization Section */}
        <div className="section">
          {customizations.length > 0 &&  <h3>Customizations</h3>}
           <hr className="divider" />
          {/* Veg customizations */}
          {customizations.length > 0 && customizations.filter(c => c.type === "Veg").length > 0 && <h4 className="sub-headings">Veg Options</h4>}
          <div className="options-column">
            {customizations.length > 0 && customizations.filter(c => c.type === "Veg").map(c => (
              <label key={c.id} className="option-item">
                <input
                  type="checkbox"
                  checked={selectedCustomizations.some(item => c.id === item.id )}
                  onChange={() => handleCustomizationChange(c)}
                />
                <span >{c.customizationName}</span>
                <span className="price">₹{c.price}</span>
              </label>
            ))}
          </div>

          {/* Non-Veg customizations */}
          {customizations.length > 0 && customizations.filter(c => c.type === "Non-veg").length > 0 && <h4 className="sub-headings">Non-Veg Options</h4>}
          <div className="options-column">
            {customizations.length > 0 && customizations.filter(c => c.type === "Non-veg").map(c => (
              <label key={c.id} className="option-item">
                <input
                  type="checkbox"
                  checked={selectedCustomizations.some(item => c.id === item.id)}
                  onChange={() => handleCustomizationChange(c)}
                />
                <span>{c.customizationName}</span>
                <span className="price">₹{c.price}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <button className="add-btn" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default Customization;

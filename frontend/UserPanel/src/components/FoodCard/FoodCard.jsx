import React, { useEffect, useState } from "react";
import './FoodCard.css'
import { getSizeByFoodId } from "../../service/foodService";
import Customization from "../Customization/Customization";
import { useCart } from "../../context/CartContext"; 
import CartItem from "../CartItem/CartItem";
import FoodDecreaseCard from "../FoodDecreaseCard/FoodDecreaseCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const FoodCard = ({ imageUrl, name, foodId, rating, ratedCount, category, diet, description , isNew }) => {
  const [count, setCount] = useState(0);
  const [size, setSize] = useState([]);
  const [showCustomization, setShowCustomization] = useState(false);
  const {cartItems, removeFromCart} = useCart();
  const [showDecreseFood, setShowDecreseFood] = useState(false);
  const [cartItemsByFoodId, setCartItemsByfoodId] = React.useState([]);
  const navigate = useNavigate();

  //get size and price by foodId
  useEffect(()=>{
    if(foodId){   
      getSizeByFoodId(foodId)
        .then((res)=> {
          console.log(res);
          setSize(res)})
        .catch((error)=> console.log(error)); 
    }
    
  }, []);

  useEffect(()=>{
        const getCartItemsById = (foodId) => {
            setCartItemsByfoodId(cartItems.filter((item) => item.foodId === foodId));
        }

        getCartItemsById(foodId);
    },[cartItems, foodId]);

  useEffect(()=>{
    setCount(cartItems.filter(item => item.foodId === foodId).reduce((sum, item) => (sum + item?.count || 0), 0));    
  },[cartItems]);


  const decreaseCount = () => {
    if(cartItemsByFoodId.length === 1){
        removeFromCart(foodId, cartItemsByFoodId[0].size, cartItemsByFoodId[0].customization);
        toast.error("Item removed from cart!");
    }
    else{
      setShowDecreseFood(true); 
    }
    
  };

  const increaseCount = () => {
    setShowCustomization(true);  
  };

  const handleFoodDetail = ()=>{
    navigate(`/foodDetail/${category}/${foodId}`)
  }

  return (
    <div>
      <div className="dish-card">
          {isNew && <div className="new-tag">New</div>}
        <img src={imageUrl} alt={name} />
        <div className="dish-namee">
          <p className="name" onClick={handleFoodDetail}>{name}</p>
          {
            size.length > 0 && <p className="price">&#8377; {size[0].price}</p>
          }
          
        </div>

        <div className="dish-description">
          <div className="details">
              <div className="categroryRating">
                  <p className="rating">⭐ {rating} ({ratedCount})   </p>
                  <p className="vegCategory">{diet}</p>
              </div>
            <p className="description">{description}</p>
          </div>
          {count === 0 ? (
          <button className="add-btn-add" onClick={increaseCount}>Add</button>
          ) : (
          <div className="add-btn-cnt">
              <button onClick={decreaseCount}>-</button>
              <p>{count}</p>
              <button onClick={increaseCount}>+</button>
          </div>
          )} 
        </div>
      
      </div>
      {
        showCustomization && 
        <Customization
          name={name}
          imageUrl={imageUrl}
          foodId={foodId}
          description={description}
          category={category}
          onClose={() => setShowCustomization(false)}
          onAddToCart={() => {
            setShowCustomization(false);
          }}  
        />
      } 

      {
        showDecreseFood && 
        <FoodDecreaseCard 
          onClose={() => setShowDecreseFood(false)}
          foodId={foodId} 
          name={name}
        />
      }
    </div>
  );
};

export default FoodCard;

import React, { useEffect } from 'react'
import {useCart} from "../../context/CartContext";
import CartItem from '../CartItem/CartItem';
import '../FoodDecreaseCard/FoodDecreaseCard.css'

const FoodDecreaseCard = ({onClose, foodId, name}) => {
    const [cartItemsByFoodId, setCartItemsByfoodId] = React.useState([]);
    const {cartItems} = useCart();

    useEffect(()=>{
        const getCartItemsById = (foodId) => {
            setCartItemsByfoodId(cartItems.filter((item) => item.foodId === foodId));
        }

        getCartItemsById(foodId);
    },[cartItems, foodId]);

    useEffect(() => {
        document.body.classList.add("no-scroll");
        return () => {
        document.body.classList.remove("no-scroll");
        };
    }, []);

    const handleCross = ()=>{
        onClose();
    }

  return (
    <div className="foodDecrease-modal-overlay">
        <div className="foodDecrease-modal-container">
            <button className="close-btn" onClick={handleCross}>✕</button>
           <h3>{name}</h3>
           <hr/>
           {
            cartItemsByFoodId && cartItemsByFoodId.length > 0 ? (
                cartItemsByFoodId.map((item) => (
                    <CartItem
                        key={item.foodId}
                        item = {item}
                    />
                ))) : (
                    <p>This item is not in cart</p>
                )
           }
        </div>
    </div>
  )
}

export default FoodDecreaseCard

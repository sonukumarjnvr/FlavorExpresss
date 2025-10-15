import React, { useEffect } from "react";
import "../CartItem/CartItem.css";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartItem = ({ item, onClose}) => {
    const {deleteFromCart, removeFromCart, addToCart} = useCart();
    const [finalPrice, setFinalPrice]= React.useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const price = ((item.price  - (item.discount * item.price )/100) * item.count).toFixed(2);
        const customizationPrice = (item.customization.reduce((cSum, cItem) => cSum + cItem.price, 0) * item.count).toFixed(2);
        setFinalPrice((parseFloat(price) + parseFloat(customizationPrice)).toFixed(2));
    }, [item]);

    const handleDecrease = ()=>{
        const confirm = false;
        if(item.count === 1){
            window.confirm("Are you sure to remove this item from cart?");
        }
        if(confirm === true){
            return;
        }

        removeFromCart(item.foodId, item.size, item.customization);
        toast.error("Item removed from cart!");
    }

    const handleIncrese = ()=>{
        addToCart(item);
    }

    const handleDelete = ()=>{
        const confirm = window.confirm("Are you sure to remove this item from cart?");
        if(confirm === true){
            deleteFromCart(item.foodId, item.size, item.customization);
        }
        return;
    }

    const handleDetails = ()=>{
        navigate(`/foodDetail/${item.category}/${item.foodId}`);
        onClose();
    }

return (
    <div className="cart-item">
        <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
        <div className="cart-item-info">
            <h4 onClick={handleDetails}>{item.name}</h4>
            <div className="cart-item-details">
                {item.category === "Combo" ? (
                    <div className="cart-item-desc-container">
                        <p className="cart-item-category">{item.category} |&nbsp;</p>
                        <p className="cart-item-desc"> {item.description} </p>
                    </div>
                    
                ) : (
                    <div className="cart-item-desc-container">
                        <p className="cart-item-category">{item.size} |&nbsp;</p>
                        <p className="cart-item-customization">
                            {
                                item.customization.length == 0 && <span>No Customization</span>
                            }
                            {item.customization &&
                                item.customization.length > 0 &&
                                item.customization.map((custom, index) => (
                                <span key={custom.id}>
                                    {custom.customizationName}
                                    {index !== item.customization.length - 1 && " | "}
                                </span>
                                ))}
                        </p>
                        
                    </div>
                )}
                
            </div>
            
            <div className="cart-item-actions">
                <div className="quantity-control">
                    <button className="qty-btn" onClick={handleDecrease}> - </button>
                    <span className="quantity">{item.count}</span>
                    <button className="qty-btn" onClick={handleIncrese}> + </button>
                </div>
            </div>
        </div>
        <div className="cart-item-right">
            <i className="bi bi-trash3-fill" onClick={handleDelete}></i>
            <p className="cart-item-price">&#8377;{finalPrice}</p>
        </div>
        
    </div>
);
};


export default CartItem;
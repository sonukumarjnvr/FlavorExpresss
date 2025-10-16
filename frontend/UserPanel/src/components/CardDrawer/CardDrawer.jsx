import React, {useEffect, useState}from "react";
import CartItem from "../CartItem/CartItem";
import "../CardDrawer/CardDrawer.css";
import {useCart} from "../../context/CartContext";
import { toast } from "react-toastify";
import OrderDetails from "../OrderDetails/OrderDetails";

const CartDrawer = ({onClose}) => {
    const {cartItems} = useCart();
    const [itemsPrice, setItemsPrice] = useState(0);
    const [taxes, setTaxes] = useState(0);
    const [deliveryCharges, setDeliveryCharges] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [savings, setSavings] = useState(0);
    const [deliveryAddressPage, setDeliveryAddressPage] = useState(false);
    const [submit, setSubmit] = useState(false);

    useEffect(()=>{
        const TotalPrice = (cartItems.reduce((sum, item) => sum + item.price * item.count, 0)).toFixed(2);
        const customizationPrice = (cartItems.reduce((sum, item) => sum + item.count * item.customization.reduce((cSum, cItem) => cSum + cItem.price, 0), 0)).toFixed(2);
        const TotalPriceWithCustomization = (parseFloat(TotalPrice) + parseFloat(customizationPrice)).toFixed(2);
        setItemsPrice(TotalPriceWithCustomization);
        const delivery = (cartItems.length > 0 && TotalPrice < 149 ? 30 : 0).toFixed(2);
        setDeliveryCharges(delivery);
        const  totalDiscount = (cartItems.reduce((sum, item) => sum + item.count * (item.price * item.discount) / 100, 0)).toFixed(2);
        setSavings(totalDiscount);
        const taxesPrice = (0.05 * (TotalPriceWithCustomization-totalDiscount)).toFixed(2)
        setTaxes(taxesPrice);
        setFinalPrice(( parseFloat(TotalPriceWithCustomization)+  parseFloat(taxesPrice) + parseFloat(delivery) -  parseFloat(totalDiscount)).toFixed(2));

    }, [cartItems]);

    useEffect(() => {
        document.body.classList.add("no-scroll");
        return () => {
        document.body.classList.remove("no-scroll");
        }; 
    }, []);

    const handleCross = () => {
        onClose();
    }

    const handleClick = () => {
      //  onClose();
       // window.scrollTo({ top: 0, behavior: 'smooth' });
       setSubmit(true);
       if(cartItems.length === 0){
            setSubmit(false);
            toast.error("Please add items to cart");
          return;
       }
       
       setDeliveryAddressPage(true);
    }

    return (
        <div className="model-overlay">
            <div className="cart-drawer">
                <div className="cart-container">
                    <div className="cart-header">
                        <h3>Your Cart</h3>
                        <button className="close-btn" onClick={handleCross}>✕</button>
                    </div>

                    <hr className="divider" />
                    <div className="cart-body">
                        <div className="cart-items">
                            {
                                cartItems.length === 0 && (
                                    <p className="empty-cart">Your cart is empty.</p>
                                ) 
                            }
                            {cartItems.map((item) => (
                                <CartItem key={item.id} item={item} onClose = {onClose} />
                            ))}       
                        </div>

                        <div className="price-summary">       
                            <div className="price-row"><span className="spanall">Items</span><span>&#8377; {itemsPrice}</span></div>
                            <div className="price-row"><span className="spanall">Delivery Charges</span><span>&#8377; {deliveryCharges}</span></div>
                            <div className="price-row"><span className="spanall">Taxes(GST 5%)</span><span>&#8377; {taxes}</span></div>
                            <div className="price-row savings"><span>✔ Discounts</span><span>− &#8377; {savings}</span></div>
                            <div className="total-row"><span>Total</span><span>&#8377; {finalPrice}</span></div>
                            <div className="cart-actions">
                                <button className="continue-btn" onClick={handleClick}>
                                    {
                                        submit ? <div>Continue Shopping...</div> : <div>Continue Shopping</div>
                                    }
                                    
                                </button>    
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            {
                deliveryAddressPage === true &&
                (
                   <OrderDetails
                        onClose = {()=>{setDeliveryAddressPage(false)}}
                        onCloseDrawer = {onClose}
                        onCloseSubmit = {()=>{setSubmit(false)}}
                   />
                )
            }

         </div>
        
    );
};


export default CartDrawer;
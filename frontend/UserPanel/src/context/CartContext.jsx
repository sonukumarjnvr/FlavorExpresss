import React, { createContext, useContext, useEffect, useState } from "react"
import {useAuth} from "../context/AuthContext"
import { toast } from "react-toastify";

export const CartContext = createContext();

// {
//   foodId: 101,
//   name: "Margherita Pizza",
//   size: "Medium", // added size field
//   count: 2,
//   price: 250,
//   customization: {
//     extraCheese: true,
//     spiceLevel: "medium"
//   }
// }

export const CartProvider = ({children})=>{
    const [cartItems, setCartItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const {user, fetchWithAuth} = useAuth();

    useEffect(()=>{
        const fetchCartItems = async ()=>{
            await fetchWithAuth("http://localhost:8080/api/cartitems/getcartitems/" + user.id,
                                    {
                                        method:"GET"
                                    }
                                )
                                .then(res => res.json())
                                .then(res=> {setCartItems(res)})
                                .catch(error => {
                                    setCartItems([]);
                                    console.log("Eror while fetching cartItem : ", error)}
                                );
        };

        fetchCartItems();
    }, [user])

    useEffect(()=>{
        const total = cartItems.reduce((sum, item) => (sum + item?.count || 0), 0);
        setTotalItems(total);
        console.log("Total items in cart : ", total);
        console.log("Cart Items : ", cartItems);
    },[cartItems]);

    //add to cart
    const addToCart = async (newItem)=>{
        
        try {
            if(user){
                console.log("api call before in addto cart" , newItem);
                console.log("user id : " , user.id);
                const res = await fetchWithAuth("http://localhost:8080/api/cartitems/add/" + user.id,
                                    {
                                        method:"POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(newItem)
                                    }
                                )
                if(!res.ok){
                    toast.error("Item Not Add in to Cart");
                    return;
                } 
                console.log("api call after : " + res.ok);                    
            }

            setCartItems((prevItems)=>{
                //find item index with same size and customization
                const existingItemIndex = prevItems.findIndex(
                    (item)=>
                        item.foodId === newItem.foodId &&
                        item.size === newItem.size &&
                        JSON.stringify(item.customization) ===
                        JSON.stringify(newItem.customization)    
                );
        
                if(existingItemIndex !== -1){
                    // update same food
                    const updated = [...prevItems];
                    updated[existingItemIndex] = {...updated[existingItemIndex], count: updated[existingItemIndex].count + 1};
                    return updated;
                }
                else{
                    //add new varient food
                    return [...prevItems, newItem];
                }
            })

            toast.success("Item Added to Cart");
       } catch (error) {
            console.log("Error while add food cart item  : ", error);
        } 
    
    }

    //remove from cart
    // const removeFromFoodCard= (foodId)=>{
    //     setCartItems((prevItems)=>{
    //         return prevItems.map((item)=>{
    //                     if(item.foodId === foodId){
    //                         if(item.count > 1) return {...item, count: item.count-1}; // decrease  food count
    //                         else return null; // return null for remove 
    //                     }
    //                     return item; // return other items as it is
    //                 }).filter((item)=> item !== null);
    //     });

    // }

    //remove item by foodId + size + customization
    const removeFromCart = async(foodId, size, customization) => {
        try {
            if(user){
                
                    const res = await fetchWithAuth("http://localhost:8080/api/cartitems/removeFromCart/" + user.id,
                                    {
                                        method:"PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            foodId : foodId,
                                            size : size,
                                            customization : customization
                                        })
                                    }
                                )
                    if(!res.ok){
                        return;
                    }  
                                    
            }
            setCartItems((prevItems)=>{
                return prevItems.map((item)=>{
                            if(item.foodId === foodId && 
                                item.size === size && 
                                JSON.stringify(item.customization) === 
                                JSON.stringify(customization)){
                                if(item.count > 1) return {...item, count: item.count-1}; // decrease  food count
                                else return null; // return null for remove 
                            }
                            return item; // return other items as it is
                        }).filter((item)=> item !== null);
            });
        } catch (error) {
            console.log("Error While Remove Cart Item  : ", error);
        }
    };

    const deleteFromCart = async(foodId, size, customization) => {
        try {
            if(user){
                
                    const res = await fetchWithAuth("http://localhost:8080/api/cartitems/deletecartitem/" + user.id,
                                    {
                                        method:"DELETE",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            foodId : foodId,
                                            size: size,
                                            customization: customization
                                        })
                                    }
                                )
                    if(!res.ok){
                        toast.error("Unable to delete food items from cart");
                        return;
                    }  
                                    
            }

            setCartItems((prev) =>
                prev.filter(
                (item) =>
                    item.foodId !== foodId ||
                    item.size !== size ||
                    JSON.stringify(item.customization) !== JSON.stringify(customization)
                )
            );
            toast.success("Food Items Deleted from Your Cart")
        } catch (error) {
            console.log("Error While Deleting Cart Item  : ", error);
        } 
    }

    // Clear entire cart
    const clearCart = () => setCartItems([]);

    return (
    <CartContext.Provider value={{ cartItems, addToCart, setCartItems, clearCart, totalItems, deleteFromCart, removeFromCart}}>
       {children}
    </CartContext.Provider>
  );

}

export const useCart = ()=> useContext(CartContext);
import React, { useEffect, useState } from 'react'
import "../FoodDetail/FoodDetail.css"
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import FoodDecreaseCard from '../../components/FoodDecreaseCard/FoodDecreaseCard'
import Slider from "react-slick";


const FoodDetail = () => {
    const {id,category} = useParams();
    const [food, setFood] = useState();
    const {fetchWithAuth} = useAuth();
    const [sizes, setSizes] = useState([]);
    const [customizations, setCustomizations] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedCustomizations, setSelectedCustomizations] = useState([]);
    const [startingPrice, setStartingPrice] = useState(0);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [customizationPrice, setCustomizationsPrice] = useState(0);
    const { addToCart, cartItems } = useCart();
    const [count, setCount] = useState(0);
    const [showDecreseFood, setShowDecreseFood] =  useState(false);
    const rating = 4.6;
    const ratedCount = 2000;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true
    };

    const fetchFood = async ()=>{
        if(id == null) return;
        await fetchWithAuth(`http://localhost:8080/api/foods/${id}`,{
                        method : "GET"
                    })
                    .then(res=> res.json())
                    .then(data => {
                        console.log("food data fetched" , data)
                        setFood(data)})
                    .catch(err => console.error("error while fetch food : ", err));

        await fetchWithAuth(`http://localhost:8080/api/size/foodId/${id}`,
                    {
                        method: 'GET'
                    })
                    .then(res => res.json())
                    .then(data => {
                        setSizes(data)
                        const res = [...data].sort((a, b)=> a.price - b.price)[0];
                        setSelectedSize(res.sizeName);
                        setStartingPrice(res.price);
                        setDiscountPrice(res.discount);
                    })
                    .catch(err => console.error("Error fetching sizes:", err));

        await fetchWithAuth(`http://localhost:8080/api/customization/getByCategory/${category}`,
                    {
                    method: 'GET'
                    })
                    .then(res => res.json())
                    .then(data => setCustomizations(data))
                    .catch(err => console.error("Error fetching customizations:", err));  
    }

    useEffect(()=>{
        fetchFood();
    }, [id, category]);


    useEffect(()=>{
        setCount(cartItems.filter(item => item.foodId === id).reduce((sum, item) => (sum + item?.count || 0), 0));    
    },[cartItems, id]);

    const discount = (price, discount) => {
        return (price * discount)/100;
    }

    const handleAddToCart = () => {
        if (!selectedSize) {
        alert("Please select a size before adding to cart!");
        return;
        }

        const newitem = {
            foodId: food.id,
            imageUrl: food.imageUrl[0],
            name: food.name,
            size: selectedSize,
            customization: selectedCustomizations,
            price: startingPrice,
            discount: discountPrice,
            category: category,
            count: 1,
            description: food.description
        }

        console.log("cartt newItem before adding to cart :  ",newitem)
        //add item to cart
        addToCart(newitem);
    };

    useEffect(()=>{
        if(selectedCustomizations.length > 0){
            setCustomizationsPrice(
                selectedCustomizations.reduce((sum, c)=>sum + c.price, 0)
            );
        }
        else{
            setCustomizationsPrice(0);
        }
    },[selectedCustomizations])

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

    const handleRemoveFromCart = ()=>{
        setShowDecreseFood(true);
    }

  return (
    <div className="food-container">
      <div className="food-left">
        <Slider {...settings}>
            {
                food?.imageUrl?.length > 0 && food.imageUrl.map((img, index)=>(
                     <img 
                        src={img} 
                        alt={food?.name} 
                        key={index} 
                        className="food-image" 
                    />
                ))
            }
        </Slider>
        
        <div className="food-info">
            <h2>{food?.name}</h2>
            <p className="rating">⭐ {rating} ({ratedCount})</p>
            <p className="desc">{food?.description}</p>
            <hr className="divider" />
            <div className="reviews">
                <h3>Customer Reviews</h3>
                <div className="review">
                    <div className='img-name'>
                        <img src="/images/avatar1.jpg" alt="Ava" />
                        <h4>Ava Thompson( rating:{rating} )</h4>
                    </div>
                    <p>Comment: Perfect balance of sauce and cheese. Crust is light and crisp!</p>
                </div>
            </div>
        </div>
      </div>

      <div className="food-right">
        <div className="quantity-card">
          <h3>Quantity</h3>
          <div className="quantity-section">
                {
                    count === 0 ? (
                        <button className="addBtn" onClick={handleAddToCart}>Add</button>
                    ) : 
                    (
                    <div className="count">
                        <button onClick={handleRemoveFromCart}>-</button>
                        <span>{count}</span>
                        <button onClick={handleAddToCart}>+</button>
                    </div>
                    )
                }
            <p className="price">Total Price: ₹{startingPrice - discount(startingPrice, discountPrice) + customizationPrice}</p>
          </div>
        </div>
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
      </div>
      {
        showDecreseFood && 
        <FoodDecreaseCard 
          onClose={() => setShowDecreseFood(false)}
          foodId={id} 
          name={id.name}
        />
      }
    </div>
  )
}

export default FoodDetail

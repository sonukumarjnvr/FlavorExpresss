import React, { useEffect, useState } from 'react'
import FoodCard from '../FoodCard/FoodCard.jsx'
import { useRef } from 'react';
import './NewFood.css'
import { getFoodsByCategory } from '../../service/foodService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const NewFood = () => {
    const isNew = true;
    const rating = 4.8; 
    const ratedCount = 400;
    const [foodList, setFoodList] = useState([]);
    const {accessToken} = useAuth();

    // fetch food by Combo Category
    useEffect(()=>{
        getFoodsByCategory("Combo", accessToken)
            .then((res)=>setFoodList(res))
            .catch((err)=>console.log(err));
    }, []);

    const containerRef = useRef(null);
    const scrollAmount = 500;

    const clickRight = () => {
        console.log("access token in new food click right : " + accessToken)
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const clickLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    };
  return (
    <div className='popularDishes-container'>
        <div className="section-header">
            <div className="section-arrow">
                <h2>What? New</h2>
                <div className="section-icon">
                    <i className="bi bi-arrow-left-circle" id='leftArrow' onClick={clickLeft}></i>
                    <i className="bi bi-arrow-right-circle" id='rightArrow' onClick={clickRight}></i>
                </div>
            </div> 
        </div>
        <div className="food-items" ref={containerRef} >
            {foodList &&
                foodList.map((item, index) => (
                <div className="food-item-all" key={index}  >
                    <FoodCard
                        imageUrl={item.imageUrl[0]}
                        name={item.name}
                        foodId={item.id}
                        rating={rating}
                        ratedCount={ratedCount}
                        category="Combo"
                        diet= {item.diet}
                        description={item.description}
                        isNew={isNew}
                    />
                </div>
                
                ))
            }
        </div>
           
     </div>
  )
}

export default NewFood;

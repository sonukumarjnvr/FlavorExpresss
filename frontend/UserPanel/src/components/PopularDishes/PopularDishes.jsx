import React, { useEffect } from 'react'
import FoodCard from '../FoodCard/FoodCard.jsx'
import { useRef } from 'react';
import './PopularDishes.css'
import { useAuth } from '../../context/AuthContext.jsx';    

const PopularDishes = () => {
    const [foodList, setFoodList] = React.useState([]);
    const {fetchWithAuth} = useAuth();
    const rating = 4.8; 
    const ratedCount = 400;
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await fetchWithAuth('http://localhost:8080/api/foods/allFoods',
                    {
                        method: 'GET'
                    }
                );
                const data = await response.json();
                setFoodList(data);
            } catch (error) {
                console.error('Error fetching food data:', error);
            }
        };
        fetchData();

    }, [])

    const containerRef = useRef(null);
    const scrollAmount = 500;

    const clickRight = () => {
        
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
                <h2>Popular Dishes</h2>
                <div className="section-icon">
                    <i className="bi bi-arrow-left-circle" id='leftArrow' onClick={clickLeft}></i>
                    <i className="bi bi-arrow-right-circle" id='rightArrow' onClick={clickRight}></i>
                </div>
            </div> 
        </div>
        <div className="food-items" ref={containerRef} >
            {foodList.length > 0 &&
                foodList.map((item, index) => (
                <div className="food-item-all" key={index}  >
                    <FoodCard
                        foodId={item.id}
                        imageUrl={item.imageUrl[0]}
                        name={item.name}
                        rating={rating}
                        ratedCount={ratedCount}
                        category={item.category}
                        diet={item.diet}
                        price={item.price}
                        description={item.description}
                    />
                </div>
                ))
            }
        </div>
           
     </div>
  )
}

export default PopularDishes;

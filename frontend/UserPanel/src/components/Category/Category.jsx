import React from 'react'
import "./Category.css"
import { useRef } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { getAllCategory } from '../../service/categoryService';
import { useNavigate } from 'react-router-dom';

const Category = () => {

    const containerRef = useRef(null);
    const [categoryData, setCategoryData] = useState([]);
    const navigate = useNavigate();

    const fetchCategory = async ()=>{
        getAllCategory()
            .then((res)=> setCategoryData(res))
            .catch((error)=> console.log(error))
    }

    useEffect(()=>{
        fetchCategory();
    }, [])

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

    const handleCategory = (categoryName)=>{
        
        if (categoryName != null) {
            navigate(`/menu?category=${encodeURIComponent(categoryName)}`);
        } else {
            navigate("/menu");
        }
    }
  
  return (
        <div class="food-section">
            <div class="section-header">
                <div class="section-arrow">
                    <h2>Order Our Best Food Options</h2>
                    <div class="section-icon">
                        <i class="bi bi-arrow-left-circle" id='leftArrow' onClick={clickLeft}></i>
                        <i class="bi bi-arrow-right-circle" id='rightArrow' onClick={clickRight}></i>
                    </div>
                </div> 
            </div>
            
            <div class="category-container" id="scrollContainer" ref={containerRef} >
                {
                    categoryData && categoryData.map((item, index)=>(
                        <div class="category" key={index} onClick={()=> handleCategory(item.categoryName)}>
                            <img src={item.categoryImageUrl} alt={item.categoryName}/>
                            <p>{item.categoryName}</p>
                        </div>
                    ))
                }
               
            </div>
        </div>
  )
}

export default Category

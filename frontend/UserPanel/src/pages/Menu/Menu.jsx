import React, { useEffect, useState } from 'react'
import FoodCard from '../../components/FoodCard/FoodCard';
import { useAuth } from '../../context/AuthContext'; 
import "../Menu/Menu.css"
import {assets} from "../../asset/assets"
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Menu = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [foodList, setFoodList] = useState([]);
  const {fetchWithAuth, user} = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDiet, setSelectedDiet] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search)
  const intialQuery = params.get("query") || "";
  const intialCategory = params.get("category") || "All"
  const [searchQuery, setSearchQuery] = useState(intialQuery);
  const [selectedCategory, setSelectedCategory] = useState(intialCategory);

  const foodListRef = useRef(null); 
  const searchRef = useRef(null);
  const foodsPerPage = 6;

  const rating = 4.5;
  const ratedCount = 400;

   useEffect(()=>{
      const fetchData = async () => {
          try {
            const params = new URLSearchParams()
            console.log("search query in donsole : " , searchQuery);
            if(searchQuery) params.append("query", searchQuery);
            if(selectedCategory && selectedCategory !== "All") params.append("category", selectedCategory);
            if(selectedDiet) params.append("diet", selectedDiet);

              const response = await fetchWithAuth(`http://localhost:8080/api/foods/search?${params}`,
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
  
    }, [searchQuery, selectedCategory, selectedDiet, user]);

    useEffect(()=>{
      const fetchcategory = async()=>{
          try {
              const res = await fetchWithAuth("http://localhost:8080/api/category/allCategory",{
                                  method:"GET"
                                }
                              )
              setAllCategory(await res.json());
          } catch (error) {
            console.log(error);
          }
      }

      fetchcategory();
    }, [])

    useEffect(() => {
        const words = ["Search Pizza....", "Search Burger....", "Search Biryani....", "Search Rolls....", "Search Biryani...."];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
    
        const typingSpeed = 120;
        const deletingSpeed = 80;
        const pauseBetweenWords = 1000;
    
        function typeEffect() {
          const inputEl = searchRef.current;
          if (!inputEl) return;
    
          const currentWord = words[wordIndex];
          inputEl.setAttribute("placeholder", currentWord.substring(0, charIndex));
    
          if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(typeEffect, typingSpeed);
          } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeEffect, deletingSpeed);
          } else {
            if (!isDeleting) {
              isDeleting = true;
              setTimeout(typeEffect, pauseBetweenWords);
            } else {
              isDeleting = false;
              wordIndex = (wordIndex + 1) % words.length;
              setTimeout(typeEffect, typingSpeed);
            }
          }
        }
    
        typeEffect(); // Start typing when component mounts
      }, []);

/// calculate indexes for pagination
    const indexOfLastFood = currentPage * foodsPerPage;
    const indexOfFirstFood = indexOfLastFood - foodsPerPage;
    const currentFoods = foodList.slice(indexOfFirstFood, indexOfLastFood);
//total pages
    const totalPages= Math.ceil(foodList.length / foodsPerPage);

  const handleSort = (e) => {
    const value = e.target.value;
    setSelectedSort(value);
  };

  const handlePrev = ()=>{
    if(currentPage > 1) setCurrentPage((prev)=> prev-1);
    scrollToTop();
  }

  const handleNext = ()=>{
    if(currentPage < totalPages) setCurrentPage((prev)=> prev+1);
    scrollToTop();
  }

  const scrollToTop = () => {
    foodListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategory =(categoryName)=>{
    if(categoryName === selectedCategory) {
      setSelectedCategory("All");
      return;
    }
     setSelectedCategory(categoryName);
  }

  const handleDiet = (diet)=>{
    if(diet === selectedDiet){
      setSelectedDiet("");
      return;
    }
    setSelectedDiet(diet);
  }

  const handleSearch = () => {
    
    const query = searchRef.current.value.trim();
    console.log("search query in click ", query);
    setSearchQuery(query); 
  };

  return (
        <div className="menu-container">
          <div className="filters">
            <div className='name'>
                <h3>Filters</h3>
            </div>
            <div className="filter-box">
              <p>All Category</p>
               <div className='all-category'>
                  <button 
                      className={selectedCategory === "All" ? "activateBtn" : "cat-button"}
                      onClick={()=>handleCategory("All")} 
                    >
                      All
                  </button>
                  { allCategory && allCategory.map((cat) => (
                    <button 
                      key={cat.id}
                      className={selectedCategory === cat.categoryName ? "activateBtn" : "cat-button"}
                      onClick={()=>handleCategory(cat.categoryName)}
                    >
                      {cat.categoryName}
                    </button>
                  ))}
               </div>
            </div>
            <div className="filter-box">
              <p>Dietary</p>
              <div className='diet'>
                 <label 
                    className={selectedDiet === "Veg" ? "activateBtn" : "dietBtn"}
                    onClick={()=> handleDiet("Veg")}
                 >
                  Veg
                 </label>
                 <label 
                    className={selectedDiet === "Non-Veg" ? "activateBtn" : "dietBtn"}
                    onClick={()=> handleDiet("Non-Veg")}
                  > 
                  Non-Veg
                  </label>
              </div>
            </div>
          </div>

          <div className="menu-section" ref={foodListRef}>
            
            <div className="search-sort-container">   
              <div class="search-container1">
                  <div class="search-icon1">
                      <i class="bi bi-search"></i>
                      <input type="text" placeholder="" class="search-input1" value={searchQuery} ref={searchRef} onChange={handleSearch}/>
                  </div>
                  <button class="search-btn1" onClick={handleSearch}>Search</button>
              </div>  
              <div class="sort-bar">
                <img src={assets.sort} alt="sort"/>
                <label htmlFor="sort" className="sortby-label">Sort by:</label>
                <select id="sort" value={selectedSort} onChange={handleSort} className="sortby-select">
                  <option value="Popular">Popular</option>
                  <option value="Newest">Newest</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
              </div>
            </div>
            <div className='all-category'>
                <button 
                    className={selectedCategory === "All" ? "activateBtn" : "cat-button"}
                    onClick={()=>handleCategory("All")} 
                  >
                    All
                </button>
                { allCategory && allCategory.map((cat) => (
                  <button 
                    key={cat.id}
                    className={selectedCategory === cat.categoryName ? "activateBtn" : "cat-button"}
                    onClick={()=>handleCategory(cat.categoryName)}
                  >
                    {cat.categoryName}
                  </button>
                ))}
            </div>
            <div className="food-items"  >
                {currentFoods.length > 0 &&
                    currentFoods.map((item, index) => (
                    <div className="food-item-all" key={item.id}  >
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

                  {/* Pagination Buttons */}
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              ⬅ Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next ➡
            </button>
          </div>
          </div>
    </div>
  )
}

export default Menu

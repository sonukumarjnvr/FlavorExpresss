import React, {useEffect, useState}from 'react'
import './Home.css'
import {assets} from '../../asset/assets'
import Category from '../../components/Category/Category'
import { useRef } from 'react'
import PopularDishes from '../../components/PopularDishes/PopularDishes'
import NewFood from '../../components/NewFood/NewFood'
import {toast} from 'react-toastify'
import {useNavigate} from "react-router-dom"
import { useAuth } from '../../context/AuthContext' 
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";



const Home = () => {
  const searchRef = useRef(null);
  const [showSearch, setShowSearch] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const {address, setAddress} = useAuth();
  const searchBoxRef = useRef(null);
  const libraries = ["places"];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries,
  });


  useEffect(() => {
      const words = ["Search Pizza....", "Search Burger....", "Search Biryani....", "Search Rolls....", "Search Biryani...."];
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
  
      const typingSpeed = 120;
      const deletingSpeed = 80;
      const pauseBetweenWords = 1000;
  
      function typeEffect(){
        const input = searchRef.current;
        if (!input) return;
  
        const currentWord = words[wordIndex];
        input.setAttribute("placeholder", currentWord.substring(0, charIndex));
  
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


  // when user selects a place
  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      setAddress(place.formatted_address);
      setShowSearch(true);
      toast.success("Address Selected")
    }
  };

  // current location handler
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Current location:", position.coords);
        const { latitude, longitude } = position.coords;

        // optional: reverse geocode using Google API
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          if (status === "OK" && results[0]) {
            setAddress(results[0].formatted_address);
            setShowSearch(true);
            toast.success("Location Fetched");
          }
        });
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

    const handleChange = ()=>{
      setShowSearch(false);
    }

    const handleSearch = ()=>{
        if (searchText.trim() !== "") {
        navigate(`/menu?query=${encodeURIComponent(searchText)}`);
      } else {
        navigate("/menu");
      }
    }

    const handleOrder = ()=>{
      navigate("/menu")
    }

  if (!isLoaded) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  }
 
  return (
    <div>
        <section class="hero">
            <div class="image-container">
                <img class="image" src={assets.hero} alt="Pizza" />
            </div>
            <div class="hero-content">
                <div class="hero-text">
                    <p class="text-top">Fresh • Fast • Flavorful.....</p>
                    <h2 class="typing-text" >Delivering warm, delicious meals to your door</h2>
                    <p class="text-below">Handpicked favorites from local kitchens. Enjoy warm reddish-brown vibes and comforting flavors.</p>
                </div>
                <div class="hero-actions">
                    <div class="eta">20–25 min avg</div>
                    <button class="order-btn" onClick={handleOrder}>Order Now</button>
                </div>
            </div>
        </section>

        <section class="location">
            <div class="location-icon">
                <div class="circle-icon">
                  <i class="bi bi-geo-alt"></i>
                </div> 
                <div class="location-span">
                    <label htmlFor="">Set Delivery Location</label>
                    <span>{address}</span>
                </div>  
            </div>
            <div class="location-input">
              {
                  address && showSearch ? (
                   <div class="change">
                      <div className='changeBtn'>
                          <button onClick={handleChange}>Change</button>
                      </div>
                   </div>
                  ) : (
                      <div class="suggestion">
                        <div class="search">
                          <i class="bi bi-search"></i>
                          <StandaloneSearchBox onLoad={(ref) => (searchBoxRef.current = ref)} onPlacesChanged={onPlacesChanged} className="suggetions">
                              <input 
                                type="text" 
                                placeholder="Enter address" 
                              />
                          </StandaloneSearchBox>
                        </div>
                     </div>
                  )
              }
                   
              <div class="use-location">
                  <i class="bi bi-crosshair"></i>
                  <button onClick={handleCurrentLocation}>Current location</button>
              </div>  
            </div>
        </section>

        <section class="search-bar">
            <div class="search-container">
                <div class="search-icon">
                    <i class="bi bi-search"></i>
                    <input 
                      type="text" 
                      placeholder="Search Foods..." 
                      class="search-input"
                      ref={searchRef}
                      value={searchText}
                      onChange={(e)=>setSearchText(e.target.value)}
                    />
                </div>
                <button class="search-btn" onClick={handleSearch}>Search</button>
            </div> 
        </section>
        <Category/>
        <NewFood/>
        <PopularDishes/>
           
    </div>
  )
}

export default Home

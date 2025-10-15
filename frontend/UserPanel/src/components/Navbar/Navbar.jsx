import React,{useState, useEffect} from 'react'
import './Navbar.css'
import {useNavigate} from "react-router-dom"
import LoginOtp from '../../pages/Login/LoginOtp';
import { useAuth } from '../../context/AuthContext';
import { assets } from '../../asset/assets'; 
import { useCart } from '../../context/CartContext';
import CardDrawer from '../CardDrawer/CardDrawer';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const {accessToken, logout} = useAuth();
  const {totalItems} = useCart();
  const [showCartDrawer, setShowCartDrawer] = useState(false);


  const handleCart = (tab, path)=>{
      setActiveTab(tab);
      setShowCartDrawer(true);
  }


  const handleLogout = ()=>{
   
    const confirm = window.confirm("Do you want to logout ?");
    if(!confirm){
      return;
    }
    
    logout();
  }

  const handleLogo = ()=>{
    navigate("/");
  }

  const handleClick = (activetab, path)=>{
    setActiveTab(activetab);
    navigate(path);
  }

 
  return (
    <div class="navbar">
        <div class="logo" onClick={handleLogo}>
          <img src={assets.logo} alt="logo" width={30} height={30} style={{backgroundColor:"#ffffffff"}}/>
          FlavorExpress
        </div>
        <nav class="nav-links">
            <a className={activeTab === "home" ? "activate" : "home"} onClick={()=>{ handleClick("home", "/")}}>Home</a>
            <a className={activeTab === "menu" ? "activate" : "menu"} onClick={()=>{ handleClick("menu", "/menu")}}>Menu</a>
            <a className={activeTab === "offers" ? "activate" : "offers"} onClick={()=>{ handleClick("offers", "/offers")}}>Offers</a>
            <a className={activeTab === "myOrders" ? "activate" : "myOrders"} onClick={()=>{ handleClick("myOrders", "/myOrders")}}>My Orders</a>
        </nav>
        
        <div class="nav-actions">
            {
              accessToken ? (
                <button class="login-btn" onClick={handleLogout}>Logout</button>
              ) : (
                <div>
                  <button class="login-btn" onClick={()=>{setShowLogin(true)}}>Login/SignUp</button>
                  <LoginOtp
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    onLoginSuccess={() => setShowLogin(false)}
                  />
                </div>
              )
            }
            <div  className={activeTab === "cart" ? "activate" : "cart"} onClick={()=>{ handleCart()}}>
                <i class="bi bi-cart"></i>
                <i class="item-count">{totalItems}</i>
            </div>
            <button class="menu-toggle">☰</button>
        </div>  
        {
          showCartDrawer &&
          <CardDrawer onClose={()=>setShowCartDrawer(false)}/>
        }
    </div>
  )
}

export default Navbar

import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import OtpVerification from './pages/OtpVerification/OtpVerification';
import Oauth2Success from './components/Oauth2/Oauth2Success';
import FoodDetail from './pages/FoodDetail/FoodDetail';
import MyOrders from './pages/MyOrders/MyOrders'
import OrderDetails from './pages/OrderDetails/OrderDetails';



const App = () => {
  return (
    <div class="body-container">
      <Navbar/>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/menu" element={<Menu/>}/>
        <Route path="/otpVerification" element={<OtpVerification/>} />
        <Route path="/oauth2success" element={<Oauth2Success/>}/>
        <Route path="/foodDetail/:category/:id" element={<FoodDetail/>}/>
        <Route path="/my-orders" element={<MyOrders/>}/>
        <Route path="/my-orders/:userId/:orderId" element={<OrderDetails/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App  

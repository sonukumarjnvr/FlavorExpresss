import React, { useEffect, useState ,useRef} from 'react'
import { assets } from '../../asset/assets'
import "../MyOrders/MyOrders.css"
import { useAuth } from '../../context/AuthContext'
import OrderItem from '../../components/OrderItem/OrderItem.jsx'
import {useNavigate} from "react-router-dom"  
import { toast } from 'react-toastify'


const MyOrders = () => {
    const [status, setStatus] = useState("PLACED");
    const [orderItems, setOrderItems] = useState([]);
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const {user, setUser, fetchWithAuth} = useAuth();
    const [cancel, setCancel] = useState(false);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("Enter Your Name");
    const [showInput, setShowInput] = useState(true);
    const inputRef = useRef(null);  

    const fetchOrder = async ()=>{
      try {
          // Base URL
          let url = `http://localhost:8080/api/orders/user/${user.id}/filter?`;

          // Add filters only if they are present
          if (status) url += `status=${status}&`;
          if (startDate) url += `startDate=${startDate}&`;
          if (endDate) url += `endDate=${endDate}`;

          // Remove trailing '&' or '?' if any
          url = url.replace(/[&?]$/, "");

          const res = await fetchWithAuth(url, {
            method :"GET"
          })

          if(res.ok){
            const response = await res.json();
            setOrderItems(response);
            if(user.name){
              setUserName(user.name); 
            }
            console.log("order items in my orders : ", response);
          }
      } catch (error) {
         console.error(error);
       }
    }

    useEffect(()=>{
       fetchOrder();
    }, [status, startDate, endDate, user, cancel])

    const handleFilterChange = (e)=>{
      const value = e.target.value;
      const todayDate = new Date();

      if (value === "today") {
        setStartDate(today);
        setEndDate(today);
      } 
      else if (value === "yesterday") {
        const yesterday = new Date(todayDate);
        yesterday.setDate(todayDate.getDate() - 1);
        setStartDate(yesterday.toISOString().split("T")[0]);
        setEndDate(yesterday.toISOString().split("T")[0]);
      } 
      else if (value === "last10") {
        const last10 = new Date(todayDate);
        last10.setDate(todayDate.getDate() - 10);
        setStartDate(last10.toISOString().split("T")[0]);
        setEndDate(today);
      } 
      else if (value === "last30") {
        const last30 = new Date(todayDate);
        last30.setDate(todayDate.getDate() - 30);
        setStartDate(last30.toISOString().split("T")[0]);
        setEndDate(today);
      }
    }

    // Focus the input automatically when it's enabled
  useEffect(() => {
    if (!showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleSave = async()=>{ 
    try {
      const res = await fetchWithAuth(`http://localhost:8080/api/auth/${user.id}/update-name?name=${userName}`,{
        method:"PUT"
      })

      if(res.ok){
        const response = await res.json();
        setUser(response);
        setShowInput(true);
        toast.success("Profile Name Saved Successfully")
      }
    } catch (error) {
      toast.error("Fail to Save");
      console.error(error);
    }
  }
  return (
    <div className='my-orders-container'>
      <div className='left-cointainer'>
        <p className='namee'>Tracking</p>
        <div className='track-orders'>
            <button className={status === "PLACED"? "click-btn" : "btnn"} onClick={()=> setStatus("PLACED")}>Order Placed</button>
            <button className={status === "DELIVERED"? "click-btn" : "btnn"} onClick={()=> setStatus("DELIVERED")}>Delivered</button>
            <button className={status === "CANCELED"? "click-btn" : "btnn"} onClick={()=> setStatus("CANCELED")}>Canceled</button>
        </div>
      </div>
      
      <div className='right-containerr'>
        <div className='profile'>
            <img src={assets.user} alt="profile" />
            <div className='profile-details'>
              <div className='profile-name'> 
                  <input 
                    ref={inputRef}
                    placeholder='Enter Name' 
                    type="text" 
                    value={userName} 
                    onChange={(e)=>setUserName(e.target.value)} 
                    disabled={showInput}
                  />
                  {
                    showInput ? (
                        <span className='action' onClick={()=>setShowInput(false)}><i class="bi bi-pencil"></i> Edit</span>
                    ) : (
                        <span className='action' onClick={handleSave}><i class="bi bi-floppy"></i> Save</span>
                    )
                  }
                  
              </div>
              {
                user && user.phoneNumber ? (
                  <span className='phoneNumber'><i class="bi bi-telephone"></i> {user?.phoneNumber}</span>
                ) : (
                  <span className='email'><i class="bi bi-envelope-at"></i> {user?.email}</span>
                )
              }
            </div>
        </div>
        <div class="sort-bar1">
            <img src={assets.sort} alt="sort"/>
            <label htmlFor="sort" className="sortby-label1">Filter:</label>
            <select id="sort"  className="sortby-select1"onChange={handleFilterChange}>
                <option value="today" > Today </option>
                <option value="yesterday">Yesterday</option>
                <option value="last10">Last 10 Days</option>
                <option value="last30">Last 30 Days</option>
            </select>
        </div>
        <div className='orders-container'>
            {
              orderItems && orderItems.length > 0 ? 
              (
                orderItems.map((item)=>(
                  <div key={item.id}>
                    <OrderItem
                      imageUrl={item.imageUrl}
                      orderNo={item.orderNo}
                      orderStatus={item.orderStatus}
                      items={item.items}
                      totalAmount={item.totalAmount}
                      orderId={item.id}
                      userId={user.id}
                      paymentStatus={item.paymentStatus}
                      cancel={()=>setCancel((prev)=> !prev)}
                      keyId={item.keyId}
                      currency={item.currency}
                      razorpayOrderId={item.razorpayOrderId}
                      phone={item.phone}
                    />
                  </div>
                ))
              ) :
              (
                <div className='not-found-button'>
                  <p className='not-found'>No Orders Found</p>
                  <button className='order-now' onClick={()=>navigate("/menu")}>Order Now</button>
                </div>
              )
            }
        </div>
      </div> 
    </div>
  )
}

export default MyOrders

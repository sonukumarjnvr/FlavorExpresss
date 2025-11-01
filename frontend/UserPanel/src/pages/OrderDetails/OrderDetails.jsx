import React, { useEffect, useState } from 'react'
import "../OrderDetails/OrderDetails.css"
import { useAuth } from '../../context/AuthContext'
import { useParams } from 'react-router-dom'
import {assets} from "../../asset/assets"
import Item from '../../components/Item/Item'

const OrderDetails = () => {
    const {orderId, userId} = useParams();
    const {fetchWithAuth} = useAuth();
    const [order, setOrder] = useState(null);
    const [statuses, setStatuses] = useState(["PLACED", "BEING PREPARED", "PICKUP", "OUT FOR DELIVERY", "DELIVERED"]);
    const [itemsPrice, setItemsPrice] = useState(0);
    const [taxes, setTaxes] = useState(0);
    const [deliveryCharges, setDeliveryCharges] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [savings, setSavings] = useState(0);
    const [paymentInfo, setPaymentInfo] = useState(null);

    const findSum = ()=>{
      const TotalPrice = (order?.items?.reduce((sum, item) => sum + item.price * item.count, 0))?.toFixed(2);
      const customizationPrice = (order?.items?.reduce((sum, item) => sum + item.count * item?.customization?.reduce((cSum, cItem) => cSum + cItem.price, 0), 0))?.toFixed(2);
      const TotalPriceWithCustomization = (parseFloat(TotalPrice) + parseFloat(customizationPrice))?.toFixed(2);
      setItemsPrice(TotalPriceWithCustomization);
      const delivery = (order?.items?.length > 0 && TotalPrice < 149 ? 30 : 0)?.toFixed(2);
      setDeliveryCharges(delivery);
      const  totalDiscount = (order?.items?.reduce((sum, item) => sum + item.count * (item.price * item.discount) / 100, 0))?.toFixed(2);
      setSavings(totalDiscount);
      const taxesPrice = (0.05 * (TotalPriceWithCustomization-totalDiscount))?.toFixed(2)
      setTaxes(taxesPrice);
      setFinalPrice(( parseFloat(TotalPriceWithCustomization)+  parseFloat(taxesPrice) + parseFloat(delivery) -  parseFloat(totalDiscount))?.toFixed(2));
    }

    const fetchPayment = async()=>{
      try {
        console.log("order in payment : ", order);
        const res = await fetchWithAuth(`http://localhost:8080/api/payment/payment-info/${order.razorpayPaymentId }`,{
                        method: "GET"
                      })
        if(res.ok){
          const response = await res.json();
          console.log("payment info : ", response);
          setPaymentInfo(response);
        }
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(()=>{
        const fetchDetail = async ()=>{
            try {
                console.log("orderId : ", orderId)
                const res = await fetchWithAuth(`http://localhost:8080/api/orders/${userId}/${orderId}?`,{
                    method: "GET"
                })

                if(res.ok){
                    const response =  await res.json();
                    setOrder(response);
                    console.log(response);
                }
            }catch (error) {
                console.log(error);
            }
        }
        fetchDetail();
        findSum();
        fetchPayment();
    }, [orderId, userId])

    const currentIndex = statuses.indexOf(order?.orderStatus);

  return (
    <div className='order-detail'>
      <div className='left-container'>
        <div className='map'>
          <p>Delivery Location: {order?.address}</p>
        </div>
        <div className='order-detail-all'>
          <h4>Order Number: {order?.orderNo}</h4>
          <div className='order-status'>
            {
              statuses.map((status, index)=>(
                <div key={status} className={`step ${index <= currentIndex ? "activee" : ""}`}>
                  <div
                    className={`circle ${index <= currentIndex ? "activee" : ""}`}
                  >
                    {index + 1}
                  </div>
                  <p className={`label ${index <= currentIndex ? "active-text" : ""}`}>
                    {status}
                  </p>
                </div>
              )) 
            }
          </div>
          <div className='rider'>
              <div className='rider-img-text'>
                <img src={assets.logo} alt="img" />
                <div className='rider-text'>
                  <h4>Rider Name</h4>
                  <p>Your rider Bike: #BR2090392</p>
                </div>
              </div>
              <div className='call'>
               <i class="bi bi-telephone"></i>Call
              </div>
              <div className='call'>
                <i class="bi bi-chat-left-text"></i>
                Message
              </div>
          </div>
        </div>
        <div className='order-items'>
          <h4>Orders in this order</h4>
            {
              order && order?.items?.map((item, index)=>(
                <Item
                  key={index}
                  item={item}
                />
              ))
            }
        </div>
       
      </div>
      <div className='right-container'>
        <div className='summary'>
            <h4>Order Summary</h4>
            <div className="price-summary1">       
                <div className="price-row1"><span className="spanall">Items</span><span>&#8377; {itemsPrice}</span></div>
                <div className="price-row1"><span className="spanall">Delivery Charges</span><span>&#8377; {deliveryCharges}</span></div>
                <div className="price-row1"><span className="spanall">Taxes(GST 5%)</span><span>&#8377; {taxes}</span></div>
                <div className="price-row1 savings"><span>✔ Discounts</span><span>− &#8377; {savings}</span></div>
                <hr className="divider" />
                <div className="total-row1"><span>Total</span><span>&#8377; {finalPrice}</span></div>
                <hr className="divider" />
                <div className='payment-details'>
                  <button className='payment-status'>{order?.paymentStatus} ( &#8377;{finalPrice} )</button>
                  <button className='invoice'>Download Invoice</button>
                </div>
            </div> 
        </div>
        <div className='payment'>
            <h4>Payment Method</h4>
            <span className='method'>
              <i class="bi bi-credit-card"></i>
              <span>
                {
                  paymentInfo?.method  
                }
              </span>
                  {
                    paymentInfo?.vpa
                  }
              <span></span>
             
            </span> 
        </div>
      </div>
    </div>
  )
}

export default OrderDetails

import React from 'react'
import "../OrderItem/OrderItem.css"
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 

const OrderItem = ({imageUrl, orderNo, orderStatus, totalAmount, items, orderId, userId, paymentStatus, cancel, keyId, currency, razorpayOrderId, phone}) => {
  const {fetchWithAuth} = useAuth();
  const navigate = useNavigate();

  const handleOrderCancel = async ()=>{
    const confirm = window.confirm("Do you want to cancel this order ?")
    if(confirm == false){
      return;
    }

    try {
      const res = await fetchWithAuth(`http://localhost:8080/api/orders/cancel/${userId}/${orderId}`,{
                          method: "PUT"
                        })
        if(res.ok){
          toast.success("Your Order No " + orderNo +" is Cancelled Successfully!")
          cancel();
          return;
        }

        toast.error("Your Order is Not Cancel");
    } catch (error) {
       console.error(error);
    }
  }

  const handleOrderDetail = ()=>{
    navigate(`/my-orders/${userId}/${orderId}`);
  }

  const handlePay = ()=>{
    try {
      console.log("key :", keyId);
      console.log("total ampunt : ", totalAmount);
      console.log("currency : ", currency);
      console.log("razorpay orderId : ", razorpayOrderId);

      const options = {
            key: keyId,
            amount: totalAmount * 100,
            currency: currency,
            name: "Flavor Express",
            description: "Payment for your order",
            order_id: razorpayOrderId,
            handler: async (response)=> {
                try {
                    const verifyRes = await fetchWithAuth("http://localhost:8080/api/payment/verify-payment/" + user.id, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    const verifyData = await verifyRes.json();

                    if (verifyData.status === "success"){
                       setCartItems([]);
                       onClose();
                       onCloseDrawer();
                       toast.success("Your Order is Placed");
                    }
                    else {
                      setShowWait(false);
                      alert("Payment failed!");
                    }

                } catch (error) {
                    console.error(err);
                    setShowWait(false);
                    alert("Something went wrong while verifying payment.");
                }
            },
            prefill: {
                name: "Sonu Sahani",
                email: "sonu@example.com",
                contact: phone,
            },
            theme: { color: "#0a66c2" },
            modal: {
              ondismiss: function () {
                 setShowWait(false);
              },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        
        rzp.on("payment.failed", function (response) {
          setShowWait(false);
          alert("Payment failed. Please try again.");
          console.error(response.error);
        });
    } catch (error) {
      console.error(error);
    }
  }
 
  return (
    <div className='order-item-container'>
      <div className='order-left'>
          <img src={imageUrl} alt='order-image'/>
          <div className='order-details'>
            <h4 
              onClick={handleOrderDetail}
            >
              Order {orderNo}
            </h4>
            <div className='item-name'>
              <span>{items?.length} Items | </span>
              {
                items && items.length>0 &&
                items.map((item,index)=>(
                  <div className='nameee' key={index}>
                    {item.name} |
                  </div>
                ))
              }
            </div>
          </div>
      </div>
      <div className='order-right'>
          {
            paymentStatus === "PAID" ? (
              <div className='status'>{orderStatus}</div>
            ) : (
              <div className='status'>{paymentStatus}</div>
            )
          }
          {
            paymentStatus !== "PAID" && <div className='track' onClick={handlePay}><i class="bi bi-credit-card"></i> Pay</div>
          }
          {
            orderStatus === "PLACED" && <div className='track' onClick={handleOrderDetail}><i class="bi bi-geo-alt"></i>Track</div>
          } 
          {
            orderStatus === "PLACED" && <button className='cancel' onClick={handleOrderCancel}><i class="bi bi-x"></i>Cancel</button>
          }
          {
            orderStatus === "CANCELED" && <div className='track'>{paymentStatus}</div>
          }
      </div>
    </div>
  )
}

export default OrderItem

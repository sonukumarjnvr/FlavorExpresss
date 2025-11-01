import React, { useEffect, useState } from 'react'
import "../Item/Item.css"

const Item = ({item}) => {
    const [cusPrice, setCusPrice] = useState(0);

    useEffect(()=>{
        const findSum = ()=>{
            setCusPrice(item?.customization?.reduce((sum, cus)=> sum + cus?.price, 0));
        }

        findSum();
    },[item])

  return (
    <div className='order-item'>
        <div className='img-name'>
            <img src={item.imageUrl} alt="img" />
            <div className='named'>
                <h4>{item.name} x {item.count}</h4>
                <div className='size'>Size: {item.size}</div>
                <div className='customization'>
                    Customization: 
                    {
                        item?.customization?.length > 0 ? item.customization.map((cus)=>(
                            <span>{cus.customizationName} &#8377;{cus.price} | </span>
                        )) : (
                        <span>No Customization</span>
                        )
                    }
                </div>
            </div>
        </div>
        <p>&#8377;{item.count * (item.price - (item.price * item.discount)/100) + cusPrice}</p>
    </div>
  )
}

export default Item

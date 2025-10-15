import React, { useCallback, useRef, useState, useEffect } from 'react'
import "../OrderDetails/OrderDetails.css"
import { useCart } from '../../context/CartContext'
import CartItem from '../CartItem/CartItem'
import {GoogleMap, Marker, useLoadScript, Autocomplete} from "@react-google-maps/api"
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'


const libs = ["places"];
const containerStyle = {
  width: "100%",
  height: "520px",
  borderRadius: 8,
  overflow: "hidden",
};

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; 

const OrderDetails = ({onClose,onSave}) => {
  const {cartItems} = useCart();
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const watchIdRef = useRef(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPos, setMarkerPos] = useState(defaultCenter);
  const [zoom, setZoom] = useState(15);
  const geocoderRef = useRef(null);
  const [itemsPrice, setItemsPrice] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [savings, setSavings] = useState(0);
  const {address, setAddress, savedAddress,user} = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showInputBox, setShowInputBox] = useState(false);


   useEffect(()=>{
        const TotalPrice = (cartItems.reduce((sum, item) => sum + item.price * item.count, 0)).toFixed(2);
        const customizationPrice = (cartItems.reduce((sum, item) => sum + item.count * item.customization.reduce((cSum, cItem) => cSum + cItem.price, 0), 0)).toFixed(2);
        const TotalPriceWithCustomization = (parseFloat(TotalPrice) + parseFloat(customizationPrice)).toFixed(2);
        setItemsPrice(TotalPriceWithCustomization);
        const delivery = (cartItems.length > 0 && TotalPrice < 149 ? 30 : 0).toFixed(2);
        setDeliveryCharges(delivery);
        const  totalDiscount = (cartItems.reduce((sum, item) => sum + item.count * (item.price * item.discount) / 100, 0)).toFixed(2);
        setSavings(totalDiscount);
        const taxesPrice = (0.05 * (TotalPriceWithCustomization-totalDiscount)).toFixed(2)
        setTaxes(taxesPrice);
        setFinalPrice(( parseFloat(TotalPriceWithCustomization)+  parseFloat(taxesPrice) + parseFloat(delivery) -  parseFloat(totalDiscount)).toFixed(2));

        //set phone number
        if(user.phoneNumber != null){
          setPhoneNumber(user.phoneNumber);
          setShowInputBox(true)
        }
    }, [cartItems]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: libs,
  });


  // Initialize reverse geocoder lazily
  const initGeocoder = () => {
    if (!geocoderRef.current && window.google) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  };

  useEffect(() => {
    if (isLoaded) initGeocoder();
  }, [isLoaded]);


  // Reverse geocode lat/lng -> address
  const reverseGeocode = useCallback((lat, lng) => {
    initGeocoder();
    if (!geocoderRef.current) return;
    geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress(""); // fallback
      }
    });
  }, []);

  // When marker stops moving (dragend)
  const onMarkerDragEnd = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPos({ lat, lng });
    setMapCenter({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);


    // When map loads
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Autocomplete place selected
  const onPlaceChanged = () => {
    const ac = autocompleteRef.current;
    if (ac) {
      const place = ac.getPlace();
      if (!place.geometry) return;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      mapRef.current.panTo({ lat, lng });
      setMapCenter({ lat, lng });
      setMarkerPos({ lat, lng });
      setZoom(15);
      setAddress(place.formatted_address || place.name || "");
    }
  };

  // Single-shot: get current location
  const locateNow = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMapCenter({ lat, lng });
        setMarkerPos({ lat, lng });
        mapRef.current?.panTo({ lat, lng });
        reverseGeocode(lat, lng);
      },
      (err) => {
        console.error(err);
        alert("Could not get your location: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const mapOptions = {
    streetViewControl: false, // remove Pegman
    mapTypeControl: false, // remove satellite toggle
    fullscreenControl: false,
    zoomControl: true, // keep zoom buttons
    scrollwheel: true,         // allow zooming with mouse wheel
    gestureHandling: "auto",
  };

    // Save selected address (callback to parent or send to backend)

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  const handleCross = ()=>{
    onClose();
  }

  const handleSave = ()=>{
    if(!phoneNumber){
      toast.error("Plase Enter Phone Number")
      return
    }

    const cleanedPhone = phoneNumber.replace(/\s+/g, "").replace(/^\+91/,"");
    if (!/^[6-9]/.test(cleanedPhone) || !/^\d*$/.test(cleanedPhone)){
        toast.error("Please Enter Valid Indian Phone Number");
        return;
    }
    setShowInputBox(true);
    toast.success("Phone Number Saved Successfully")
  }

  return (
    <div className="model-overley">
        <div className="order-details-page">
           <div className="details-header">
                <h3>Order Details</h3>
                <button className="cross"onClick={handleCross}>✕</button>
            </div>
            
            <div className='all-details'>
              <div className='cart-items-details'>
                  <div className='cart-items'>
                    {
                      cartItems.length === 0 && (
                        <p className="empty-cart">Please Add Food.</p>
                    ) 
                    }
                    {cartItems.map((item) => (
                        <CartItem key={item.foodid} item={item} onClose = {onClose} />
                    ))}
                  </div>
                  <div className="price-summary">       
                      <div className="price-row"><span className="spanall">Items</span><span>&#8377; {itemsPrice}</span></div>
                      <div className="price-row"><span className="spanall">Delivery Charges</span><span>&#8377; {deliveryCharges}</span></div>
                      <div className="price-row"><span className="spanall">Taxes(GST 5%)</span><span>&#8377; {taxes}</span></div>
                      <div className="price-row savings"><span>✔ Discounts</span><span>− &#8377; {savings}</span></div>
                      <div className="total-row"><span>Total</span><span>&#8377; {finalPrice}</span></div>
                      <div className="cart-actions">
                          <button className="continue-btn" >Proceed To Pay &#8377; {finalPrice} </button>
                      </div>
                  </div>          
              </div>
              <div className='delivery-address-details'>
                  <div className='phoneNumber-div'>
                      <span>Delivery Phone Number: </span>
                      <input 
                        type="tel" 
                        maxLength={10} 
                        value={phoneNumber} 
                        placeholder='Enter Phone Number'
                        onChange={(e)=>(setPhoneNumber(e.target.value))}
                        disabled={showInputBox}
                      />
                      {
                        showInputBox ? (
                          <button className="editBtn" onClick={()=>setShowInputBox(false)}>Edit</button>
                        ) : (
                         <button className="saveBtn" onClick={handleSave} >Save</button>
                        )
                      }
                  </div>
                  <div className='address-div'>
                      <div style={{ marginTop: 6 }}><strong>Your Delivery Address:</strong> {address || "Drag the pin, click map, or use search/current location"}</div>
                  </div>
                  <div className='search-locate'>
                      <div className='search-field'>
                        <Autocomplete
                          onLoad={(ac) => (autocompleteRef.current = ac)}
                          onPlaceChanged={onPlaceChanged}
                        >
                          <input
                            type="text"
                            placeholder="Search address or place"
                          />
                        </Autocomplete>
                      </div>

                      <button onClick={locateNow} >
                        📍Current Location
                      </button>

                  </div>
                  <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={mapCenter}
                      zoom={zoom}
                      onLoad={onMapLoad}
                      options={mapOptions}
                      onClick={(e) => {
                        // place marker where user clicks
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();
                        setMarkerPos({ lat, lng });
                        setMapCenter({ lat, lng });
                        reverseGeocode(lat, lng);
                      }}
                    >
                      <Marker
                        position={markerPos}
                        draggable
                        onDragEnd={onMarkerDragEnd}
                      />
                  </GoogleMap>
                    
                  <p>Saved Address</p>
                  <div className='saved-address'>
                    {
                      savedAddress.length > 0 ? (
                        savedAddress.map((add, index)=>(
                          <div key={index} className='saved-address-card'>
                             {add}
                          </div>
                        ))
                      ) : (
                        <div>No Saved Address</div>
                      )
                    }
                    
                  </div>
              </div>

            </div>
        </div>
    </div>
  )
}

export default OrderDetails

import React from 'react'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({sideBarVisible}) => {
  const navigate = useNavigate();
  const nav = () => {
    navigate('/');
  }
  return (
    <div className={`border-end bg-white ${sideBarVisible ? '' : 'd-none '}`} id="sidebar-wrapper">
        <div className="sidebar-heading border-bottom bg-light" onClick={nav}>
          <img src={assets.logo} alt="logo" width={25} height={25}/>
        </div>
        <div className="list-group list-group-flush">
            <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/addFood">
            <i className="bi bi-plus-circle p-2"></i>
             Add</a>
            <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/listFood">
            <i class="bi bi-list-ul p-2"></i>
             Foods</a>
            <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/orders">
            <i class="bi bi-cart  p-2"></i>
              Orders</a>
            <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/addCategory">
            <i className="bi bi-plus-circle p-2"></i>
              Category</a>
            <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/listCategory">
            <i class="bi bi-list-ul p-2"></i>
              Categories</a>
            <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/customization">
            <i className="bi bi-plus-circle p-2"></i>
              Customization</a>
            <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/allCustomization">
            <i class="bi bi-list-ul p-2"></i>
             Customizations</a>
             <a className="list-group-item list-group-item-action list-group-item-light p-3" href="/foodSize">
            <i className="bi bi-plus-circle p-2"></i>
              Food Size</a>
        </div>
    </div>
)
}

export default Sidebar;

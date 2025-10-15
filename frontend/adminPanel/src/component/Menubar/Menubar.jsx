import React from 'react';
import { assets } from '../../assets/assets';

const Menubar = ({toggleSidebar}) => {
  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div className="container-fluid">
                
                <button className="btn btn-primary" id="sidebarToggle" onClick={toggleSidebar}>
                    <i class="bi bi-list"></i>
                </button>
                
            </div>
        </nav>
    </div>
  )
}

export default Menubar;


import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./component/Sidebar/Sidebar.jsx";
import Menubar from "./component/Menubar/Menubar.jsx";
import AddFood from "./pages/AddFood/AddFood";
import ListFood from "./pages/ListFood/ListFood";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from 'react-toastify';
import EditFood from "./pages/EditFood/EditFood.jsx";
import AddCategory from "./pages/AddCategory/AddCategory.jsx";
import AllCategory from "./pages/AllCategory/AllCategory.jsx";
import EditCategory from "./pages/EditCategory/EditCategory.jsx";
import AllCustomization from "./pages/AllCustomization/AllCustomization.jsx";
import AddCustomization from "./pages/AddCustomization/AddCustomization.jsx"
import FoodSize from "./pages/FoodSize/FoodSize.jsx";


function App() {
  const [sideBarVisible, setSideBarVisible] = React.useState(true); 

  const toggleSidebar = ()=>{
    setSideBarVisible(!sideBarVisible);
  }
  return (
    <div className="d-flex" id="wrapper">
          <Sidebar sideBarVisible={sideBarVisible}/>
    
        <div id="page-content-wrapper">  
            <Menubar toggleSidebar={toggleSidebar}/>
            <ToastContainer/>
            <div className="container-fluid">
                <Routes>
                  <Route path="/addFood" element={<AddFood/>} />
                  <Route path="/listFood" element={<ListFood/>} />
                  <Route path="/orders" element={<Orders/>} />
                  <Route path="/" element={<AddFood/>} />
                  <Route path="/editFood/:id" element={<EditFood/>}/>
                  <Route path="/addCategory" element={<AddCategory/>}/>
                  <Route path="/listCategory" element={<AllCategory/>}/>
                  <Route path="/editCategory/:id" element={<EditCategory/>}/>
                  <Route path="/customization" element={<AddCustomization/>}/>
                  <Route path="/allCustomization" element={<AllCustomization/>}/>
                  <Route path="/foodSize" element={<FoodSize/>}/>
                </Routes>
            </div>
        </div>
    </div>
  )
}

export default App

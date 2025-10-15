import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { deleteFood, getAllFoods } from '../../service/AddFoodService';
import {useNavigate} from 'react-router-dom';

const ListFood = () => {
  const [foodList, setFoodList] = useState([]);
  const navigate = useNavigate();

  const fetchFoodList = async()=>{
     const response = await getAllFoods();
     if(response.status === 200){
        setFoodList(response.data);
     }
     else{
        toast.error("Error while fetching food list");       
     }
  }

  useEffect(()=>{
    fetchFoodList();
  },[])

  const deleteFoodHandler = async(foodId)=>{
    const handleDelete = window.confirm(
      "sure to delete this food?"
    )

    if(handleDelete === false){
      return;
    }

    try {
        const response = await deleteFood(foodId);
        await fetchFoodList();

        if(response.status === 200){
        
          toast.success("Food deleted successfully");
        }else{
          toast.error("Error while deleting food");
        }
    } catch (error) {
      toast.error("Error while deleting food");
    }
    
  }

  const editFoodHandler = async (foodId)=>{
     console.log("edit food", foodId);
    navigate('/editFood/' + foodId);
  }

  return (
    <div className='py-5 justify-content-center'>
      <div className='col-11 card '>
        <table  className='table'>
          <thead>
            <tr>
              <th>Images</th>
              <th>Food Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>

          </thead>
          <tbody>
              {
                 foodList && foodList.map((food, index)=>{
                  return (
                    <tr key={index}>
                      <td>
                        <img src={food.imageUrl[0]} alt="" width={48} height={48} />
                      </td>
                      <td>{food.name}</td>
                      <td className=''>
                        <button className='btn btn-primary btn-md w-40' onClick={()=>{editFoodHandler(food.id)}}>Edit</button>
                      </td >
                      <td className="text-danger">
                        <button className='btn btn-danger btn-md w-30 ' onClick={()=>{deleteFoodHandler(food.id)}}>Delete</button>
                       </td> 
                    </tr>
                  )

                 })   
              }
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListFood

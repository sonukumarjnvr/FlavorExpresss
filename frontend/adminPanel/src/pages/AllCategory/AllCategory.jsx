import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {deleteCategory, getAllCategory} from "../../service/CategoryService"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const AllCategory = () => {

    const [CategoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();

    const fetchCategory = async()=>{
        const response = await getAllCategory();
        if(response.status === 200){
            setCategoryList(response.data);
        }
        else{
            toast.error("Error while fetching categories");
        }   
    }

    useEffect(()=>{
        fetchCategory();
    }, []);

    const editCategoryHandler = (categoryId)=>{
        navigate('/editCategory/' + categoryId);
    }

    const deleteCategoryHandler = async(categoryid, categoryName)=>{
        const handleDelete = window.confirm(
            "Sure to delete this category?"
        )

        if(handleDelete === false){
            return;
        }

        try {
            await deleteCategory(categoryid);
            fetchCategory();
            toast.success(categoryName + " Category is deleted successfully");
        } catch (error) {
            toast.error("Error while deleting category");
            throw error;
        }
    }

  return (
    <div className='py-5 justify-content-center'>
      <div className='col-11 card '>
        <table  className='table'>
          <thead>
            <tr>
              <th>Images</th>
              <th>Category Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>

          </thead>
          <tbody>
              {
                CategoryList && CategoryList.map((category, index)=>{
                    return (
                        <tr key={index}>
                        <td>
                            <img src={category.categoryImageUrl} alt="" width={48} height={48} />
                        </td>
                        <td>{category.categoryName}</td>
                        <td className=''>
                            <button className='btn btn-primary btn-md w-40' onClick={()=>{editCategoryHandler(category.id)}}>Edit</button>
                        </td >
                        <td className="text-danger">
                            <button className='btn btn-danger btn-md w-30 ' onClick={()=>{deleteCategoryHandler(category.id, category.categoryName)}}>Delete</button>
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

export default AllCategory

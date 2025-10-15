import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import { getCategory } from '../../service/CategoryService';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import { editCategory } from '../../service/CategoryService';

const EditCategory = () => {
    const {id} = useParams();
    const [category, setCategory] = useState({});
    const [newFile, setNewFile] = useState("");
    const [preview, setPreview] = useState("");
    const [save, setSave] = useState(false);
    const [previousfile, setPreviousFile] = useState("");
    const navigate = useNavigate();


    useEffect(()=>{
        const fetchCategory= async()=>{
          try {
            const response = await getCategory(id);
          
            if(response.status == 200){
                setCategory(response.data);
                setPreviousFile(response.data.categoryImageUrl);
            }
            else{
              toast.error("Error while fetching category details");
            }
            
          } catch (error) {
            toast.error("Error while fetching category details");
          }
        }
        
        fetchCategory();
      },[id]);

     const onChangeHandler = async (event)=>{
         const categoryName = event.target.name;
         const value = event.target.value;
         setCategory({...category, [categoryName]:value});
    }
     
     const removePreviousFile = ()=>{
       const deleteConfirmMessage = window.confirm("Are you sure to delete this image?");
       if(deleteConfirmMessage === false){
         return;
       } 
       
        setCategory({...category, previousfile:previousfile});
        setPreviousFile("");
     }
     
    const handleDragOver = (event)=>{
        event.preventDefault();
    }
     
    const handleDrop = (event)=>{
        event.preventDefault();
        const newFiles = Array.from(event.dataTransfer.files);
        updateFiles(newFiles);
    }
     
     const handleFileChange = (event)=>{
        const file = event.target.files[0];
        setNewFile(file); // store file in state
        setPreview(URL.createObjectURL(file)); // generate preview URL
     }
     
     const removeFile = (index)=>{
         setNewFile("");
         setPreview("");
     }
     
    const onSubmitHandler = async(e)=>{
         e.preventDefault();
         setSave(true);
         
         if(previousfile.length === 0 && newFile.length === 0 ){
           toast.error("Please select a file");
           setSave(false);
           return;
         }
     
         console.log("previous files", previousfile);
         console.log("new files", newFile);

         let newData;
         if(previousfile === ""){
            newData = {
                "categoryName" : category.categoryName,
               "previousImageUrl": category.categoryImageUrl
            }
         }
         else{
            newData = {
                "categoryName" : category.categoryName,
               "previousImageUrl": ""
            }
         }

     
         try {
           const response = await editCategory(id, newData, newFile);
           toast.success("Category updated successfully");
           setSave(false);
           setCategory({});
           setNewFile("");
           setPreview("");
           setPreviousFile("");
           navigate('/listCategory');
     
         } catch (error) {
           toast.error("Error while updating food");
           setSave(false);
           console.log("Error while updating food", error);
         }
    }

  return (
    <div className="">
          <div className="row">
              <div className="">
                  <form className="contact-form" onSubmit={onSubmitHandler}>
                      <h2 className="text-center mb-4">Edit Categroy</h2>
                      
                      <div className="form-group">
                          <label htmlFor="categoryName" className="form-label">Category Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="categoryName" 
                            required 
                            name='categoryName' 
                            onChange={onChangeHandler}
                            value={category.categoryName}
                            placeholder='Chiken Biryani'
                          />
                      </div>
    
                      <div className="form-group">
                          <label htmlFor="previousPhotos" className="form-label">Previous photo</label>
                           <div className="container mt-3">
                               <div className="row g-3">
                                  <div className="col-4" >
                                    {
                                        previousfile && (
                                            <div
                                                className="position-relative border rounded"
                                                style={{ width: "100px", height: "100px", margin: "0 auto" }}
                                            >
                                            <img
                                                src={previousfile}
                                                alt={`previous image`}
                                                className="img-fluid rounded"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                            <button
                                                onClick={removePreviousFile}
                                                className="btn btn-danger btn-sm position-absolute"
                                                style={{
                                                top: "5px",
                                                right: "5px",
                                                borderRadius: "50%",
                                                width: "24px",
                                                height: "24px",
                                                padding: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                lineHeight: 1,
                                                }}
                                            >
                                                ×
                                            </button>
                                            </div>
                                        )
                                    }
                                </div>
                              </div>
                            </div>
                      </div>
    
                      <div className="form-group">
                          <label className="form-label">Upload New Files</label>
                           <div
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                              id='filesUpload'
                              htmlFor="files"
                              onClick={()=>{document.getElementById("files").click()}}
                              style={{maxHeight:"190px", width:"100%"}}
                            >
                              <img src={assets.upload} alt="" width={60} height={60} />
                              <p>Upload a file</p>
                              <p>Drag and Drop files here</p>
                              <input 
                                type="file" 
                                multiple
                                hidden
                                id='files'
                                onChange={handleFileChange}
                              />
                           </div>
                      </div>
                    
                    {
                        newFile && (
                            <div style={{ marginTop: "10px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
                                <div
                                    style={{
                                    position: "relative",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    width: "100px",
                                    height: "100px",
                                    }}
                                >
                                    <img
                                    src={preview}
                                    alt={`new image`}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <button
                                    onClick={removeFile}
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "24px",
                                        height: "24px",
                                        cursor: "pointer",
                                    }}
                                    >
                                    ×
                                    </button>
                                </div>
                            </div>

                        )
                    }
                    
                      
                      
                      <div style={{textAlign:"center", marginTop:"20px"}}>
                          <button 
                            type="submit" 
                            className="btn btn-primary btn-lg w-75" 
                          >
                            {save ? "Saving..." : "Save"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
        </div>
  )
}

export default EditCategory

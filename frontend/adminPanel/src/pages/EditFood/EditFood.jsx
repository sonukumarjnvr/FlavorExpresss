import React,{use, useState,useEffect} from 'react'
import { assets } from '../../assets/assets'
import { getFood } from '../../service/AddFoodService';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { editFood } from '../../service/AddFoodService';
import { useNavigate } from 'react-router-dom';


const EditFood = () => {
  const {id} = useParams();
  const [data, setData] = useState({});
  const [newFiles, setNewFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [save, setSave] = useState(false);
  const [previousfiles, setPreviousFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchFood = async()=>{
      try {
        const response = await getFood(id);
        console.log("food details", response);
        if(response.status == 200){
            setData(response.data);
            setPreviousFiles(response.data.imageUrl);
        }
        else{
          toast.error("Error while fetching food details");
        }
        
      } catch (error) {
        toast.error("Error while fetching food details");
      }
    }
    
    fetchFood();
  },[id]);

  const onChangeHandler = async (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setData({...data, [name]:value});
  }

const removePreviousFile = (index)=>{
  const deleteConfirmMessage = window.confirm("Are you sure to delete this image?");
  if(deleteConfirmMessage === false){
    return;
  } 
  const updatedPreviousFiles = previousfiles.filter((_, i) => i !== index);
  setPreviousFiles(updatedPreviousFiles);
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
    const newFiles = Array.from(event.target.files);
    updateFiles(newFiles);
}

const removeFile = (index)=>{
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
}

const updateFiles = (newFiles)=>{
    setNewFiles((prevFiles)=> [...prevFiles, ...newFiles]); 
    const newPreview = newFiles.map((file)=>URL.createObjectURL(file));
    setPreview((prevPreview)=> [...prevPreview, ...newPreview]);
}

 const onSubmitHandler = async(e)=>{
    e.preventDefault();
    setSave(true);
    
    if(previousfiles.length === 0 && newFiles.length === 0 ){
      toast.error("Please select a file");
      setSave(false);
      return;
    }

    console.log("previous files", previousfiles);
    console.log("new files", newFiles);

    try {
      const response = await editFood(id, data, newFiles, previousfiles);
      toast.success("Food updated successfully");
      setSave(false);
      setData([]);
      setNewFiles([]);
      setPreview([]);
      setPreviousFiles([]);
      navigate('/listFood');

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
                  <h2 className="text-center mb-4">Edit Food</h2>
                  
                  <div className="form-group">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        required 
                        name='name' 
                        onChange={onChangeHandler}
                        value={data.name}
                        placeholder='Chiken Biryani'
                      />
                  </div>
                  <div className="form-group">
                      <label htmlFor="Description" className="form-label">Description</label>
                      <textarea 
                        className="form-control" 
                        id="description" 
                        rows="3" 
                        required name='description'  
                        onChange={onChangeHandler} 
                        value={data.description}
                        placeholder='Write Content Here...'
                      >
                      </textarea>
                  </div>
                  <div className="form-group">
                      <label htmlFor='category' className="form-label">Category</label>
                      <select 
                        name="category" 
                        id="category" 
                        className='form-control' 
                        required 
                        onChange={onChangeHandler} 
                        value={data.category}
                      >
                         <option value="Burger">Burger</option>
                         <option value="Pizza">Pizza</option>
                         <option value="Ice-Cream">Ice-Cream</option>
                         <option value="Rolls">Rolls</option>
                         <option value="Momos">Momos</option>
                         <option value="Cakes">Cakes</option>
                         <option value="Pasta">Pasta</option>
                         <option value="Biryani">Biryani</option>
                      </select>

                  </div>
                  
                  <div className="form-group">
                      <label htmlFor='diet' className="form-label">dietary</label>
                      <select 
                        name="diet" 
                        id="diet" 
                        className='form-control' 
                        required 
                        onChange={onChangeHandler} 
                        value={data.diet}
                      >
                         <option value="Veg">Veg</option>
                         <option value="Non-Veg">Non-Veg</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label htmlFor="previousPhotos" className="form-label">Previous photos</label>
                       <div className="container mt-3">
                          <div className="row g-3">
                            {previousfiles.map((src, index) => (
                              <div className="col-4" key={index}>
                                <div
                                  className="position-relative border rounded"
                                  style={{ width: "100px", height: "100px", margin: "0 auto" }}
                                >
                                  <img
                                    src={src}
                                    alt={`preview ${index}`}
                                    className="img-fluid rounded"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                  <button
                                    onClick={() => removePreviousFile(index)}
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
                              </div>
                            ))}
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

                  <div style={{ marginTop: "10px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    {preview.map((src, index) => (
                      <div
                        key={index}
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
                          src={src}
                          alt={`preview ${index}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <button
                          onClick={() => removeFile(index)}
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
                    ))}
                  </div>
                  
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

export default EditFood

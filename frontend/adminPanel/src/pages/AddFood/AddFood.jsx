import React,{useEffect, useState} from 'react'
import './AddFood.css'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify';
import { addFood } from '../../service/AddFoodService';
import { getCategories } from '../../service/customizationService';


const AddFood = () => {
  const [files, setFiles] = useState([]);
  const [preview , setPreview] = useState([]);
  const [data, setData] = useState({
    name:"",
    description:"",
    category:"Pizza",
    diet: "Veg"
  });
  const [save, setSave] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  const onChangeHandler = (event)=>{
      const name = event.target.name;
      const value = event.target.value;
      setData((preData)=>({...preData, [name]:value}));
  }


  const handleFileChange = (event)=>{
      const newFiles = Array.from(event.target.files);
      updateFiles(newFiles);
  }

  const handleDragOver = (event)=>{
    event.preventDefault();
  }

  const handleDrop = (event)=>{
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    updateFiles(newFiles);
  }

  const updateFiles = (newFiles)=>{
    setFiles((prev)=>[...prev, ...newFiles]);
    const newPreview = newFiles.map((file)=> URL.createObjectURL(file));
    setPreview((prev)=>[...prev, ...newPreview]);
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async(event)=>{
    event.preventDefault();
    console.log("hello : " + data.diet);
    if(files.length === 0){
      toast.error("please select a file");
      return;
    }
    setSave(true);
    try {
       
       await addFood(data, files);
       
        toast.success("Food added successfully");
        setData({
          name:"",
          description:"",
          category:"Pizza"
        });
        setFiles([]);
        setPreview([]);
        setSave(false);
       
    } catch (error) {
      console.log("Error", error);
      setSave(false);
        toast.error("Error while adding food");
    }
  }

  return (
    <div className="">
      <div className="row">
          <div className="">
              <form className="contact-form" onSubmit={onSubmitHandler}>
                  <h2 className="text-center mb-4">Add Food</h2>
                  
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
                         <option value="Burger">Select Category</option>
                         {
                            categories && categories.map((cat)=>(
                                <option key={cat.id} value={cat.categoryName}>{cat.categoryName}</option>
                            ))
                         }
                         
                        
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
                      <label className="form-label">Upload Files</label>
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

                  <div style={{ marginTop: "20px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
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

export default AddFood

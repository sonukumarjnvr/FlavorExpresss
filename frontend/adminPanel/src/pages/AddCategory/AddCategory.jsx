import React,{use, useState} from 'react'
import "../AddCategory/AddCategory.css"
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify';
import { addCategory } from '../../service/CategoryService';


const AddCategory = () => {
  const [file, setFile] = useState();
  const [preview , setPreview] = useState("");
  const [data, setData] = useState({
    categoryName:""
  });
  const [save, setSave] = useState(false);

  const onChangeHandler = (event)=>{
      const value = event.target.value;
      setData({"categoryName" : value});
  }


  const handleFileChange = (event)=>{
      const newFile = event.target.files[0];
      updateFiles(newFile);
  }

  const handleDragOver = (event)=>{
    event.preventDefault();
  }

  const handleDrop = (event)=>{
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    updateFiles(newFile);
  }

  const updateFiles = (newFile)=>{
    setFile(newFile);
    const newPreview =  URL.createObjectURL(newFile)
    setPreview(newPreview);
  }

  const removeFile = () => {
    setFile();
    setPreview();
  };

  const onSubmitHandler = async(event)=>{
    event.preventDefault();
    console.log("hello : " + data.categoryName);
    if(!file){
      toast.error("Please select a file");
      return;
    }
    setSave(true);
    try {
       
       //await addFood(data, files);
       const response = addCategory(data, file);
        toast.success("Category Added successfully");
        setData({
          categoryName:""
        });
        setFile();
        setPreview();
        setSave(false);
       
    } catch (error) {
      console.log("Error", error);
      setSave(false);
        toast.error("Error while adding category");
    }
  }

  return (
    <div className="">
      <div className="row">
          <div className="">
              <form className="contact-form" onSubmit={onSubmitHandler}>
                  <h2 className="text-center mb-4">Add Category</h2>
                  
                  <div className="form-group">
                      <label htmlFor="categoryName" className="form-label">Category Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="categoryName" 
                        required 
                        name='categoryName' 
                        onChange={onChangeHandler} 
                        value={data.categoryName}
                        placeholder='Chiken Biryani'
                      />
                  </div>

                  <div className="form-group">
                      <label className="form-label">Upload Files</label>
                       <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                           id='filesUpload'
                           htmlFor="file"
                           onClick={()=>{document.getElementById("file").click()}}
                           style={{maxHeight:"190px", width:"100%"}}
                        >
                          <img src={assets.upload} alt="" width={60} height={60} />
                          <p>Upload a file</p>
                          <p>Drag and Drop files here</p>
                          <input 
                            type="file" 
                            hidden
                            id='file'
                            onChange={handleFileChange}
                            accept='.jpg,.jpeg,.png'
                          />
                       </div>
                  </div>

                  <div style={{ marginTop: "20px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    {
                        preview ? (
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
                                alt={`preview`}
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

                        ) : (
                            <></>
                        )
                    }
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

export default AddCategory

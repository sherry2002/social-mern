import './editPost.css';
import { PermMedia, Cancel } from "@material-ui/icons";
import { AuthContext } from "../../redux/AuthContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";

function EditPost({setEditPost,editPost,edit}) {
    const { user, isFetching } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [editDesc, setEditDesc] = useState(edit?.desc);
    const [editfile, setEditFile] = useState(null);
    // const image = URL.createObjectURL(editfile);

    
    useEffect(() => {
      setEditDesc(edit?.desc)
     
    }, [edit])

  const handleEdit = async(e)=>{
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: editDesc,
    };
    if (editfile) {
      const data = new FormData();
      const fileName = Date.now() + editfile.name;
      data.append("name", fileName);
      data.append("file", editfile);
      newPost.image = fileName;
      console.log(newPost);
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      await axios.put(`/posts/${edit._id}`, newPost);
     
      window.location.reload();
    } catch (err) {}
    setEditPost(!editPost)

  }
  

 
 
    return (
    
 
        <div className="editPost">
          <img
            className="EditProfileImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
         
          <input
            placeholder={"What's in your mind " + user.username + "?"}
            className="EditInput"
            value={editDesc}
            onChange={event=>setEditDesc(event.target.value)}
          />
          {editfile && (
          <div className="EditImgContainer">
            <img className="EditImg" src={ URL.createObjectURL(editfile)} alt="" />
            <Cancel className="EditCancelImg" onClick={() => setEditFile(null)} />
          </div>
        )}
    
            <form className="EditBottom" onSubmit={handleEdit}>
          <div className="EditOptions">
            <label htmlFor="editfile" className="EditOption">
              <PermMedia htmlColor="tomato" className="EditIcon" />
              <span className="EditOptionText">Photo or Video</span>

              <input
                style={{ display: "none" }}
                type="file"
                id="editfile"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setEditFile(e.target.files[0])}
              />
            </label>
          </div>
          <div className="buttons">
          <button
            className="cancelButton"
            onClick={()=>setEditPost(!editPost)}
         >
             Cancel
          </button>
          <button
            className="EditButton"
            type="submit"
            disabled={ !editDesc && !editfile }
          >
            {isFetching ? (
              <CircularProgress color="inherit" size="24px" />
            ) : (
              "Update"
            )}
          </button>
          </div>
        </form>
        </div>
    )
}

export default EditPost;

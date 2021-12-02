import './change.css';
import { AuthContext } from "../../redux/AuthContext";
import { PermMedia, Cancel } from "@material-ui/icons";
import axios from "axios";
import { useContext, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import CameraAltIcon from '@material-ui/icons/CameraAlt';


function ChangeProfile({ togglecover, setTogglecover }) {
  const { user } = useContext(AuthContext);
  const [editcover, seteditCover] = useState(null)

  const changeCover = async (e) => {
    e.preventDefault();
    const newCover = {
      userId: user._id,
    };
    if (editcover) {
      const data = new FormData();
      const fileName = Date.now() + editcover.name;
      data.append("name", fileName);
      data.append("file", editcover);
      newCover.coverPicture = fileName;
      console.log(newCover);
      try {
        await axios.post("/upload", data);
      } catch (err) { }
    }
    try {
      await axios.put(`/users/${user._id}`, newCover);
      window.location.reload();
    } catch (err) { }
    setTogglecover(!togglecover)

  }

  return (
    <>

      <div className="changecover">
        <div className="blurcover"></div>

        <OutsideClickHandler onOutsideClick={() => setTogglecover(false)}>

          <div className="coveredit">
            <form onSubmit={changeCover}>
              <CameraAltIcon className="camera" />
              <label htmlFor="editcover" className="Editcover">
                <PermMedia htmlColor="tomato" className="coverphoto" />
                <span className="coverText">Photo or Video</span>

                <input
                  style={{ display: "none" }}
                  type="file"
                  id="editcover"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => seteditCover(e.target.files[0])}
                />
              </label>
              {editcover && (
                <div className="EditImgContainer">
                  <img className="EditImg" src={URL.createObjectURL(editcover)} alt="" />
                  <Cancel className="EditCancelImg" onClick={() => seteditCover(null)} />
                </div>
              )}
              <div className="buttons">
                <button
                  className="cancelButton"
                  onClick={() => setTogglecover(!togglecover)}
                >
                  Cancel
                </button>
                <button
                  className="EditButton"
                  type="submit"
                >
                  Update Cover
                </button>
              </div>
            </form>
          </div>
        </OutsideClickHandler>


      </div>

    </>
  )
}

export default ChangeProfile

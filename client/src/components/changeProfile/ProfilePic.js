import './profile.css';
import { AuthContext } from "../../redux/AuthContext";
import { PermMedia, Cancel } from "@material-ui/icons";
import axios from "axios";
import { useContext, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import CameraAltIcon from '@material-ui/icons/CameraAlt';

function ProfilePic({ togglePic, setTogglePic }) {
    const [editPic, seteditPic] = useState(null)
    const { user } = useContext(AuthContext);

    const changePic = async (e) => {
        e.preventDefault();
        const newPic = {
            userId: user._id,
        };
        if (editPic) {
            const data = new FormData();
            const fileName = Date.now() + editPic.name;
            data.append("name", fileName);
            data.append("file", editPic);
            newPic.profilePicture = fileName;
            console.log(newPic);
            try {
                await axios.post("/upload", data);
            } catch (err) { }
        }
        try {
            await axios.put(`/users/${user._id}`, newPic);
            window.location.reload();
        } catch (err) { }
        setTogglePic(!togglePic)

    }

    return (
        <>
            <OutsideClickHandler onOutsideClick={() => setTogglePic(false)}>

                <div className="coveredit">
                    <form onSubmit={changePic}>
                        <CameraAltIcon className="camera" />
                        <label htmlFor="editPic" className="Editcover">
                            <PermMedia htmlColor="tomato" className="coverphoto" />
                            <span className="coverText">Photo or Video</span>

                            <input
                                style={{ display: "none" }}
                                type="file"
                                id="editPic"
                                accept=".png,.jpeg,.jpg"
                                onChange={(e) => seteditPic(e.target.files[0])}
                            />
                        </label>
                        {editPic && (
                            <div className="EditImgContainer">
                                <img className="EditImg" src={URL.createObjectURL(editPic)} alt="" />
                                <Cancel className="EditCancelImg" onClick={() => seteditPic(null)} />
                            </div>
                        )}
                        <div className="buttons">
                            <button
                                className="cancelButton"
                                onClick={() => setTogglePic(!togglePic)}
                            >
                                Cancel
                            </button>
                            <button
                                className="EditButton"
                                type="submit"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </OutsideClickHandler>

        </>
    )
}

export default ProfilePic

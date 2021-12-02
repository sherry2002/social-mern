import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
// import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import ChangeCover from "../../components/profilecover/ChangeCover";
import ProfilePic from "../../components/changeProfile/ProfilePic";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;
  const [togglecover, setTogglecover] = useState(false);
  const [togglePic, setTogglePic] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);


  const handleCover = (e) => {
    e.preventDefault();
    setTogglecover(!togglecover);
  };
  const handleProfile = (e) => {
    e.preventDefault();
    setTogglePic(!togglePic);
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profile">
              <form style={{ width: "100%", height: "auto" }}>
                <label className="profileCover">
                  <img
                    htmlFor="cover"
                    className="profileCoverImg"
                    src={
                      user.coverPicture
                        ? PF + user.coverPicture
                        : PF + "person/noCover.png"
                    }
                    alt=""
                  />
                  <span
                    className="coverEdit"
                    htmlFor="cover"
                    onClick={handleCover}
                  >
                    Edit Cover Photo
                  </span>
                </label>
              </form>
              {togglecover && (
                <ChangeCover
                  togglecover={togglecover}
                  setTogglecover={setTogglecover}
                />
              )}
              <label className="profilePic">
                <img
                  htmlFor="Picfile"
                  className="profileUserImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                />
                <span
                  className="profileEdit"
                  htmlFor="Picfile"
                  onClick={handleProfile}
                >
                  Edit Profile Photo
                </span>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="Picfile"
                  accept=".png,.jpeg,.jpg"
                />
              </label>
              {togglePic && (
                <ProfilePic
                  togglePic={togglePic}
                  setTogglePic={setTogglePic}
                />
              )}
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            {user !== "undefined" && <Rightbar user={user} />}
          </div>
        </div>
      </div>
    </>
  );
}

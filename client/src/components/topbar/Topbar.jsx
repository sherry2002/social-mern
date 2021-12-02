import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import { useHistory } from "react-router-dom";
import { logoutCall } from "../../api";
import { AuthContext } from "../../redux/AuthContext";
import { useContext, useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import OutsideClickHandler from "react-outside-click-handler";
import SettingsIcon from '@material-ui/icons/Settings';

export default function Topbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [toggle, setToggle] = useState(false);
  const [search,setSearch]= useState()
  const { user, isFetching, dispatch } = useContext(AuthContext);
  const history = useHistory();
 


  const handleLogout = (e) => {
    e.preventDefault();
    logoutCall({ user: user }, dispatch);
    history.push("/login");
  };
  const handleSearch = async(e)=>{
    e.preventDefault();
    history.push(`/profile/${search}`);
    setSearch('')
  }
 

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">LamdaBook</span>
        </Link>
      </div>
      <div className="topbarCenter">
        
          <form className="searchbar" onSubmit={handleSearch}>
          <Search className="searchIcon" type='submit' />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
          </form>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <span className="topbarLink">Homepage</span>
          </Link>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={`/profile/${user.username}`}
          >
            <span className="topbarLink">Timeline</span>
          </Link>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            {/* <span className="topbarIconBadge">0</span> */}
          </div>
          <Link to="/messenger" className="topbarIconItem">
            <Chat />
            {/* <span className="topbarIconBadge">0</span> */}
          </Link>
          <div className="topbarIconItem">
            <Notifications />
            {/* <span className="topbarIconBadge">0</span> */}
          </div>
        </div>
        <OutsideClickHandler onOutsideClick={()=>setToggle(false)}>
        <ArrowDropDownIcon
          onClick={() => setToggle(!toggle)}
          className="downArrow"
        />
        {toggle && (
          <div className="toggle">
            <Link to={`/profile/${user.username}`} className="toggleProfile">
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
                className="topbarImg"
              />
              <span className="topbarProfile">
                <span className="topbarUsername">{user.username}</span>
                <span className="topbarText">See your profile</span>
              </span>
            </Link>
            <Link to="/settings" style={{textDecoration:"none"}}>
            <div className="logoutBtn">
               <SettingsIcon className="logoutIcon"/>
                Settings
              </div>
              </Link>
            <div className="logoutBtn" onClick={handleLogout}>
              <ExitToAppRoundedIcon className="logoutIcon" />
              {isFetching ? <CircularProgress size="20px" /> : "Log Out"}
            </div>
          </div>
        )}
        </OutsideClickHandler>
      </div>
    </div>
  );
}

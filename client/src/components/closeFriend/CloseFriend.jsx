import "./closeFriend.css";
import {Link} from 'react-router-dom'

export default function CloseFriend({user_id,friend}) {
  const PF= process.env.REACT_APP_PUBLIC_FOLDER;

  return (

    <li className="sidebarFriend">
        <Link
        className="sidebarFriendLink"
       key={user_id}
        to={"/profile/" + friend.username}
        style={{ textDecoration: "none" }}
      >
      
      <img className="sidebarFriendImg" src={
              friend.profilePicture
                ? PF + friend.profilePicture
                : PF + "person/noAvatar.png"
            } alt="" />
      <span className="sidebarFriendName">{friend.username}</span>
        
      </Link>
    </li>
  );
}

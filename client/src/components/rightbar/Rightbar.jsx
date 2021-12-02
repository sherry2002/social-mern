/* eslint-disable no-unreachable */
import "./rightbar.css";
// import { Users } from "../../dummyData";
// import Online from "../online/Online";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../redux/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import { io } from "socket.io-client";
import Online from '../../components/onlineuser/Online'
import SmallChat from "../smallChat/smallChat";
import CloseIcon from "@material-ui/icons/Close";

export default function Rightbar({ user }) {
  let history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState();
  //const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  // const [message, setMessage] = useState([]);
  // const [newMessages, setNewMessages] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [messengerOpen, setMessengerOpen] = useState(false);
  // const scrollRef = useRef();
  const socket = useRef();
 
  useEffect(() => {
    
    const getFriends = async () => {
      try {
        const friendList = await axios.get(`/users/friends/${currentUser._id}`);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    const followed = async () => {
      const res = await currentUser.followings.includes(user?._id);
      setFollowed(res);
    };
    
    return ()=>{

      getFriends();
      
       followed();
    };
  }, [user, currentUser.followings]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {}
  };

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // useEffect(() => {
  //   arrivalMessage &&
  //     currentChat?.members.includes(arrivalMessage.sender) &&
  //     setArrivalMessage((prev) => [...prev, arrivalMessage]);
  // }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);

    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [currentUser]);
  const Convouser = async () => {
    // if (conversations.members)
    try {
      await axios.post("http://localhost:8000/api/conversations/", {
        senderId: currentUser._id,
        recieverId: user._id,
      });
    } catch (err) {
      console.log(err);
    }
    history.push("/messenger");
  };

  // const handleChat = async (e) => {
  //   e.preventDefault();
  //   const message = {
  //     sender: currentUser._id,
  //     text: newMessages,
  //     conversationId: currentChat._id,
  //   };
  //   const recieverId = currentChat.members.find(
  //     (member) => member !== currentUser._id
  //   );

  //   socket.current.emit("sendMessage", {
  //     senderId: currentUser._id,
  //     recieverId,
  //     text: newMessages,
  //   });

  //   try {
  //     const res = await axios.post("/messages", message);
  //     setMessage([...message, res.data]);
  //     setNewMessages("");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [message]);

  // useEffect(() => {
  //   const getConversation = async () => {
  //     try {
  //       const res = await axios.get("/conversations/" + currentUser._id);
  //       setConversations(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getConversation();
  // }, [currentUser._id]);

  // useEffect(() => {
  //   const getMessages = async () => {
  //     try {
  //       const res = await axios.get("/messages/" + currentChat?._id);
  //       setMessage(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getMessages();
  // }, [currentChat]);

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <div className="rightbarFriendList">
          <Online
           
            onlineUsers={onlineUsers}
            currentId={currentUser._id}
            setCurrentChat={setCurrentChat}
          />
        </div>
        {/* {currentChat ? (
          <>
            <div
              className={
                messengerOpen ? "smallMessages" : "smallMessages close"
              }
            >
              <div className="closeMessage">
                <CloseIcon
                  className="closeIcon"
                  onClick={(e) => setMessengerOpen(!messengerOpen)}
                />
              </div>
              <div className="messagesHome">
                {message.map((m) => {
                  return (
                    <div key={m._id} ref={scrollRef}>
                      <SmallChat
                        recieve={m}
                        send={m.sender === currentUser._id}
                      />
                    </div>
                  );
                })}
              </div>

              <form className="smallchatbottom" onSubmit={handleChat}>
           
                <textarea
             
                  className="smallchatInput"
                  placeholder="write your message"
                  onChange={(e) => setNewMessages(e.target.value)}
                  value={newMessages}
                ></textarea>
                <button
                  type="submit"
                  className="smallsendChat"
                  disabled={!newMessages}
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <span className="noConversation"></span>
        )} */}
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button
            className={
              followed
                ? "rightbarFollowButton followed"
                : "rightbarFollowButton"
            }
            onClick={handleClick}
          >
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}

        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 2
                ? "In a relationship"
                : user.relationship === 3
                ? "It's Complicated"
                : user.relationship === 4
                ? "Married"
                : ""}
            </span>
          </div>
          {user.username !== currentUser.username && (
            <button className="rightbarFollowButton" onClick={Convouser}>
              Conversation with user
            </button>
          )}
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend, user_id) => (
            <Link
              key={user_id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none", margin: "5px" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

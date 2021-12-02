/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios'
import { useState, useEffect } from 'react'
import './chatOnline.css'

function chatOnline({ onlineUsers, currentId, setCurrentChat }) {
    const [friends, setFriends] = useState([])
    const [onlineFriends, setOnlineFriends] = useState([])

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/" + currentId)
            setFriends(res.data)
        }
        getFriends()

    }, [currentId])
    

    useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)))
    }, [friends, onlineUsers]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const handleClick = async (user) => {
        try {
          const res = await axios.get(
            `/conversations/find/${currentId}/${user._id}`
          );
          setCurrentChat(res.data);
        } catch (err) {
          console.log(err);
        }
      };

    return (
        <div className="onlineChat">
            {
                onlineFriends?.map((o) => (                   
                        <div key={onlineUsers} className="onlineFriend" onClick={() => handleClick(o)}>
                            <div className="onlineImg">
                                <img className="chatOnlineImg" src={o?.profilePIcture ? PF + o.profilePIcture : PF + "person/noAvatar.png"} alt="" />

                                <div className="onlineBadge"></div>
                            </div>
                            <span className="onlineName">{o?.username}</span>
                        </div>
                   
                ))
            }

        </div>
    )
}

export default chatOnline

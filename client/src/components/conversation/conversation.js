/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import './conversation.css';
import axios from 'axios';

function conversation({ conversation, currentUser }) {
    const [user, setUser] = useState(null);


    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id)

        const getUser = async () => {
            try {
                const res = await axios("/users?userId=" + friendId)
                setUser(res.data)

            } catch (err) {
                console.log(err)
            }
        }
        getUser()
    }, [currentUser, conversation])
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    return (
        <div className="conversation">
            <img src={user?.profilePicture ? PF + user?.profilePicture : PF + '/person/noAvatar.png'}
                className="convoImg" alt="" />
            <span className="convoName">
                {user?.username}
            </span>
        </div>
    )
}

export default conversation

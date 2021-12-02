/* eslint-disable react-hooks/rules-of-hooks */
import './smallChat.css'
import { useContext } from 'react';
import { AuthContext } from '../../redux/AuthContext';
import { format } from 'timeago.js'

function smallChat({ recieve, send }) {
    const { user } = useContext(AuthContext);
    console.log(send)

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <div className={send ? 'message own' : 'message'}>
            <div className="smallMessageTop">
                <img className="smallMessageImg" src={user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"} alt="" />
                <p className="smallMessageUser">{recieve.text}</p>
            </div>
            <div className="smallmessageBottom">
                {format(recieve.createdAt)}
            </div>
        </div>
    )

}

export default smallChat




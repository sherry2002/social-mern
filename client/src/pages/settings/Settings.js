import './settings.css'
import React, { useContext, useEffect, useState } from 'react';
import Topbar from '../../components/topbar/Topbar'
import { AuthContext } from '../../redux/AuthContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import OutsideClickHandler from "react-outside-click-handler";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { logoutCall } from "../../api";

function Settings() {
    let history = useHistory()
    const [toggle, setToggle] = useState(false)
    const { user, dispatch } = useContext(AuthContext);
    const [username, setUsername] = useState('')
    const [pass, setPass] = useState('')
    const [passAgain, setPassAgain] = useState('')
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [from, setFrom] = useState('');
    const [relationship, setRelationship] = useState('');


    const deleteAcc = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "userId": user._id,
            });

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(`http://localhost:8000/api/users/${user._id}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
            logoutCall({ user: user }, dispatch);
            history.push("/login");
        } catch (err) {
            console.log(err)
        }
    }
    const handleUsername = async (e) => {
        e.preventDefault();
        try {

            await axios.put(`/users/${user._id}`, {
                userId: user._id,
                username: username
            });
        } catch (err) {
            console.log(err)
        }
        setUsername("")
        logoutCall({ user: user }, dispatch);
        history.push("/login");

    }
    const handlePassword = async (e) => {
        e.preventDefault();
        if (passAgain !== pass) {
            console.log("Passwords don't match!");

        } else {

            try {

                await axios.put(`/users/${user._id}`, {
                    userId: user._id,
                    password: pass
                });

                logoutCall({ user: user }, dispatch);
                history.push("/login");
            } catch (err) {
                console.log(err)
            }
        }
        setPass("")
        setPassAgain("")

    }
    const handleUserInfo = async (e) => {
        e.preventDefault();

        try {

            await axios.put(`/users/${user._id}`, {
                userId: user._id,
                desc: description,
                city: city,
                from: from,
                relationship: relationship
            });
        } catch (err) {
            console.log(err)
        }
        setDescription("");
        setCity("");
        setFrom("");
        setRelationship('');
         history.push("/");

    }
    return (
        <>
            <Topbar />
            <div className="settings">
                <div className="settingTop">
                    <div className="changes">
                        <h3>Change Username</h3>
                        <form className="form" onSubmit={handleUsername}>
                            <input type="text" placeholder="Enter New username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                            <button type="submit">Edit username</button>
                        </form>
                    </div>
                    <div className="changes" onSubmit={handlePassword}>
                        <h3>Change Password</h3>
                        <form className="form">
                            <input type="password" required minLength="6" placeholder="Enter New Password" value={pass} onChange={(e) => setPass(e.target.value)} />
                            <input type="password" required minLength="6" value={passAgain} onChange={(e) => setPassAgain(e.target.value)} placeholder="Confirm Password" />
                            <button type="submit">Edit password</button>
                        </form>
                    </div>
                    <div className="changes">
                        <h3>Change User Info</h3>
                        <form className="form" onSubmit={handleUserInfo}>
                        <textarea
                  placeholder="write your profile description"
                  value={description} onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                            <input type="text" placeholder="present city" value={city} onChange={(e) => setCity(e.target.value)} />
                            <input type="text" required placeholder="from" value={from} onChange={(e) => setFrom(e.target.value)} />
                            <div className="radiobutton">
                                <input type="radio" placeholder="relationship" name={relationship} value="1" onChange={(e) => setRelationship(e.target.value)} />
                                <label>Single</label>
                            </div>
                            <div className="radiobutton">
                                <input type="radio" placeholder="relationship" name={relationship} value="2" onChange={(e) => setRelationship(e.target.value)} />
                                <label>In a relationship</label>
                            </div>
                            <div className="radiobutton">
                                <input type="radio" placeholder="relationship" name={relationship} value="3" onChange={(e) => setRelationship(e.target.value)} />
                                <label>It's Complicated</label>
                            </div>
                            <div className="radiobutton">
                                <input type="radio" placeholder="relationship" name={relationship} value="4" onChange={(e) => setRelationship(e.target.value)} />
                                <label>Married</label>
                            </div>
                            <button type="submit">Edit userInfo</button>
                        </form>
                    </div>


                </div>
                <div className="deleteuser">
                    <h2>Danger Zone</h2>
                    <button onClick={() => setToggle(!toggle)}>Delete Account</button>
                </div>
            </div>
            {
                toggle &&
                <div className="deleteAcc">
                    <div className="blur"></div>
                    <OutsideClickHandler onOutsideClick={() => setToggle(false)}>
                        <div className="account">
                            <DeleteForeverIcon className="deleteicon" />
                            <p>Are you sure you want to delete this account {user.username}?</p>
                            <button onClick={() => setToggle(!toggle)}>Cancel</button>
                            <button onClick={deleteAcc}>Delete</button>
                        </div>
                    </OutsideClickHandler>
                </div>
            }
        </>
    )
}

export default Settings

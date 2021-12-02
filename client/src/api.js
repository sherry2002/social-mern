import axios from "axios";
// import AuthContext from './redux/AuthContext';
// import { useContext } from "react";



export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post('/auth/login', userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
    alert("wrong email or password")
  }
}

export const logoutCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.get("/auth/logout", userCredential);
    dispatch({ type: "LOGOUT_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};



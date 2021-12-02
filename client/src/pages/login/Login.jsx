import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../api";
import { AuthContext } from "../../redux/AuthContext";
import {CircularProgress} from '@material-ui/core';
import {Link} from 'react-router-dom'

export default function Login() {
  const email = useRef();
  const password = useRef();
  const {  isFetching, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch,
      
    );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">LamdaBook</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on LamdaBook.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox1" onSubmit={handleClick}>
            <input
              type="email"
              required
              placeholder="Email"
              className="loginInput"
              ref={email}
            />
            <input
              type="password"
              placeholder="Password"
              className="loginInput"
              ref={password}
              required
              minLength="6"
            />
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? <CircularProgress color="inherit" size="24px"/>: "Log In" }
              </button>
            <span className="loginForgot">Forgot Password?</span>
            <Link className="loginLink" to="register">
            <button className="loginRegisterButton" disabled={isFetching}>
            {isFetching ? <CircularProgress color="inherit" size="24px"/>: "Create New Account" }
            </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

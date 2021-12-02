export const LoginStart = (userCredential) => ({
    type: "LOGIN_START",
  });
  
  export const LoginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user,
  });
  export const LogoutSuccess = (user) => ({
    type: "LOGOUT_SUCCESS",
    payload:user,
  });
  
  export const LoginFailure = (userCredential) => ({
    type: "LOGIN_FAILURE",
  });
  
  export const Follow = (userId) => ({
    type: "FOLLOW",
    payload: userId,
  });
  
  export const Unfollow = (userId) => ({
    type: "UNFOLLOW",
    payload: userId,
  });
  export const UserUpdate = (username) => ({
    type: "USER_UPDATE",
    payload: username,
  });
  
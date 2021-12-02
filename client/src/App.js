import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/messenger";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./redux/AuthContext";
import Error from './pages/Error/Error';
import Settings from "./pages/settings/Settings";

function App() {
  const { user } = useContext(AuthContext);
  
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
           { user ? <Home /> : <Login/> } 
          </Route>
          <Route path="/login">
            { user ? <Redirect to="/"/> : <Login /> } 
          </Route>
          <Route path="/register">
          { user ? <Redirect to="/"/> :  <Register /> }       
          </Route>
          <Route exact path="/messenger">
          { !user ? <Redirect to="/"/> :  <Messenger /> }       
          </Route>
          <Route exact path="/profile/:username">
          { user ? <Profile /> : <Login/> }    
          </Route>
          <Route exact path="/settings">
          { !user ? <Redirect to="/"/> :  <Settings /> }       
          </Route>
        
          <Route component={Error}/>
        </Switch>
      </Router>
    </>
  );
}

export default App;

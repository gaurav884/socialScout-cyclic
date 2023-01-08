import{ useEffect, useReducer, useContext } from "react";
import './App.css';
import { BrowserRouter as Router, Switch, Route, useHistory ,Redirect} from "react-router-dom"
import Home from "./components/home/Home.js"
import SignIn from "./components/signIn/SignIn"
import SignUp from "./components/signUp/SignUp"
import Profile from "./components/profile/Profile"
import OtherProfile from "./components/otherProfile/OtherProfile"
import ChangeProfilePic from "./components/Change/ChangeProfilePic"
import ChangeCoverPic from "./components/Change/ChangeCoverPic"
import Settings from "./components/settings/Settings"
import ForgotPass from "./components/forgotPassword/ForgotPass"
import ResetPassword from "./components/forgotPassword/ResetPassword"
import FourOFourError from "./components/Errors/FourOFourError"
import FIVEOO from "./components/Errors/FIVEOO"

import "./components/navbar/Navbar.css"
import "./components/signIn/SignIn.css"
import "./components/signUp/SignUp.css"
import "./components/profile/Profile.css"
import "./components/home/Home.css"
import "./components/create-post/CreatePost.css"
import "./components/home/PostModal.css"
import "./components/ImageCrop/index.css"
import "./components/settings/Settings.css"
import "./components/rightSideBar/RightSideBar.css"
import "./components/leftSideBar/LeftSideBar.css"
import "./components/forgotPassword/ForgotResetPass.css"

import "./components/ImageCrop/components/cropper/cropper.css"
import { reducer, initialState } from "./reducers/UserReducer"
import { UserContext } from "./contexts/UserContext"
import { useParams } from "react-router-dom"




function Routing() {
  const { userid } = useParams();
  const {resetToken} = useParams();
 
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
 
    if (user) {
      dispatch({ type: "USER", payload: user })

    }
   
    else {
      if((!history.location.pathname.startsWith("/forgot-password")) && (!history.location.pathname.startsWith("/reset-password")) ){
      history.push("/sign-in")}
    }
  }, [])

  return <div className="home-toggling-container">

    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/sign-in" exact component={SignIn} />
      <Route path="/sign-up" exact component={SignUp} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/change-cover-picture" component={ChangeCoverPic} />
      <Route path="/forgot-password" component={ForgotPass} />
      <Route path="/change-profile-picture" exact component={ChangeProfilePic} />
      <Route path="/:userid" exact component={OtherProfile} />
      <Route path="/reset-password/:resetToken" exact ><ResetPassword/> </Route>
      <Route path="/ERROR500/sadfijsoaidfjosidjfoi34234242423sdfsdf" component={FIVEOO} />
      <Route path="/ERROR404/aoisdfhaisohdfoashfoasidfhasoidfhoasifh" component={FourOFourError} />
      <Route path="*" render={() => <Redirect to='/ERROR404/aoisdfhaisohdfoashfoasidfhasoidfhoasifh' />} />


    </Switch>


  </div>
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <>
      <Router>

        <UserContext.Provider value={{ state, dispatch }}>
        <Routing />
        </UserContext.Provider>
      </Router>
    </>
  );
}

export default App;

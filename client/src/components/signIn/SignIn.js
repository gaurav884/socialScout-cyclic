import React, { useState,useContext } from 'react'
import {Link} from "react-router-dom"
import { useHistory } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"
import { HiOutlineMail } from "react-icons/hi"
import { RiLockPasswordFill } from "react-icons/ri"

const SignIn = () => {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [invalidLogin , setInvalidLogin] = useState(false)

    function handler() {
        fetch("/auth/sign-in", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(response => {

            response.json().then(data => {
                if (data.error) {
                    console.log(data.error);
                    setInvalidLogin(true);
                    setEmail("")
                    setPassword("")
                }
                else {
                    
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({ type: "USER", payload: data.user })

                    history.push("/")
                }
            })
        })

    }
    if(state){
        history.push("/")
    }
  

    return (
        <>
        <div className="auth-page">
            <div className="auth-page-container">
                <div className="auth-page-image-container">
                    <img src="./auth.jpg" />
                </div>
                <div className="sign-in-container">
                    <div className="sign-in-heading">
                        <p className="sign-in-heading-brand">Login to SS</p>
                        <p className="sign-in-heading-signin">Welcome to the SS ! <br /> Login with the credentials used during registration</p>
                    </div>

                    <div className="sign-in-form">
                        <div className="sign-in-email-container">
                            <span><HiOutlineMail /></span>
                            <div>
                                <p>Email </p>
                                <input type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="sign-in-email-input" />
                            </div>

                        </div>

                        <div className="sign-in-passoword-container">
                            <span><RiLockPasswordFill /></span>
                            <div>
                                <p>Password</p>
                                <input type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="sign-in-passoword-input" />
                            </div>

                        </div>
                        <div className="remember-me-forgot-container">
                           <label><Link to="/forgot-password">forgot password ?</Link></label>
                        </div>
                         {invalidLogin ? <p className="invalid-login">Your Username and Password don't match !</p>:null}
                        <button
                            onClick={handler}
                            className="sign-in-button">Sign In</button>
                        
                        <p className="new-account-link">Don"t have an account? <Link to="/sign-up">Register</Link></p>

                    </div>

                </div>
            </div>
            </div>
        </>
    )
}

export default SignIn

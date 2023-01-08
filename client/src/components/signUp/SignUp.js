import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { Link } from "react-router-dom"
import { HiOutlineMail } from "react-icons/hi"
import { RiLockPasswordFill } from "react-icons/ri"
import { CgNametag } from "react-icons/cg"


const SignUp = () => {
    const history = useHistory();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const [isDupMail, setIsDupMail] = useState(false)
    const [passwordOk, setPassowrdOk] = useState(true)


    const [isNameTouched, setIsNameTouched] = useState(false);
    const isNameValid = name.trim() !== ""
    const isNameInvalid = !isNameValid && isNameTouched

    const [isEmailTouched, setIsEmailTouched] = useState(false);
    const isEmailValid = email.trim() !== "" && emailChecker()
    const isEmailInvalid = !isEmailValid && isEmailTouched

    const [isPasswordTouched, setIsPasswordTouched] = useState(false);
    const isPasswordValid = password.trim() !== "" && passwordChecker()
    const isPasswordInvalid = !isPasswordValid && isPasswordTouched


    
    var isFormValid = false;

    

    if(isNameValid && isEmailValid && isPasswordValid ){
    
        isFormValid = true
    }


    function nameHandler(e) {
        setName(e.target.value)
    }

    function emailHandler(e) {
        setEmail(e.target.value)
    }

    function passworHandler(e) {
        setPassword(e.target.value)

    }

   
    function nameBlurHandler() {
        setIsNameTouched(true)
    }

    function emailBlurHandler() {
        setIsEmailTouched(true)
    }

    function passwordBlurHandler() {
        setIsPasswordTouched(true)
    }


    

    function emailChecker() {

        const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        if (re.test(String(email).toLowerCase())) {
            return true;
        }
        else {
            return false;
        }

    }

    function passwordChecker() {
        const re = /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/;

        if (re.test(String(password))) {
            return true
        }
        else {
            return false
        }

    }
    


    function handler() {
        setIsDupMail(false)
        fetch("/auth/sign-up", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        }).then(response => {
            response.json().then(data => {
                console.log(data)
                if (data.error === "email already exist") {
                    setIsDupMail(true)
                }
                else {
                    history.push("/sign-in")
                }
            })
        })

    }
    return (


        <>
            <div className="auth-page-container">
                <div className="auth-page-image-container">
                    <img src="./auth.jpg" />
                </div>
                <div className="sign-in-container">
                    <div className="sign-in-heading">
                        <p className="sign-in-heading-brand">Create an Account</p>
                        <p className="sign-in-heading-signin">Join SS Today !</p>
                    </div>

                    <div className="sign-in-form">
                        <div className="sign-in-name-container">
                            <span><CgNametag /></span>
                            <div>
                                <p>Name </p>
                                <input type="text"
                                    value={name}
                                    className="sign-in-name-input" 
                                    onChange={(e) => { nameHandler(e) }} 
                                    onBlur={() => { nameBlurHandler() }}
                                   
                                    />
                                    
                              
                             </div>
                             

                        </div>
                        {isNameInvalid && <p className="invalid-login"> Enter name properly !</p>}
                        <div className="sign-in-email-container">
                            <span><HiOutlineMail /></span>
                            <div>
                                <p>Email </p>
                                <input type="email"
                                    value={email}
                                   className="sign-in-email-input"
                                   onChange={(e) => { emailHandler(e) }} 
                                    onBlur={() => { emailBlurHandler() }}
                                    />
                                  
                            </div>

                        </div>
                        {isEmailInvalid&& <p className="invalid-login"> Enter email address properly !</p>}

                        <div className="sign-in-passoword-container">
                            <span><RiLockPasswordFill /></span>
                            <div>
                                <p>Password</p>
                                <input type="password"
                                    value={password}
                                    className="sign-in-passoword-input"
                                    onChange={(e) => { passworHandler(e) }} 
                                    onBlur={() => { passwordBlurHandler() }}
                                    />
                                    
                            </div>

                        </div>
                        {isPasswordInvalid && <p className="invalid-login"> Must contain a digit, an uppercase letter, a lowercase letter, a character not being alphanumeric.</p>}

                        
                        { isFormValid ? <button
                            onClick={handler}
                            className="sign-in-button">Register</button> : <button className="sign-in-button invalid-button">Register</button>}
                       {isDupMail && <p className="invalid-login" style={{textAlign: 'center'}}>This email is already registered.</p>}

                        <p className="new-account-link">Already have an account? <Link to="/sign-in">Login</Link></p>

                    </div>

                </div>
            </div>
        </>
    )
}

export default SignUp

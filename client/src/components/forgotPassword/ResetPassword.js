import React, { useState } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';

const ResetPassword = () => {
    const [newPass, setNewPass] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");
    const [passwordOk, setPassowrdOk] = useState(true);
    const { resetToken } = useParams();
    const {tokenExp , setTokenExp} = useState(false)
   
    const [isNewPassTouched, setIsNewPassTouched] = useState(false);
    const isNewPassValid = newPass.trim() !== "" && newPassChecker()
    const isnewPassInvalid = !isNewPassValid && isNewPassTouched


    const history = useHistory();

    var isFormValid = false;



    if (isNewPassValid && (confirmNewPass == newPass)) {

        isFormValid = true
    }
    function newPassChecker() {
        const re = /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/;

        if (re.test(String(newPass))) {
            return true
        }
        else {
            return false
        }

    }

    function newPassHandler(e) {
        setNewPass(e.target.value)
    }

    function newPassBlurHandler() {
        setIsNewPassTouched(true)
    }

    function resetPassHandler() {
        fetch("/auth/reset-password", {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                resetToken,
                newPass
            })
        }).then(res => {
            res.json().then(data => {
                if(data.error){
                    notify2();
                    setInterval(() => {
                        history.push("/forgot-password")
                    }, 3000)
                  
                }
                else{
                    notify1()
                setTimeout(() => {
                    history.push("/sign-in")
                }, 2000)
            }
            }).catch(err => {
                console.log(err)
            })

        }).catch(err => {
            console.log(err)
        })
    }

    const notify1 = () => toast.success('Password changed sucessfully', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    const notify2 = () => toast.error('Token expired. Try Again', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });


    if (tokenExp) {
        return <div className="reset-password-container">
            <div className="forgot-password-email-sent-container">
                <p >Sorry the token has expired please <a href="/forgot-password" style={{ color: `blue` }}>try again</a>.</p>
            </div>
        </div>
    }
    

    return (<>
        <ToastContainer/>     
        <div className="reset-password-container">
            <p className="forgot-password-container-heading" > {false ? null : "Enter new password"} </p>
           
            <div className="reset-password-newpass">
                <label></label>
                <input type="password" value={newPass} onChange={(e) => { newPassHandler(e) }} onBlur={() => { newPassBlurHandler() }} placeholder="New Password" />
            </div>

            <div className="reset-password-confirmpass">
                <label></label>
                <input type="password" value={confirmNewPass} onChange={(e) => { setConfirmNewPass(e.target.value) }} placeholder="Confirm Password" />
            </div>

            {(newPass !== confirmNewPass) &&
                <div className="settings-error-container">
                    <p><li>new password and confirm password does not match</li></p>
                </div>}


            {(isnewPassInvalid) &&
                <div className="settings-error-container">
                    <p><li>new Password must contain a digit, an uppercase letter, a lowercase letter, a character not being alphanumeric.</li></p>
                </div>}

            {isFormValid ? <button onClick={(e) => { resetPassHandler() }}>Submit</button> : <button >Submit</button>}
          
        </div>
        </>
    )
}

export default ResetPassword

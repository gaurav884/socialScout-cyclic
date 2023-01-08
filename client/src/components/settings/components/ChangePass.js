import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const ChangePass = () => {
    const [oldPass, setOldPass] = useState();
    const [newPass, setNewPass] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");
    const [oldpassError, setOldPassError] = useState(false);
    const [passwordOk, setPassowrdOk] = useState(true);


    function passwordChanger(){
        fetch("/user/change-password", {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('jwt')
               
            },
            body: JSON.stringify({
                oldPass,
                newPass
            })
        }).then(res=>{
            res.json().then(data=>{
                if(data.error){
                    setOldPassError(true)
                }
                else{
                    setOldPassError(false)
                    notify()
                }
                
               
            }).catch(err=>{
                console.log(err)
            })
        }).catch(err=>{
            console.log(err)
        })
    
    }


    function passwordChecker(e) {
        setNewPass(e.target.value)
        const re = /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/;

        if (re.test(String(newPass))) {
            setPassowrdOk(true)
        }
        else {
            setPassowrdOk(false)
        }

    }

    
    const notify = () => toast.success('Password changed sucessfully', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    return (
        <>
            <p className="change-pass-heading">Change your Password</p>
            <div className="change-pass-form">

                <div className="change-pass-containers old-pass">
                    <input type="password" value={oldPass} onChange={(e) => { setOldPass(e.target.value) }} placeholder="Enter Old Password"/>
                </div>

                <div className="change-pass-containers new-pass">
                    <input type="password" value={newPass} onChange={(e) => { passwordChecker(e) }} placeholder="Enter New Password"/>
                </div>

                <div className="change-pass-containers">
                    <input type="password" value={confirmNewPass} onChange={(e) => { setConfirmNewPass(e.target.value) }} placeholder="Enter Confirm Password"/>
                </div>

                {(newPass !== confirmNewPass) ?
                    <div className="settings-error-container">
                        <p><li>new password and confirm password does not match</li></p>
                    </div> : null}


                {(passwordOk) ?null:
                    <div className="settings-error-container">
                        <p><li>new Password must contain a digit, an uppercase letter, a lowercase letter, a character not being alphanumeric.</li></p>
                    </div> }

             

                {(oldpassError) ? <div className="settings-error-container">
                    <p><li>Wrong old password</li></p>
                </div> : null}


                {(oldPass) && (passwordOk) && (newPass === confirmNewPass) ?<button  onClick={(e) => {passwordChanger()}}>Submit</button>: <button >Submit</button>}

            </div>



        </>
    )
}

export default ChangePass

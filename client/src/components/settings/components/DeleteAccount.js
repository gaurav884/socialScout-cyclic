import React, { useContext, useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import { UserContext } from '../../../contexts/UserContext'

import { MdErrorOutline } from "react-icons/md";

const DeleteAccount = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext)
    const [error , setError] = useState(false);
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
   


    function removeAcc() {
        fetch("/user/delete-account", {
            method: "delete",
            headers: {
                'Content-Type': "application/json",
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                checked: agreed,
                password
            })
        }).then(res => {
            res.json().then(data => {
                if(data.error){
                  
                   setError(true)
                }
                else{
                    setError(false)
                localStorage.clear();
                dispatch({ type: "CLEAR" })
                history.push("/sign-in")
                }

            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }


    return (
        <>
            <p className="delete-acc-heading">Delete your account</p>
            <div className="delete-acc-form">
                <div>
                    <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Enter Password"/>

                </div>

                <div className="delete-acc-confirmation">
                    <input type="checkbox" onChange={(e) => { 
                          setAgreed(e.target.checked)
                        }} />
                    <p>I am sure and I want to delete my account permanently</p>
                </div>
                
                {(error)?<div className="settings-error-container">
                    <p>Please enter all the fields correctly</p>
                </div>:null}
                
            </div>
            <button className="delete-acc-button" onClick={() => { removeAcc() }}>Delete</button>

        </>
    )
}

export default DeleteAccount

import React, { useContext, useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import { UserContext } from '../../../contexts/UserContext'

import { MdErrorOutline } from "react-icons/md";

const SignOutSettings = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext)
    const [error , setError] = useState(false);
    const [agreed, setAgreed] = useState(false);
   


    function logoutHandler(){
                    localStorage.clear();
                    dispatch({ type: "CLEAR" })
                    history.push("/sign-in")


    }
    return (
        <>
            <p className="delete-acc-heading">Signout</p>
            <div className="delete-acc-form">
               
                <div className="delete-acc-confirmation">
                    <input type="checkbox" onChange={(e) => { 
                          setAgreed(e.target.checked)
                        }} />
                    <p> I want to signout.</p>
                </div>
                
                
            </div>
            <button className="delete-acc-button" onClick={() =>{agreed && logoutHandler() }}>Sign out</button>

        </>
    )
}

export default SignOutSettings

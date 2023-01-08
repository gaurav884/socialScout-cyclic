import React, { useState, useEffect, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from "../../../contexts/UserContext"

const ChangeName = () => {

    const [newName, setNewName] = useState("");
    const [error, setError] = useState(false);
    const { state, dispatch } = useContext(UserContext)
    function changeName() {
        fetch("/user/change-name", {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')

            },
            body: JSON.stringify({
                newName
            })
        }).then(res => {
            res.json().then(data => {
                if (data.error) {
                    setError(true)
                }
                else {

                    const updated = JSON.parse(localStorage.getItem("user"));
                    updated.name = newName;
                    dispatch({ type: "USER", payload: updated })
                    localStorage.setItem("user", JSON.stringify(updated));
                    notify()
                }

            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }

    const notify = () => toast.success('Name changed sucessfully', {
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
            <ToastContainer />
            <p className="change-name-heading">Change your name</p>
            <div className="change-name-form">
                <input type="text" value={newName} onChange={(e) => { setNewName(e.target.value) }} placeholder="Enter New Name here..." />


                {(error) ? <div className="settings-error-container">
                    <p>Please enter all the fields correctly</p>
                </div> : null}
            </div>
            <button className="change-name-button" onClick={() => { changeName() }}>Change Name</button>
        </>
    )
}

export default ChangeName

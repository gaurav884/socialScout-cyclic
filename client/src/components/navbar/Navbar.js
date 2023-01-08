import React, { useContext, useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import { UserContext } from '../../contexts/UserContext'
import { GrSearch } from "react-icons/gr";

import { FiSettings } from "react-icons/fi";
import { ImCancelCircle } from "react-icons/im";
import { IoNotificationsOutline } from "react-icons/io5";

const Navbar = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext)
    const [isModal, setIsModal] = useState(false)
    const [foundUser, setFoundUser] = useState();
    const [search, setSearch] = useState("");
    const [requests, setRequests] = useState([]);

    const [notificationOn, setNotificationOn] = useState(false)
 
    useEffect(() => {

        if (state) {

            fetchposts2()
        }

    }, [state])

    function fetchUsers(query) {
        setSearch(query);

        fetch("/user/search-user", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                query
            })


        }).then((res => {
            res.json().then((data) => {

                setFoundUser(data.found)

            })
        })).catch(err => {
            console.log(err)
        })
    }

    function fetchposts2() {
        fetch(`/user/${state._id}/influence`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res =>
            res.json().then(data => {

                setRequests(data.user.requests)


            }).catch(err =>
                console.log(err)

            )
        )

    }

    function declineRequest(id) {
        fetch(`/user/decline-follow`, {
            method: 'put',
            headers: {
                "content-type": "application/json",
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: id
            })
        }).then(res =>
            res.json().then(data => {
                fetchposts2()


            }).catch(err =>
                console.log(err)

            )
        )

    }

    function acceptRequest(id) {
        fetch(`/user//accept-follow`, {
            method: 'put',
            headers: {
                "content-type": "application/json",
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                requesterId: id
            })
        }).then(res =>
            res.json().then(data => {

                fetchposts2()


            }).catch(err =>
                console.log(err)

            )
        )

    }

    function showLinks() {
        if (state) {
            return <>
                <div className="search-bar-container">
                    <input type="text" className="search-bar" placeholder="Search for people" value={search} onChange={(e) => { fetchUsers(e.target.value) }} />
                    <Link to="/profile"><GrSearch className="search-icon" /></Link>


                    {(foundUser) ?


                        (foundUser.length > 0) ? <div className="found-container"> {foundUser.map((each, index) => {
                            return <div key={index}><Link to={`/${each._id}`} target="_blank"><div className="found-user" >
                                <div className="found-user-image-container">
                                    <img src={each.profilePhoto} />
                                </div>
                                <p className="found-user-name">{each.name}</p>
                            </div></Link>
                            </div>
                        })}</div> :
                            <div className="found-container">
                                <div className="found-user">
                                    <p className="found-user-name">No users found</p>
                                </div>
                            </div>


                        : null}
                </div>


                <div className="navbar-links">

                    <button className="requests-container-open-button" onClick={() => { setNotificationOn(!notificationOn) }}><IoNotificationsOutline />{requests.length>0?<div className="notifications-count">{requests.length}</div>:null}</button>
                    <Link  to="/profile" className="requests-container-open- navBlinks" ><div className="profile-image-wrapper"><img  src={state.profilePhoto} /></div></Link>
                    <Link to="/settings/change-name" className="requests-container-open-button navBlinks" ><FiSettings/></Link>
                    
                    {/* <button className="logout-link"

                        onClick={() => setIsModal(true)}
                    >Sign Out</button> */}

                    {(requests) ?


                        (requests.length > 0) ? <div className={(notificationOn) ? "requests-container" : "requests-container notifications-not-active"}> {requests.map((each, index) => {

                            return <div className="requests-user" key={index}>
                                <div className="requests-user-image-container">
                                    <img src={each.profilePhoto} />
                                </div>
                                <Link to={`/${each._id}`} target="_blank"><p className="requests-user-name">{each.name}</p></Link>

                                <div className="request-button-container">
                                    <button className="request-accept" onClick={() => { acceptRequest(each._id) }}>Accept</button>
                                    <button className="request-accept" onClick={() => { declineRequest(each._id) }}>Decline</button>
                                </div>
                            </div>
                        })}</div> :
                            <div className={(notificationOn) ? "requests-container" : "requests-container notifications-not-active"}>
                                <div className="requests-user">
                                    <p className="requests-user-name">No requests</p>
                                </div>
                            </div>


                        : null}


                </div>

            </>
        }
        else {
            return <>

            </>
        }
    }

    return <>{isModal ? <div className="modal-background">

        <div className="modal-container">
            <h4>Sign Out </h4>

            <button className="modal-cancel" onClick={() => {
                setIsModal(false)
            }}><ImCancelCircle /></button>

            <p>Are you sure you want to Sign Out ?</p>
            <div className="modal-buttons">
                <button onClick={() => {

                    setIsModal(false)
                    localStorage.clear();
                    dispatch({ type: "CLEAR" })
                    history.push("/sign-in")



                }}
                >Yes</button>
                <button onClick={() => {
                    setIsModal(false)
                }}
                >No</button>
            </div>
        </div>

    </div> : null}


        <div className="navbar-container">
          
                <Link to="/" className="navbar-brand">
                    <img src="https://res.cloudinary.com/dagwb842k/image/upload/v1645510918/logo_oqwcfr.png" alt="brandLogo"/>
                 
                </Link>


            {showLinks()}

        </div>
    </>

}

export default Navbar

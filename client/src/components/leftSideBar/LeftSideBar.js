import React, { useContext} from 'react'
import { Link} from "react-router-dom"
import { UserContext } from '../../contexts/UserContext'
import { MdRssFeed } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";



const LeftSideBar = () => {

    const { state, dispatch } = useContext(UserContext)
    if(!state){
        return <></>
    }

    return (
        <div className="left-sidebar-container">
            <div className="left-sidebar-links-container" >
            <Link to="/profile" className="left-sidebar-link-profile">
                        <div className="profile-image-wrapper" style={{margin:"2px"}}><img  src={state.profilePhoto} /></div><p>{state.name}</p></Link>
                <Link className="left-sidebar-link" to="/"><div className="left-sidebar-link-icons"><MdRssFeed/></div> <p>Feeds</p> </Link>
                <Link className="left-sidebar-link" to="/profile"><div className="left-sidebar-link-icons"><FaUserAlt/></div> <p>Profile</p></Link>
                <Link className="left-sidebar-link" to="/settings/change-name"><div className="left-sidebar-link-icons"><IoSettingsOutline/></div> <p>Settings</p></Link>
            </div>
        </div>
    )
}

export default LeftSideBar

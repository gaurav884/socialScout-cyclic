import React,{ useContext} from 'react'
import { Link, Switch, Route, BrowserRouter, useHistory } from "react-router-dom"
import ChangePass from "./components/ChangePass.js"
import ChangeName from "./components/ChangeName.js"
import DeleteAccount from "./components/DeleteAccount"
import SignOutSettings from './components/SignOutSetting.js'
import Navbar from "../navbar/Navbar"
import LeftSideBar from "../leftSideBar/LeftSideBar"
import RightSideBar from "../rightSideBar/RightSideBar"
import { UserContext } from '../../contexts/UserContext';


const Settings = () => {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    
    return (
        <>
            <Navbar />
            <div className="layout-container">
                {(state) ? <LeftSideBar /> : null}
            </div>
            <div className="settings-container">

                <div className="settings-link-container">

                    <Link to="/settings/change-name" className={window.location.pathname==="/settings/change-name"?"settings-link settings-link-Active":"settings-link"}>Change Name</Link>
                    <Link to="/settings/change-password" className="settings-link" className={window.location.pathname==="/settings/change-password"?"settings-link settings-link-Active":"settings-link"}>Change Password</Link>
                    <Link to="/settings/delete-account" className="settings-link" className={window.location.pathname==="/settings/delete-account"?"settings-link settings-link-Active":"settings-link"}>Delete Account</Link>
                    <Link to="/settings/signout-settings" className="settings-link" className={window.location.pathname==="/settings/signout-settings"?"settings-link settings-link-Active":"settings-link"}>Sign Out</Link>
                </div>

                <div className="settings-each-container">

                    <Switch>
                        <Route path="/settings/change-password" exact component={ChangePass} />
                        <Route path="/settings/change-name" exact component={ChangeName} />
                        <Route path="/settings/delete-account" exact component={DeleteAccount} />
                        <Route path="/settings/signout-settings" exact component={SignOutSettings} />
                    </Switch>

                </div>

            </div>
        </>
    )
}

export default Settings

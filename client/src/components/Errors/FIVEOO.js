import React from 'react'
import { useHistory, Link } from "react-router-dom"
import "./FourOFourError.css"
import { BiErrorCircle } from 'react-icons/bi'

const FIVEOO = () => {
    const history = useHistory();
    return (
        <div className="FOF-page">
            <div className="FOF-container">
                <h1>500</h1>
                <div className="error-svg-container">
                    <BiErrorCircle />
                </div>
                <h3>Server Error</h3>
                <button onClick={()=>{history.goBack()}}>Go Back</button>
            </div>
        </div>
    )
}

export default FIVEOO

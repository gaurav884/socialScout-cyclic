import React from 'react'
import { useHistory, Link } from "react-router-dom"
import "./FourOFourError.css"
import { BiErrorCircle } from 'react-icons/bi'


const FourOFourError = () => {
    const history = useHistory();
    return (
        <div className="FOF-page">
            <div className="FOF-container">
                <h1>404</h1>
                <div className="error-svg-container">
                    <BiErrorCircle />
                </div>
                <h3>Page not found </h3>
                <button onClick={() => { history.goBack() }}>Go Back</button>
            </div>
        </div>
    )
}

export default FourOFourError

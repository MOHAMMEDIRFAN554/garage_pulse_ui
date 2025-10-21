import React, { useEffect, useState } from 'react'
import "./Registration.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function clickReg(){
    alert ('Registered')
}
function Registration() {
 const navigate = useNavigate();
    const [FormData, setForm] = useState({ name: '', age: '',   mark: '', email: ''})
  
    return (
        <>
            <div className="container">
                <div className="login">
                    <h2>Registration</h2>
                    <input onChange={(e) => setUser({ ...user, fullname: e.target.value })} type="text" placeholder="Fullname" className="input"/>
                    <input onChange={(e) => setUser({ ...user, email: e.target.value })} type="email" placeholder="Email" className="input"/>
                    <input onChange={(e) => setUser({ ...user, password: e.target.value })} type="password" placeholder="Confirm Password" className="input" />
                    <input onChange={(e) => setUser({ ...user, password: e.target.value })} type="password" placeholder="Password" className="input"/>

                    <button className="btn" onClick={clickReg}>Register</button>
                </div>
            </div>
        </>
    )
}

export default Registration;
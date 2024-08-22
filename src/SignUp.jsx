import { useState } from 'react';
import { API_URL } from './api_url.js'

export default function SignUp({setIsLogin, setShowPage}) {

    const [formData, setFormData] = useState({
        "username": "",
        "password": "",
        "confirmPassword": "",
        "adminCode": ""
    })
    const [errData, setErrData] = useState('')

    async function signUpClick(event) {
        event.preventDefault()
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(`${API_URL}/v1/user/sign-up/`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(formData),
        });

        let data = await response.json()
        if (data && data.token) {
            // success, token received
            localStorage.setItem('token', data.token)
            setIsLogin(true)
            setShowPage("AllBlog")
            setErrData("")
        } else {
            setErrData(data.error)
        }
    }

    const updateFormData = (e, key) => {
        let newFormData = {
            ...formData
        }
        newFormData[key] = e.target.value
        setFormData(newFormData)
    }

    return (
        <div>
            <h1> Sign Up Page </h1>

            <form onSubmit={signUpClick}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" name="username" id="username" value={formData.username} onChange={(e) => updateFormData(e, "username")} />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" id="password" value={formData.password} onChange={(e) => updateFormData(e, "password")} />

                </div>

                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={(e) => updateFormData(e, "confirmPassword")} />
                </div>

                <div className="mb-3">
                    <label htmlFor="adminCode" className="form-label">Admin Registration Code</label>
                    <input type="text" className="form-control" name="adminCode" id="adminCode" value={formData.adminCode} onChange={(e) => updateFormData(e, "adminCode")} />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

            {errData && <li className='text-danger'>{errData}</li>}

        </div>
    );
}
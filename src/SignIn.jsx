import { useState } from 'react'
import { API_URL } from './api_url.js'


export default function SignIn({setIsLogin, setShowPage}) {

    const [formData, setFormData] = useState({ username: '', password: '' })
    const [errData, setErrData] = useState('')


    async function signInClick(event) {
        event.preventDefault()
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(`${API_URL}/v1/user/sign-in/`, {
            method: "POST",
            headers : myHeaders,
            body: JSON.stringify(formData),
        });

        let data = await response.json()
        if(data && data.token){
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
            <h1> Sign In Page </h1>

            <form onSubmit={signInClick}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" name="username" id="username" value={formData.username} onChange={(e) => updateFormData(e, "username")} />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" id="password" value={formData.password} onChange={(e) => updateFormData(e, "password")} />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            {errData && <li className='text-danger'>{errData}</li>}


        </div>
    );
}
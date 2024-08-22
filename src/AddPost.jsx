import { useState } from "react"
import Editor from 'react-simple-wysiwyg';

import { API_URL } from './api_url.js'

export default function AddPost({ setShowPage }) {

    const [errData, setErrData] = useState('')

    const [contents, setContents] = useState('');

    function onChange(e) {
        setContents(e.target.value);
    }

    async function submitPostClick(event) {
        event.preventDefault()
        const myHeaders = new Headers();
        const token = localStorage.getItem("token");
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        let formData = new FormData(event.target);
        formData = Object.fromEntries(formData.entries());

        let filteredFormData = {
            title: formData.title,
            contents: contents,
            isPublished: !(formData.isDraft === 'on'),
        }
        const response = await fetch(`${API_URL}/v1/posts/`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(filteredFormData),
        });

        let data = await response.json()
        if (data && data.newPost) {
            setShowPage("AllBlog")
            setErrData("")
        } else {
            setErrData(data.error)
        }
    }


    return (
        <div className="">
            <h1>Add New Post</h1>
            <form method="POST" onSubmit={submitPostClick}>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" name="title" id="title" placeholder="title" />
                    <label htmlFor="title">Title</label>
                </div>

                <p>Contents: </p>
                <Editor value={contents} onChange={onChange} />

                <div className="form-check form-switch my-3">
                    <input className="form-check-input" type="checkbox" role="switch" id="isDraft" name="isDraft" />
                    <label className="form-check-label" htmlFor="isDraft">save as draft</label>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>

            </form>

            {errData && <li className='text-danger'>{errData}</li>}

        </div>
    )

}
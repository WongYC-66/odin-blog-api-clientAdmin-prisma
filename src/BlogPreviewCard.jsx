import { useState } from "react"

import { API_URL } from './api_url.js'

export default function BlogPreviewCard(props) {
    const post = props.post
    const setShowPage = props.setShowPage
    const [toShow, setToShow] = useState(true)

    const fmtTime = (timestamp) => {
        return new Date(timestamp).toLocaleString()
    }

    const editButtonClick = (id) => {
        setShowPage(`EditPost,${id}`)
    }

    const deleteButtonClick = async () => {
        // delete API
        const myHeaders = new Headers();
        const token = localStorage.getItem("token");
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(`${API_URL}/v1/posts/${post.id}`, {
            method: "DELETE",
            headers: myHeaders,
        });

        // redirect
        let data = await response.json()
        if (data && data.message) {
            // hide the deleted comment
            setToShow(false)
        }
    }

    return (
        <>
            {toShow &&
                < div className="card my-4" >
                    <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <h6 className="card-subtitle mb-2 text-body-secondary">{fmtTime(post.timestamp)}</h6>

                        <p className="card-text text-truncate">{post.contents}</p>

                        <button type="button" className="btn btn-primary card-link" onClick={() => editButtonClick(post.id)}>Edit</button>
                        <button type="button" className="btn btn-danger card-link" onClick={deleteButtonClick}>Delete</button>
                    </div>
                </div >
            }
        </>
    )

}
import { useState } from "react"

import { API_URL } from './api_url.js'

export default function CommentCard(props) {
    // let comment = props.comment
    const [comment, setComment] = useState(props.comment)

    const [errData, setErrData] = useState('')
    const [toShow, setToShow] = useState(true)
    const [editMode, setEditMode] = useState(false)

    const fmtTime = (timestamp) => {
        return new Date(timestamp).toLocaleString()
    }

    const editButtonClick = (id) => {
        setEditMode(true)
    }

    const cancelButtonClick = (id) => {
        setEditMode(false)
    }

    const updateButtonClick = async (event) => {
        event.preventDefault()
        const myHeaders = new Headers();
        const token = localStorage.getItem("token");
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        let formData = new FormData(event.target);
        formData = Object.fromEntries(formData.entries());

        let filteredFormData = {
            text: formData.comment,
        }

        const response = await fetch(`${API_URL}/v1/comments/${comment.id}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(filteredFormData),
        });

        let data = await response.json()
        if (data && data.updatedComment) {
            setEditMode(false)
            const newObj = {
                ...data.updatedComment,
                user : comment.user
            }
            setComment(newObj)
            setErrData("")
        } else {
            setErrData(data.error)
        }
    }

    const deleteButtonClick = async () => {
        // delete API
        const myHeaders = new Headers();
        const token = localStorage.getItem("token");
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(`${API_URL}/v1/comments/${comment.id}`, {
            method: "DELETE",
            headers: myHeaders,
        });

        let data = await response.json()
        if(data && data.message){
            // hide the deleted comment
            setToShow(false)
        }
    }

    return (
        <>
            {toShow &&
                <div className="card my-2">
                    <div className="card-body">
                        <h5 className="card-title fs-6">
                            <span className="fw-bold"> {comment.user.username} </span>
                            <span className="card-subtitle ms-5 mb-2 text-body-secondary fs-6 text-end">{fmtTime(comment.timestamp)}</span>
                        </h5>

                        {/* nonEdit Mode */}
                        {!editMode && <>
                            <p className="card-text">{comment.text}</p>

                            <button type="button" className="btn btn-primary card-link" onClick={editButtonClick}>Edit</button>
                            <button type="button" className="btn btn-danger card-link" onClick={deleteButtonClick}>Delete</button>
                        </>}

                        {/* Edit Mode */}
                        {editMode && <>

                            <form method="POST" onSubmit={updateButtonClick}>
                                <input type="text" className="form-control" name="comment" id="comment" placeholder="" defaultValue={comment.text} />
                                <div className="my-2"></div>
                                <button type="submit" className="btn btn-primary card-link">Update</button>
                                <button type="button" className="btn btn-danger card-link" onClick={cancelButtonClick}>Cancel</button>
                            </form>
                        </>}

                        {errData && <li className='text-danger'>{errData}</li>}

                    </div>
                </div>
            }
        </>
    )

}
import { useEffect, useState, useRef } from "react"
import Editor from 'react-simple-wysiwyg';

import CommentCard from './CommentCard.jsx'
import { API_URL } from './api_url.js'

export default function EditPost(props) {

    const postId = props.postId
    const setShowPage = props.setShowPage

    const [post, setPost] = useState({})
    const [allComments, setAllComments] = useState([])
    const [errData, setErrData] = useState('')

    const isDraftRef = useRef(null);

    const [toFetch, setToFetch] = useState(1)

    const [contents, setContents] = useState('my <b>HTML</b>');

    function onChange(e) {
        setContents(e.target.value);
    }

    useEffect(() => {
        const fetchData = async (api_str) => {

            const myHeaders = new Headers();
            const token = localStorage.getItem("token");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const response = await fetch(`${API_URL}/v1/${api_str}/${postId}`, {
                method: "GET",
                headers: myHeaders,
            });

            let data = await response.json()

            if (api_str == 'posts') {
                if (data.post) {
                    setPost(data.post)
                    setContents(data.post.contents)
                    isDraftRef.current.defaultChecked = !data.post.isPublished
                }
            } else {
                // comments
                if (data.allComments) {
                    setAllComments(data.allComments)
                }
            }

            if (data.error) {
                setErrData(data.error)
            }
        }

        fetchData("posts")
        fetchData("comments")

    }, [toFetch])

    async function submitUpdateClick(event) {
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

        const response = await fetch(`${API_URL}/v1/posts/${post.id}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(filteredFormData),
        });

        let data = await response.json()
        if (data && data.updatedPost) {
            setShowPage("AllBlog")
            setErrData("")
        } else {
            setErrData(data.error)
        }
    }

    async function submitNewComment(event) {
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

        const response = await fetch(`${API_URL}/v1/comments/${post.id}`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(filteredFormData),
        });

        let data = await response.json()
        if (data && data.message) {
            // setShowPage(`AllBlog`)
            setToFetch(toFetch + 1)
            setErrData("")
        } else {
            setErrData(data.error)
        }
    }


    return (
        <div className="">
            {/* Edit Post section */}
            <form method="POST" onSubmit={submitUpdateClick}>
                <h1>Edit Post: </h1>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" name="title" id="title" placeholder="title" defaultValue={post.title} />
                    <label htmlFor="title">Title</label>
                </div>

                <p>Contents: </p>
                <Editor value={contents} onChange={onChange} />

                <div className="form-check form-switch my-3">
                    <input className="form-check-input" type="checkbox" role="switch" id="isDraft" name="isDraft" ref={isDraftRef} />
                    <label className="form-check-label" htmlFor="isDraft">save as draft</label>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>

            </form>

            {errData && <li className='text-danger'>{errData}</li>}

            {/* Comment Section, POST new comment & show list */}
            <hr></hr>
            <h2>Comments:</h2>

            <form method="POST" onSubmit={submitNewComment}>
                <input type="text" className="form-control" name="comment" id="comment" placeholder="" />
                <div className="my-1 d-flex flex-row-reverse">
                    <button type="submit" className="btn btn-primary btn-sm">Reply</button>
                </div>

            </form>

            {allComments.map(comment => <CommentCard key={comment.id} comment={comment} />)}


        </div>
    )

}
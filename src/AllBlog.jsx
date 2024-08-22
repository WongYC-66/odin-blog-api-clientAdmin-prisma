import { useEffect, useState } from "react";
import { API_URL } from './api_url.js'

import BlogPreviewCard from "./BlogPreviewCard.jsx";

export default function AllBlog({ isLogin, setShowPage }) {
    const [posts, setPosts] = useState([
        // {
        //     "_id": "id0001",
        //     "title": "mock-title-1",
        //     "contents": "mock-title-1",
        // },
        // {
        //     "_id": "id0002",
        //     "title": "mock-title-2",
        //     "contents": "mock-title-2",
        // },
        // {
        //     "_id": "id0003",
        //     "title": "mock-title-3",
        //     "contents": "mock-title-3",
        // }
    ])

    useEffect(() => {
        const fetchData = async () => {
            const myHeaders = new Headers();
            const token = localStorage.getItem("token");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const response = await fetch(`${API_URL}/v1/posts`, {
                method: "GET",
                headers: myHeaders,
            });

            let data = await response.json()
            data = data.allPosts

            setPosts(data)
        }

        fetchData()

    }, [isLogin])


    const newPostClick = () => {
        setShowPage('AddPost')
    }

    return (
        <div>
            <h1> All Blog </h1>

            <button type="button" className="btn btn-primary" onClick={newPostClick}> New Post</button>

            {posts.map(post => <BlogPreviewCard post={post} key={post.id} setShowPage={setShowPage} />)}

        </div>
    );
}
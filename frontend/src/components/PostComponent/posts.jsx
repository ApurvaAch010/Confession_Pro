import { Clock, Heart, MessageCircle, User } from "lucide-react";
import "./posts.css";
import axios from "axios";
import { useState, useEffect } from "react";

const Posts = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:8080/confess/posts/getAll");
            console.log(res.data.result.confessions);
            setPosts(res.data.result.confessions); // updated to match backend response
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div>
        {
            
            posts?   <div className="posts-container">
            {posts.map((post, idx) => (
                <div className="posts" key={post.id || idx}>
                    <div className="title">
                        <div className="profile">
                            <User size={30} color="purple" />
                        </div>
                        <div className="title-text">
                            <h1>{post.is_anonymous ? "Anonymous" : (post.username || "User")}</h1>
                            <div className="title-text-sub">
                                <p>
                                    <Clock size={10} /> {new Date(post.created_at).toLocaleString()}
                                </p>
                                <span>{post.title}</span>
                            </div>
                        </div>
                    </div>
                    <div className="body">
                        <h1 style={{ fontSize: "18px" }}>{post.title}</h1>
                        <p>{post.content}</p>
                    </div>
                    <div className="footer">
                        <div className="like">
                            <Heart size={20} color="gray" />
                            <span>{post.likes ?? 0}</span>
                        </div>
                        <div className="comment">
                            <MessageCircle size={20} color="gray" />
                            <span>{post.comments ?? 0}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>:
        <Loading/>
            
        
        }
        </div>
    );
};

export default Posts;
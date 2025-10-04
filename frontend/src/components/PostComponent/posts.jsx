import { Clock, Heart, MessageCircle, User } from "lucide-react";
import "./posts.css";
import axios from "axios";
import { useState, useEffect } from "react";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState();
    const token = localStorage.getItem("accessToken") || null;

    const fetchUser = async () => {
        try {
            let res = await axios.get("http://localhost:8080/confess/auth/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(res.data.result);
        } catch (err) {
            console.log("Error fetching dashboard", err);

        }
    }

    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:8080/confess/posts/getAll");
            setPosts(res.data.result.confessions);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    const toggleLike = async (id) => {
        try {
            const token = localStorage.getItem("accessToken") || null;

            if (!token) {
                console.log("No token found, user must be logged in");
                return;
            }

            const res = await axios.post(
                "http://localhost:8080/confess/posts/toggle-like",
                { postId: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPosts(prev =>
                prev.map(post =>
                    post.id === id ? { ...post, likeCount: res.data.likeCount } : post
                )
            );

        } catch (err) {
            console.log("Error toggling like:", err);
        }
    };


    useEffect(() => {
        fetchPosts();
        fetchUser();
    }, []);

    return (
        <div>
            {

                posts ? <div className="posts-container">
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
                                        {/* <span>{post.title}</span> */}
                                    </div>
                                </div>
                            </div>
                            <div className="body">
                                <h1 style={{ fontSize: "18px" }}>{post.title}</h1>
                                <p>{post.content}</p>
                            </div>
                            <div className="footer">
                                <div className="like">
                                    <button style={{ textDecoration: "none", border: "none" }}
                                        onClick={() => { user ? toggleLike(post.id) : alert("PLease login-first") }}>
                                        <Heart size={20} color="gray" />
                                        <span>{post.likeCount ?? 0}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> :
                    <Loading />


            }
        </div>
    );
};

export default Posts;
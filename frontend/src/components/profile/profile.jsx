import { ArrowLeft, Heart, User, Clock, MessageCircle } from "lucide-react";
import "./profile.css";
import { NavLink, useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../loader/loading";

const Profile = () => {
    const token = localStorage.getItem("accessToken") || null;

    const [userData, setUserData] = useState();
    const nav = useNavigate();

    const fetchUserDashboard = async () => {
        try {
            let res = await axios.get("http://localhost:8080/confess/auth/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(res.data.result);
        } catch (err) {
            if (err.response?.data?.error === "Invalid/expired token") {
                alert("Please re-login");
                nav("/auth");
            }
            console.log("ERROR WHILE FETCHING DASHBOARD", err.response?.data);
        }
    };

    useEffect(() => {
        fetchUserDashboard();
    }, []);

    const toggleLike = (postId) => {
        console.log("Like toggled for:", postId);
        // TODO: call backend to toggle like
    };

    return (
        <>
            <div className="pfp-container">
                <div className="pfp-top">
                    <div className="pfp-arrow">
                        <NavLink to="/" style={{ textDecoration: "none", color: "black" }}>
                            <ArrowLeft />
                            <span>Back</span>
                        </NavLink>
                    </div>
                    <div className="pfp-main">
                        <Heart
                            size={35}
                            color="white"
                            style={{
                                borderRadius: "50px",
                                padding: "10px",
                                background: "linear-gradient(to right,#600fa1, #1525cf)",
                            }}
                        />
                        <h1 style={{ fontSize: "20px", marginTop: "5px", paddingLeft: "5px" }}>Profile</h1>
                    </div>
                </div>

                {userData ? (
                    <>
                        <div className="pfp-box">
                            <div className="pfp">
                                <label>Username:</label>
                                <p>{userData.username}</p>
                                <label>Email:</label>
                                <p>{userData.email}</p>
                            </div>
                            <div className="attributes">
                                <div className="firstattr">
                                    <p>2</p>
                                    <span>Confessions</span>
                                </div>
                                <div className="secondattr">
                                    <p>11</p>
                                    <span>Likes</span>
                                </div>
                                <div className="thirdattr">
                                    <p>20</p>
                                    <span>Comments</span>
                                </div>
                            </div>
                        </div>

                        <div className="posts-container">
                            {userData.posts && userData.posts.length > 0 ? (
                                userData.posts.map((post, idx) => (
                                    <div className="posts" key={post.id || idx}>
                                        <div className="title">
                                            <div className="profile">
                                                <User size={30} color="purple" />
                                            </div>
                                            <div className="title-text">
                                                <h1>{post.is_anonymous ? "Anonymous" : (post.username || "User")}</h1>
                                                <div className="title-text-sub">
                                                    <p>
                                                        <Clock size={10} />{" "}
                                                        {new Date(post.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="body">
                                            <h1 style={{ fontSize: "18px" }}>{post.title}</h1>
                                            <p>{post.content}</p>
                                        </div>

                                        <div className="footer">
                                            <div className="like">
                                                <button
                                                    style={{ textDecoration: "none", border: "none" }}
                                                    onClick={() => toggleLike(post.id)}
                                                >
                                                    <Heart size={20} color="gray" />
                                                    <span>{post.likeCount ?? 0}</span>
                                                </button>
                                            </div>
                                            <div className="comment">
                                                <MessageCircle size={20} color="gray" />
                                                <span>{post.comments ?? 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No posts yet.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <Loading />
                )}
            </div>
        </>
    );
};

export default Profile;

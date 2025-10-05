import { ArrowLeft, Heart, User, Clock, Trash2 } from "lucide-react";
import "./profile.css";
import { NavLink, useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../loader/loading";
import NavbarTop from "../navbar-top/navbartop";

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
            if (err.response.status === 401) {
                alert("Please re-login");
                nav("/auth");
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
            }
            console.log("ERROR WHILE FETCHING DASHBOARD", err.response.data);
        }
    };

    const deletePost = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8080/confess/posts/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            alert(res.data.message)

            fetchUserDashboard();

        }
        catch (err) {
            console.log("Error While deleting", err)
        }
    }

    useEffect(() => {
        fetchUserDashboard();
    }, []);

    return (
        <>
            <div className="pfp-container">
                <NavbarTop pageTitle={"Profile"} />

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
                                    <p>{userData.confessionCount}</p>
                                    <span>Confessions</span>
                                </div>
                                <div className="secondattr">
                                    <p>{userData.totalLikes}</p>
                                    <span>Likes</span>
                                </div>
                                <div className="thirdattr">
                                    <NavLink to="/bin" style={{textDecoration:"none", color:"black"}}>
                                        <p><Trash2 color="gray" /></p>
                                        <span>Bin</span>
                                    </NavLink>

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
                                                    style={{ textDecoration: "none", border: "none" }} disabled={true}
                                                >
                                                    <Heart size={20} color="gray" />
                                                    <span>{post.likeCount ?? 0}</span>
                                                </button>
                                            </div>
                                            <div className="delete">
                                                <button style={{ textDecoration: "none", border: "none" }} onClick={() => { deletePost(post.id) }}>
                                                    <Trash2 size={20} color="gray" />
                                                </button>
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

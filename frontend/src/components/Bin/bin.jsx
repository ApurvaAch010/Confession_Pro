import { useState } from "react"
import NavbarTop from "../navbar-top/navbartop"
import axios from "axios";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { RotateCcw,User,Clock } from "lucide-react";

const Bin = () => {

    const [deletedPosts, setDeletedPosts] = useState();

    const token = localStorage.getItem("accessToken") || null;

    const nav = useNavigate();
    const fetchDeletedPosts = async () => {
        try {

            const binPosts = await axios.get("http://localhost:8080/confess/posts/bin", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
         
            setDeletedPosts(binPosts.data.data);

        }
        catch (err) {

            if (err.status == 401) {
                nav('/')
                alert("Please login");
            }


        }
    }

    const RestorePosts=async(id)=>{
        try{
            console.log(id);
            const res=await axios.put(`http://localhost:8080/confess/posts/restore/${id}`,{},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            alert(res.data.message);

        }
        catch(err){
            console.log("Error",err);
            
        }
    }

    useEffect(() => { fetchDeletedPosts() }, [])

    return (
        <>
            <NavbarTop pageTitle={"Bin"} />

        <div className="posts-container">
                            {deletedPosts && deletedPosts.length > 0 ? (
                                deletedPosts.map((post, idx) => (
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
                                                    style={{ textDecoration: "none", border: "none" }} onClick={()=>{RestorePosts(post.id)}}
                                                >
                                                    <RotateCcw size={20} color="gray" />
                                                    <span style={{color:"grey",padding:"10px"}}>Restore</span>
                                                    
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
    )
}

export default Bin

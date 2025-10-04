import { Plus, UserRound, Heart, LogOutIcon } from "lucide-react";
import "./navbar.css";
import { Link, NavLink } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios"

const Navbar = () => {
    const token = localStorage.getItem("accessToken") || null;
    const [user, setUser] = useState();

    const fetchUserDashboard = async () => {
        try {
            let res = await axios.get("http://localhost:8080/confess/auth/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(res.data.result);
        } catch (err) {
            console.log(err.response.status === 401)
            if (err.response.status === 401) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
            else {
               alert("Please login");
            }
        }
    };

    const LogOut=async()=>{
         
        try{
           
            const res=await axios.put("http://localhost:8080/confess/auth/logout",{},{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            })
            if(res.status==200){
                alert("Successfully logged out")
            }
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            fetchUserDashboard();
        }
        catch(err){
            console.log("Error logging out:",err);
        }
    }

    useEffect(() => { fetchUserDashboard() }, [])

    return (
        <nav className="navbar">
            <div className="navbar-left" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Heart size={40} color="white" style={{ borderRadius: "50px", padding: "10px", background: "linear-gradient(to right,#600fa1, #1525cf)" }} />
                <h1 style={{ fontSize: "20px" }}>Confess</h1>
            </div>

            <div className="navbar-right">
                {user ? (
                    <>
                        <NavLink to={'/create'}><button className="navbar-btn"><Plus size={12} /> New confession</button></NavLink>
                        <NavLink to={'/profile'} style={{ textDecoration: "none" }} className="navbar-pfp"><UserRound size={19} /></NavLink>
                       <button style={{border:"none"}} onClick={LogOut}> <LogOutIcon color="blue"/> </button>
                    </>
                ) : (
                    <NavLink className="navbar-btn" to={'/auth'} >Sign In / Sign Up</NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar
import { Plus, UserRound, Heart } from "lucide-react";
import "./navbar.css";
import { Link, NavLink } from "react-router";

const Navbar = () => {
    const token = JSON.parse(localStorage.getItem("accessToken"))||null;

    return (
        <nav className="navbar">
            <div className="navbar-left" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Heart size={40} color="white" style={{ borderRadius: "50px", padding: "10px", background: "linear-gradient(to right,#600fa1, #1525cf)" }} />
                <h1 style={{ fontSize: "20px" }}>Confess</h1>
            </div>

            <div className="navbar-right">
                {token ? (
                    <>
                        <button className="navbar-btn"><Plus size={12} /> New confession</button>
                        <span className="navbar-pfp"><UserRound size={19} /></span>
                    </>
                ) : (
                    <NavLink className="navbar-btn" to={'/auth'} >Sign In / Sign Up</NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar
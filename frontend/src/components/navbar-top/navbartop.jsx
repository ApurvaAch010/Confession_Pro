import { NavLink } from "react-router"
import { Heart, ArrowLeft } from "lucide-react"
import "./navbartop.css"

const NavbarTop = (props) => {
    return (
        <>
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
                    <h1 style={{ fontSize: "20px", marginTop: "5px", paddingLeft: "5px" }}>{props.pageTitle}</h1>
                </div>
            </div>
        </>
    )
}

export default NavbarTop
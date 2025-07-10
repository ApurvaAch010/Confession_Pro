import { Plus, UserRound,Heart } from "lucide-react";
import "../styles/navbar.css";

const Navbar=()=>{
    return (
        <>
        <nav className="navbar">
            <div className="navbar-left">
                 <Heart size={40} color="white" style={{ top: "30px", borderRadius: "50px", padding: "10px", background: "linear-gradient(to right,#600fa1, #1525cf)" }} />
                <h1 style={{paddingTop:"2px",fontSize:"20px"}}>Confess</h1>
            </div>
            <div className="navbar-right">
                <button className="navbar-btn"><Plus size={12}/>  New confession</button>
                <span className="navbar-pfp"><UserRound size={19}/></span>
            </div>
        </nav>
        </>
    )
}
export default Navbar;
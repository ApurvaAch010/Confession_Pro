import { useEffect, useRef, useState } from "react";
import { Shield, Lock, Users, Heart, CloudCog } from "lucide-react";
// import "../styles/form.css"
import "./form.css";
import axios from "axios"
import Loading from "../loader/loading";


const AuthForm = () => {

    const [signup, setSignup] = useState(false);
    const [errmsg, setErrmsg] = useState("");
    const emailRef = useRef();
    const passwordRef = useRef();
    const usernameRef = useRef();
    const confirmPasswordRef = useRef();
    const signInemailRef = useRef();
    const signInpasswordRef = useRef();
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();




    const createAccount = async (e) => {

        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const username = usernameRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;
        await axios.post('http://localhost:8080/confess/auth/register', {
            email,
            password,
            username,
            confirmPassword
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data.message)
                alert(response.data.message)
            })
            .catch(error => {
                if (error.response) {
                    console.log("Backend response error:", error.response.data);
                    alert(error.response.data.message || "Something went wrong");
                } else {
                    console.log("Network or other error:", error.message);
                }
            })




    }
    const signIn = async (e) => {


        e.preventDefault();
        const email = signInemailRef.current.value;
        const password = signInpasswordRef.current.value;
        // cosnsole.log("email:", email, "password:", password)
        await axios.post('http://localhost:8080/confess/auth/login', {
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setAccessToken(response.data.accessToken)
                setRefreshToken(response.data.refreshToken)
                localStorage.setItem("accessToken", accessToken)
                localStorage.setItem("refreshToken", refreshToken)
            })
            .catch(error => {
                console.log("error", error)

            })

    }

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1700);
    }, [])


    return (

        <>

            {
                loading ? <Loading /> :
                    <div className="main">
                        <div className="main-text">
                            <Heart size={50} color="white" style={{ marginTop: signup ? "180px" : "40px", borderRadius: "50px", padding: "10px", background: "linear-gradient(to right,#600fa1, #1525cf)" }} />
                            <h1>Confess</h1>
                            <p style={{ color: "gray" }}>Share your thoughts anonymously</p>
                        </div>
                        <div className="box" style={{ marginTop: "10px", height: signup ? "610px" : "420px" }}>

                            <div className="top">
                                <span><Shield size={15} />Anonymous</span>
                                <span><Lock size={15} /> Secure</span>
                                <span><Users size={15} /> Safe Space</span>
                            </div>

                            <div className="switch">
                                <button className="switch-btn" onClick={() => { setSignup(!signup) }} style={{ background: signup ? "white" : "rgb(182, 177, 177)", padding: "7px", borderRadius: '10px' }}>Sign IN</button>
                                <button className="switch-btn" onClick={() => { setSignup(!signup) }}
                                    style={{ background: signup ? "rgb(182, 177, 177)" : "white", padding: "7px", borderRadius: '10px' }}>Sign Up</button>
                            </div>


                            {
                                signup ? <div className="form">
                                    <label htmlFor="">Username</label>
                                    <input type="text" placeholder="Choose your username" ref={usernameRef} />
                                    <label htmlFor="">Email</label>
                                    <input type="email" placeholder="your@email.com" ref={emailRef} />
                                    <label htmlFor="">Password</label>
                                    <input type="password" placeholder="Create a password" ref={passwordRef} />
                                    <label htmlFor="">Confirm Password</label>
                                    <input type="password" placeholder="Confirm your password" ref={confirmPasswordRef} />

                                    <button className="submit-btn" onClick={(e) => { createAccount(e) }}>Create Account</button>
                                </div> :
                                    <div className="form">
                                        <label htmlFor="">Email</label>
                                        <input type="email" placeholder="your@email.com" ref={signInemailRef} />
                                        <label htmlFor="">Password</label>
                                        <input type="password" placeholder="Enter your password" ref={signInpasswordRef} />

                                        <button className="submit-btn" onClick={(e) => { signIn(e) }}>Sign In</button>
                                    </div>
                            }
                        </div>
                        <p style={{ color: "gray" }}>By continuing, you agree to out Terms of Services and Privacy Policy</p>
                    </div>
            }

        </>
    )
}
export default AuthForm;
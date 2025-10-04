import { Eye, Heart, MoveLeft, Send, Shield } from "lucide-react";
import "./createconfess.css";
import { useRef, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router";

const CreateConfession = () => {

  const [anonymousPost, setAnonymousPost] = useState(false)
  const nav=useNavigate();

  const accessToken = localStorage.getItem("accessToken") || null;

  const titleRef = useRef();
  const contentRef = useRef();
  const anonymityRef = useRef();

  const handleAnonymity = () => {
    setAnonymousPost(!anonymousPost)
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const content = contentRef.current.value;
    const is_anonymous = anonymousPost;
    try {
      const res = await axios.post("http://localhost:8080/confess/posts/create", {
        title,
        content,
        is_anonymous,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }

      })
      alert(res.data.message);
      nav("/");
    }
    catch (err) {
      console.log("Error:", err.data);
    }

  }

  return (
    <>
      <div className="content-top">
        <div className="content-main">
          <div className="left-content">
            <NavLink to="/" style={{textDecoration:"none",color:"black"}}>
            <MoveLeft className="icon" />
            <p>Back</p></NavLink>
          </div>
          <div className="right-content">
            <Heart size={30} className="icon-heart" color="white" />
            <h1>New Confession</h1>
          </div>

        </div>
      </div>
      <div className="confess-main" style={{ background: "aliceblue", width: "100%", height: "160vh" }}>

        <div className="box-confess">
          <div className="top-confess">
            <div className="top-h1">
              <h1 style={{ fontSize: "20px" }}>Share Your Thoughts</h1>
            </div>
            <div className="logo">
              <span><Shield size={20} />Anonymous</span>
            </div>

          </div>
          <div className="confess-body">
            <div className="logo-body">
              <Shield size={15} />
            </div>
            <div className="confess-subbody">
              <p>Your confession will be posted anonymously. We don't store any identifying information.</p>
            </div>
          </div>
          <div className="write-confession" style={{ top: "20px", position: "relative" }}>
            <div className="write-confession-top">
              <h1 >Your confession</h1>
            </div>

            <div className="input-box">
              <input type="text" name="" id="" placeholder="Title" className="input-box-title" ref={titleRef} />
              <textarea className="input-box-confession" id="" placeholder="What's on your mind? Share your feeling,thought and experiences....." ref={contentRef} />
            </div>

            <div className="anonymous-selection">
              <div className="selection-left">
                <div className="eye-icon">
                  <Eye color="purple" />
                </div>
                <div className="selection-left-content">
                  <div className="left-content-top">
                    <h1>Anonymous Posting</h1>
                  </div>
                  <div className="left-content-bottom">

                    {
                      anonymousPost ?
                       <p>Your username will be shown</p>  :

                        <p>Your identity will be hidden</p>
                    }

                  </div>
                </div>
              </div>

              <div className="selection-right">

                <button className="selection-right-button" onClick={handleAnonymity} ref={anonymityRef}>
                  {
                    anonymousPost ?
                      "Public" : "Anonymous"
                  }
                </button>

              </div>
            </div>



          </div>
          <div className="bottom-buttons">

            <NavLink to="/"><button className="cancel-button">Cancel</button></NavLink>


            <button className="post-button" onClick={(e) => { handlePostSubmit(e) }}>   <Send size={"20px"} color="white" style={{ paddingRight: "5px" }} />Post Confession</button>

          </div>
        </div>


        <div className="community-guidelines">
          <div className="community-guidelines-title">
            <h2>Community Guidelines</h2>
          </div>
          <div className="community-guidelines-body">
            <ol>
              <li> Be respectful and kind to others</li>
              <li>No hate speech or harassment</li>
              <li>Keep confessions appropriate and legal</li>
              <li>Respect others' privacy and anonymity</li>
            </ol>
          </div>
        </div>




      </div>
    </>

  )
}

export default CreateConfession;
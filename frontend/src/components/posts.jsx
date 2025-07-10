import { Clock, Heart, MessageCircle, User } from "lucide-react";
import "../styles/posts.css";
const Posts = () => {
    return (
        <>
            <div className="posts-container">
                <div className="posts">
                    <div className="title">
                        <div className="profile">
                            <User size={30} color="purple" />
                        </div>
                        <div className="title-text">
                            <h1>Anonymous</h1>
                            <div className="title-text-sub">
                            <p><Clock size={10}/>Time</p><span>Your confession</span>
                            </div>
                        </div>
                    </div>
                    <div className="body">
                        This is body
                    </div>
                    <div className="footer">
                        <div className="like">
                            <Heart size={20} color="gray" />
                            <span>0</span>
                        </div>
                        <div className="comment">
                            <MessageCircle size={20} color="gray" />
                            <span>0</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}
export default Posts;
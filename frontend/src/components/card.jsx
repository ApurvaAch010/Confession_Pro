import "../styles/card.css";
import { Heart, MessageCircle, TrendingUp } from "lucide-react";
const CardComponent=()=>{
    return(<div className="cards">
      <div className="card1">
        <div className="card-left">
          <Heart size={30} color="purple" />
        </div>
        <div className="card-right">
          <h1 className="title">Total confessions</h1>
          <p className="content">100</p>
        </div>
      </div>
      <div className="card2">
        <div className="card-left">
           <TrendingUp  size={30} color="blue" />
        </div>
        <div className="card-right">
          <h1 className="title">Total confessions</h1>
          <p className="content">100</p>
        </div>
      </div>
      <div className="card3">
        <div className="card-left">
          <MessageCircle size={30} color="green" />
        </div>
        <div className="card-right">
          <h1 className="title">Total confessions</h1>
          <p className="content">100</p>
        </div>
      </div>
    </div>
    )
}
export default CardComponent;
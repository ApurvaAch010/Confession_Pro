
import { Heart, MessageCircle, TrendingUp } from "lucide-react";
import CardComponent from "./CardComponent/card";
import Posts from "./PostComponent/posts";
import Navbar from "./navbar/Navbar";

const HomeBody = () => {
  return (
    <>
    <div className="cards">
      <CardComponent confessTitle="Total Confessions" confessContent="100" pictureComponent={Heart} pictureColor="purple" classNam="card1" />
      <CardComponent confessTitle="Total Likes" confessContent="100" pictureComponent={TrendingUp} pictureColor="blue" classNam="card2" />
      {/* <CardComponent confessTitle="Total Comments" confessContent="100" pictureComponent={MessageCircle} pictureColor="green" classNam="card3"/> */}
    </div>
      <Posts />
    </>
  );
};

export default HomeBody;

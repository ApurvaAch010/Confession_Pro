
import { Heart, MessageCircle, TrendingUp } from "lucide-react";
import CardComponent from "./CardComponent/card";
import Posts from "./PostComponent/posts";
import axios from "axios";
import { useEffect, useState } from "react";

const HomeBody = () => {
  const [confessionCount,setConfessionCount]=useState();
  const [likes,setLikes]=useState();
  const token=localStorage.getItem("accessToken")||null;
  const FetchUser=async()=>{
    try {
            let res = await axios.get("http://localhost:8080/confess/auth/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setConfessionCount(res.data.result.confessionCount);
            setLikes(res.data.result.totalLikes);
            
        } catch (err) {
            // console.log("Error fetching dashboard", err);

        }
  }

  useEffect(()=>{
    FetchUser();
  },[])


  return (
    <>
    <div className="cards">
      <CardComponent confessTitle="Total Confessions" confessContent={confessionCount} pictureComponent={Heart} pictureColor="purple" classNam="card1" />
      <CardComponent confessTitle="Total Likes" confessContent={likes} pictureComponent={TrendingUp} pictureColor="blue" classNam="card2" />
    </div>
      <Posts />
    </>
  );
};

export default HomeBody;

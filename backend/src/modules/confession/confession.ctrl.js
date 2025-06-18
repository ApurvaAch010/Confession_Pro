import AppErr from "../../exception/error.js"
import pool from "../../config/database.connection.js";

class Confession{

    create=async(req,res,next)=>{
        try{
            const {title,content,is_anonymous=true}=req.body;

            let user=req.user

            pool.query(
            "INSERT INTO confessions (user_id, content, is_anonymous, tilte) VALUES (?, ?, ?, ?)",
            [user.id, content, is_anonymous, title],
            (err, results) => {
                if (err) {
                    console.log(err)
                       return res.status(404).json({ error: "Database error" });
                }
                // console.log("hello")
                res.status(201).json({
                    message: "Confession created successfully",
                    confessionId: results.insertId
                });
            })

        
            

        }
        catch(err){
            console.log(err)
            throw new AppErr({message:"Error in create confession",code:500});
        }
    }
    getAll=async(req,res,next)=>{
        try{

            pool.query('SELECT * from confessions',(err,results)=>{
                if(err){
                    console.log(err)
                       return res.status(404).json({ error: "Database error" });
                }
                res.status(200).json({
                    result:{
                        confessions:results,
                        count:results.length
                    }
                })
            })

        }
        catch(err){
            throw new AppErr({message:"Error in getAll confession",code:500});
        }
    }
    update=async(req,res,next)=>{
        try{
            const id=req.params.id

        }
        catch(err){
            throw new AppErr({message:"Error in update confession",code:500});
        }
    }
    delete=async(req,res,next)=>{
        try{
            const id=req.params.id

        }
        catch(err){
            throw new AppErr({message:"Error in delete confession",code:500});
        }
    }

}

const Confess =new Confession()
export default Confess
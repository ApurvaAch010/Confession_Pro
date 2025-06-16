import AppErr from "../../exception/error.js"


class Confession{

    create=async(req,res,next)=>{
        try{
            const {title,content}=req.body;
            

        }
        catch(err){
            throw new AppErr({message:"Error in create confession",code:500});
        }
    }
    getAll=async(req,res,next)=>{
        try{

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
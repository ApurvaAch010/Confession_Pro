import AppErr from "../../exception/error"

class Authorization{
    register=(req,res,next)=>{
        try{
            res.status(200).json({
                message:"Hello world"
            })
        }
        catch(err){
            throw new AppErr({message:"Register is not responsding"})
        }
    }
}

const Auth=new Authorization()
export default Auth
import AppErr from "../../exception/error.js"

class Authorization{
    register=(req,res,next)=>{
        try{
           let body=req.body;
           console.log(body)
           req.json({
            result:{},
            message:"Successfully registered",
            meta:null,
           })
        }
        catch(err){
            throw new AppErr({message:"Register is not responsding"})
        }
    }
    
    activation=(req,res,next)=>{
        try{
            res.status(200).json({
                message:"Hello activation"
            })
        }
        catch(err){
            throw new AppErr({message:"Problem in auth activation"})
        }
    }
    login=(req,res,next)=>{
        try{
            res.status(200).json({
                message:"Hello login"
            })
        }
        catch(err){
            throw new AppErr({message:"Problem while logging in.Please try again"})
        }
    }
    dashboard=(req,res,next)=>{
        try {
            res.status200.json({
                message:"dashboard"
            })

            
        } catch (error) {
            throw new AppErr({message:"Problem while loading dashboard"})
        }
    }

}

const Auth=new Authorization()
export default Auth
import mysql from "mysql"
import dotenv from "dotenv"
dotenv.config()


let pool= mysql.createConnection({
    host:process.env.MY_SQL_HOST,
    database:process.env.MY_SQL_DB,
    user:process.env.MY_SQL_USER,
    password:process.env.MY_SQL_PASS
})
// console.log("DB connected")

pool.connect((err)=>{
    if(err){
     console.log("Problem in conncetion database:",err)
    }
    console.log("Databse connected");
})

export default pool
const pool = require("../database/queries")
const {hashPassword, comparePassword} = require("../lib/bcrypt")
const {generateToken} = require("../lib/jwt")

 
class AuthController {
    static register = async (req,res,next)=>{
        // role = admin || user
try {


    const {email, gender, password,role } = req.body
    const hashPass = hashPassword(password)
   const insertSql = `INSERT INTO users (email,gender,password,role ) 
    VALUES($1,$2,$3,$4) 
    RETURNING *`
      
    const result = await pool.query (insertSql,[email,gender,hashPass,role])
    res.status(201).json(result.rows[0])
    
} catch (err) {
  next(err)
    
}
    }

    static login = async (req,res,next)=> {
        try {

const {email,password} = req.body

// search user by email

// if exist compare password
// else wrong email or password

const searchSql = `SELECT 
                    *   
                    FROM
                      users
                        WHERE email = $1`
const result = await (searchSql,[email])


if(result.rows.length !== 0){
//    kalau ada compare pass
const foundPass = result.rows[0]
if (comparePassword(password,foundPass.password)){

     // generateToken
     const accessToken = generateToken({
        email: foundPass.email,
        role: foundPass.role
    })

    res.status(200).json({
        message: "Login success.........",
        accessToken
    })
}else{
    res.status(400).json({message : "WRONG EMAIL OR PASSWORD"})
}
}

        }catch(err) {
            next(err)
        }
    }
}

module.exports = AuthController
const jwt = require("jsonwebtoken")
const SECRET_KEY = "passwordrahasia"

const generateToken= (payload) =>{
    return jwt.sign(payload,SECRET_KEY)
}


const veryfyToken = (token) => { 
    return jwt.verify(token,SECRET_KEY)
} 

module.exports = {
    generateToken,
    veryfyToken
}
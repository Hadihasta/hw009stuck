const {verifyToken} = require("../lib/jwt.js")
const pool = require("../database/queries.js")


// PENGECEKAN TOKEN setelah login
const authentication = async (req, res, next) => {
    try {
    
        if(req.headers.authorization) {

            
            const accessToken = req.headers.authorization.split(" ")[1]
            
            const {id, email, role} = verifyToken(accessToken)

            // SEARCH USER BY ID

            const searchSQL = `
                    SELECT
                        *
                    FROM
                        users
                    WHERE id = $1
            `

            const result = await pool.query(searchSQL, [id])

            if(result.rows.length > 0) {

                const foundUser = result.rows[0]

                // Simpan data user kedalam request
                req.loggedUser = {
                    id: foundUser.id,
                    email: foundUser.email,
                    role: foundUser.role
                }

                next();
            } else {
                throw {name: "TIDAK DI TEMUKAN"}
            }

        } else {
            throw {name: "TIDAK DI TEMUKAN"}
        }

    } catch(err) {
        next(err);
    }
}

// PENGECEKAN ROLE setelah login
const authorization = async (req, res, next) => {

    try {

        console.log(req.loggedUser)
        const {role} = req.loggedUser;

        if(role === "admin") {
            // Allowed to execute
            next();
        } else {
            throw {name: "TIDAK ADA ACCES"}
        }
    } catch(err) {
        next(err);
    }
}


module.exports = {
    authentication,
    authorization
}
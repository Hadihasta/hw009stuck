const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const pool = require("./database/queries.js")
const router = express.Router()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const morgan = require("morgan")



app.use(morgan("tiny"))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




// import
const movies = require("./smallapp/movies.js");
const users = require("./smallapp/users.js");
const authRouter = require("./smallapp/auth.route.js")
const errorHandler = require("./middlewares/errorHandler.js")


// json yang dikirim akan menjadi json juga saat di terima 
app.use(bodyParser.json())






// connect to http method
app.use(router)
router.use("/auth",authRouter)
app.use("/movies", movies);
app.use("/users",  users);
app.use(errorHandler)


//connect to database
pool.connect((err, res) => {
    
    console.log("connected");
  });
  
  app.listen(3001);
  
const express = require("express");
const router = express.Router();
const pool = require("../database/queries.js");
const {authorization} = require("../middlewares/auth.js")


// GET , POST , PUT , DELETE

router.get("/", (req, res) => {
  const sql = `SELECT * FROM users `
    pool.query(sql, (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json(result.rows);
    });
  });



  router.get("/:id", (req, res) => {
    const usersId = req.params.id; 
    pool.query("SELECT * FROM users WHERE users.id = $1", [usersId], (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json(result.rows);
    });
  });
  






router.post ("/",authorization,(req,res) => {

if ( !req.body.email ||
    !req.body.gender||
    !req.body.password||
    !req.body.role){
      res.status(400).json({ messasge : "Register failed"})
    }else {

      const email = req.body.email
      const gender = req.body.gender
      const password = req.body.password
      const role = req.body.role

      pool.query("SELECT MAX(id) AS max_id FROM users",(error,result)=> {
        if (error){
          throw error
        }
        let newId = result.rows[0].max_id
        newId++
        pool.query(`INSERT INTO users (id,email,gender,password,role) VALUES ($1, $2,$3,$4,$5)`,[newId,email,gender,password,role],(error,result)=>{
          if(error) {
            throw error
          }
          res.status(200).json({messsage : "Register Succes" , location : "/users/" + newId})
        })

      })
    }
 })

 

 router.put('/:id', authorization,(req, res) => {
  const email = req.body.email;
  const gender = req.body.gender;
  const password = req.body.password;
  const role = req.body.role;

  if (!email || !gender || !password || !role) {
      res.status(400).json({ message: "Register failed" });
  } else {
      pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id], (error, result) => {
          if (error) {
              throw error;
          }
          if (result.rows.length > 0) {
              pool.query(`UPDATE users SET email = $1, gender = $2, password = $3, role = $4 WHERE id = $5`, 
                         [email, gender, password, role, req.params.id], (updateError, updateResult) => {
                  if (updateError) {
                      throw updateError;
                  }
                  res.status(200).json({ message: `User ID ${req.params.id} has been updated` });
              });
          } else {
              pool.query(`INSERT INTO users (id, email, gender, password, role) VALUES ($1, $2, $3, $4, $5)`, 
                         [req.params.id, email, gender, password, role], (insertError, insertResult) => {
                  if (insertError) {
                      throw insertError;
                  }
                  res.status(200).json({ message: `User register with ID ${req.params.id} success` });
              });
          }
      });
  }
});





router.delete('/:id', authorization,function (req,res){
  const userId = req.params.id
  
  
    if ((userId) <= 0) {
        res.status(400).json({ message: "Bad request" });
    } else{
      pool.query("SELECT FROM users WHERE id = $1", [userId],(error,result)=>{
        if (error){
          throw error
        }
  
        if(result.rows.length > 0){
          pool.query ("DELETE FROM users WHERE id = $1",[userId],(deleteError,deleteResult) =>{
            if(deleteError){
              throw deleteError
            }
  
            res.status(200).json ({ message : `movie with id  ${userId} has deleted  `})
          })
        }else{
          res.status(200).json({ message: " not found"})
        }
  
      })
    }
  
  })






  module.exports = router;
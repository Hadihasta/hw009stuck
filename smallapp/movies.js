const express = require("express");
const router = express.Router();
const pool = require("../database/queries.js");
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const {authorization} = require("../middlewares/auth.js")

// show seluruh data dari database (table movies) 
router.get("/", (req, res) => {
  const pgnationstr = pagination(req.query)
  sql = `SELECT movies.title, COUNT(*) AS movie_count
  FROM movies
  GROUP BY movies.title ${pgnationstr} `
    pool.query(sql, (error, result) => {
            
      if (error) {
        throw error;
      }
      res.status(200).json(result.row)
    });
  });


// Get = retrieve data /  show spesifik id

router.get("/:id", (req, res) => {
    const moviesId = req.params.id; 
    pool.query("SELECT * FROM movies WHERE movies.id = $1", [moviesId], (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json(result.rows);
    });
  });
  



// ADMIN ONLY



// post = create new data 

router.post('/',authorization, function(req, res) {
    if (!req.body.title || 
        !req.body.genres || 
        !req.body.year.toString().match(/^[0-9]{4}$/)) {
        res.status(400).json({ message: "Bad request" });
    } else {
        const title = req.body.title
        const genres = req.body.genres
        const year = req.body.year

        // Retrieve the maximum existing ID from the movies table
        pool.query("SELECT MAX(id) AS max_id FROM movies", (error, result) => {
            if (error) {
                throw error;
            }
            let newId = result.rows[0].max_id ; 
            newId++; // Increment the ID for the new movie

            // Insert the new movie data into the movies table
            pool.query("INSERT INTO movies (id, title, genres, year) VALUES ($1, $2, $3, $4) ", [newId, title, genres, year], (error, result) => {
                if (error) {
                    throw error;
                }
                res.status(200).json({ message: "New movie created.", location: "/movies/" + newId });
            });
        });
    }
});


//  PUT = update data 

router.put('/:id',authorization, function(req, res) {
  const { title, genres, year } = req.body;
  const movieId = req.params.id;

  if (!title || 
    !genres || 
    !year.toString().match(/^[0-9]{4}$/)) {
      res.status(400).json({ message: "Bad request" });
  } else {
      // Check if the movie exists in the database
      pool.query('SELECT * FROM movies WHERE id = $1', [movieId], (error, result) => {
          if (error) {
              throw error;
          }

          if (result.rows.length > 0) {
              // Movie exists, update it
              pool.query('UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4',
                         [title, genres, year, movieId], (updateError, updateResult) => {
                  if (updateError) {
                      throw updateError;
                  }
                  res.status(200).json({ message: `Movie with ID ${movieId} updated.` });
              });
          } else {
              // Movie doesn't exist, create a new one
              pool.query('INSERT INTO movies (id, title, genres, year) VALUES ($1, $2, $3, $4)',
                         [movieId, title, genres, year], (insertError, insertResult) => {
                  if (insertError) {
                      throw insertError;
                  }
                  res.status(201).json({ message: `New movie created with ID ${movieId}.` });
              });
          }
      });
  }
});


// delete = hapus data
router.delete('/:id',authorization,function (req,res){
const movieId = req.params.id


  if ((movieId) <= 0) {
      res.status(400).json({ message: "Bad request" });
  } else{
    pool.query("SELECT FROM movies WHERE id = $1", [movieId],(error,result)=>{
      if (error){
        throw error
      }

      if(result.rows.length > 0){
        pool.query ("DELETE FROM movies WHERE id = $1",[movieId],(deleteError,deleteResult) =>{
          if(deleteError){
            throw deleteError
          }

          res.status(200).json ({ message : `movie with id  ${movieId} has deleted  `})
        })
      }else{
        res.status(200).json({ message: " not found"})
      }

    })
  }

})


const pagination =(params) => {
  if(Object.entries(params).length === 0){
    return " "
  }else{
   let {limit,page} = params

   limit = limit || DEFAULT_LIMIT
   page = page || DEFAULT_PAGE

   return `LIMIT ${limit} OFFSET ${(page -1) * limit}`
  }
}

  module.exports = router;
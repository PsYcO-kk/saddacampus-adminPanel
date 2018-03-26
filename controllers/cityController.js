var mysql = require('mysql');
// mysql connection
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mydb'
});

module.exports = function(app){
  // get a list of cities from the db
  app.get('/city', function(req, res){
    pool.getConnection(function(err, connection){
      if (err) {
        throw err;
        res.status(422).send({error: err.message});
      }
      else{
        pool.query('SELECT * FROM city', function(error, results){
          if (error) {
            throw error;
            res.status(422).send({error: error.message});
          }
          else res.render('adminPanel.ejs', {results: results});
        });
      }
    });
  });

  // add a city to the db
  app.post('/city', function(req, res){
    if(req.body.name != ""){
      pool.getConnection(function(err, connection){
        if (err) {
          throw err;
          res.status(422).send({error: err.message});
        }
        else{
          pool.query("INSERT INTO city (city_name) VALUES (\'"+req.body.city_name+"\')", function(error, results){
            if (error) {
              throw error;
              res.status(422).send({error: error.message});
            }
            else res.end('done');
          });
        }
      });
    }
    else res.end("Invalid Data received.");
  });

  // update a city details in the db
  app.put('/city', function(req, res){
    if(req.body.id != "" && req.body.city_name != ""){
      pool.getConnection(function(err, connection){
        if (err) {
          throw err;
          res.status(422).send({error: err.message});
        }
        else {
          pool.query("UPDATE city SET city_name = \'"+req.body.city_name+"\' WHERE id = "+req.body.id, function(error, results){
            if (error) {
              throw error;
              res.status(422).send({error: error.message});
            }
            else res.end('done');
          });
        }
      });
    }
    else res.end("Invalid Data received.");
  });

  // delete a city from the db
  app.delete('/city', function(req, res){
    if(req.body.id != ""){
      pool.getConnection(function(err, connection){
        if (err) {
          throw err;
          res.status(422).send({error: err.message});
        }
        else{
          pool.query("DELETE FROM city WHERE id = "+req.body.id, function(errors, results){
           if (errors) {
             throw errors;
             res.status(422).send({error: errors.message});
           }
          });
          pool.query("SELECT restaurant_id FROM city_has_restaurant WHERE city_id = "+req.body.id, function(error, result){
            if (error) {
              throw error;
              res.status(422).send({error: error.message});
            }
            else{
              for(let i=0;i<result.length;i++){
                pool.query("DELETE FROM restaurant WHERE id = "+result[i].restaurant_id, function(errors, results){
                 if (errors) {
                   throw errors;
                   res.status(422).send({error: errors.message});
                 }
                });
              }
            }
          });
          pool.query("DELETE FROM city_has_restaurant WHERE city_id = "+req.body.id, function(errors, results){
           if (errors) {
             throw errors;
             res.status(422).send({error: errors.message});
           }
          });
          res.end('done');
        }
      });
    }
    else res.send("Invalid Data received.");
  });
}

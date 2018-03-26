var mysql = require('mysql');
// mysql connection
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mydb'
});

module.exports = function(app){
  // add a shift of restaurant
  app.post('/restaurant-timing', function(req, res){
    if(req.body.restaurant_id != "" && req.body.timing_start != "" && req.body.timing_close != ""){
      console.log(req.body);
      pool.getConnection(function(err, connection){
        if (err) {
          throw err;
          res.status(422).send({error: err.message});
        }
        else{
          pool.query("INSERT INTO restaurant_timings (restaurant_id, timing_start, timing_close) VALUES ("+req.body.restaurant_id+", \'"+req.body.timing_start+"\', \'"+req.body.timing_close+"\')", function(error1, result1){
            if (error1) {
              throw error1;
              res.status(422).send({error: error1.message});
            }
            else res.end('done');
          });
        }
      });
    }
    else {
      res.end("Invalid Data received.");
    }
  });

  // update a shift of restaurant
  app.put('/restaurant-timing', function(req, res){
    if(req.body.timing_id != "" && req.body.timing_start != "" && req.body.timing_close != ""){
      pool.getConnection(function(err, connection){
        if (err) {
          throw err;
          res.status(422).send({error: err.message});
        }
        else{
          pool.query("UPDATE restaurant_timings SET timing_start = \'"+req.body.timing_start+"\', timing_close = \'"+req.body.timing_close+"\' WHERE timing_id = "+req.body.timing_id, function(error, results){
            if (error) {
              throw error;
              res.status(422).send({error: error.message});
            }
            else res.end('done');
          });
        }
      });
    }
    else{
      res.end("Invalid Data received.");
    }
  });

  // delete a shift of restaurant
  app.delete('/restaurant-timing', function(req, res){
    if(req.body.timing_id != ""){
      pool.getConnection(function(err, connection){
        if (err) {
          throw err;
          res.status(422).send({error: err.message});
        }
        else{
          pool.query("DELETE FROM restaurant_timings WHERE timing_id = "+req.body.timing_id, function(errors, results){
           if (errors) {
             throw errors;
             res.status(422).send({error: errors.message});
           }
           else res.end('done');
          });
        }
      });
    }
    else{
      res.end("Invalid Data received.");
    }
  });
}

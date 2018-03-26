var mysql = require('mysql');
// mysql connection
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mydb'
});

module.exports = function(app){
  // get a list of restaurants in a city
  app.get('/:cname/restaurant', function(req, res){
    pool.getConnection(function(err, connection){
      if (err) {
        throw err;
        res.status(422).send({error: err.message});
      }
      else{
        pool.query("SELECT * FROM restaurant r"
        +" INNER JOIN city_has_restaurant chr ON r.id = chr.restaurant_id"
        +" INNER JOIN city c ON chr.city_id  = c.id AND c.city_name = \'"+req.params.cname
        +"\' ORDER BY r.restaurant_name", function(error, result){
          if (error) {
            throw error;
            res.status(422).send({error: error.message});
          }
          else {
            for(let i=0;i<result.length;i++){

              pool.query("SELECT * FROM restaurant_timings WHERE restaurant_id = "+result[i].restaurant_id, function(errors, results){
                if (error) {
                  throw error;
                  res.status(422).send({error: error.message});
                }
                else result[i].timing = results;
                if(i == result.length-1) res.render('cityRestaurants.ejs', {result: result});
              });
            }
          }
        });
      }
    });
  });

  // add a restaurant in a city
  app.post('/:cname/restaurant', function(req, res){
    if(req.body.restaurant_name != "" && req.body.restaurant_address != "" && req.body.days_available != ""){
      pool.getConnection(function(err, connection){
        if (err) {
          throw err;
          res.status(422).send({error: err.message});
        }
        else{
          pool.query("INSERT INTO restaurant (restaurant_name, restaurant_address, days_available) VALUES (\'"+req.body.restaurant_name+"\', \'"+req.body.restaurant_address+"\', \'"+req.body.days_available+"\')", function(error1, result1){
            if (error1) {
              throw error1;
              res.status(422).send({error: error1.message});
            }
            else{
              pool.query("SELECT id FROM city WHERE city_name = \'"+req.params.cname+"\'", function(error2, result2){
                if (error2) {
                  throw error2;
                  res.status(422).send({error: error2.message});
                }
                else{
                  pool.query("INSERT INTO city_has_restaurant (city_id, restaurant_id) VALUES ("+result2[0].id+", "+result1.insertId+")", function(error3, result3){
                    if (error3) {
                      throw error3;
                      res.status(422).send({error: error3.message});
                    }
                    else res.end('done');
                  });
                }
              });
            }
          });
        }
      });
    }
    else {
      res.end("Invalid Data received.");
    }
  });

  // update a restaurant in the db
  app.put('/:cname/restaurant', function(req, res){
    if(req.body.id != "" && req.body.restaurant_name != "" && req.body.restaurant_address != "" && req.body.days_available != ""){
      pool.getConnection(function(err, connection){
        if (err) {
          throw err;
          res.status(422).send({error: err.message});
        }
        else{
          pool.query("UPDATE restaurant SET restaurant_name = \'"+req.body.restaurant_name+"\', restaurant_address = \'"+req.body.restaurant_address+"\', days_available = \'"+req.body.days_available+"\' WHERE id = "+req.body.id, function(error, results){
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

  // delete a restaurant from a city in db
  app.delete('/:cname/restaurant', function(req, res){
    if(req.body.id != ""){
      pool.getConnection(function(err, connection){
        if (err) {
          throw err;
          res.status(422).send({error: err.message});
        }
        else{
          pool.query("DELETE FROM restaurant WHERE id = "+req.body.id, function(errors, results){
           if (errors) {
             throw errors;
             res.status(422).send({error: errors.message});
           }
          });
          pool.query("DELETE FROM city_has_restaurant WHERE restaurant_id = "+req.body.id, function(errors, results){
           if (errors) {
             throw errors;
             res.status(422).send({error: errors.message});
           }
          });
          pool.query("DELETE FROM restaurant_timings WHERE restaurant_id = "+req.body.id, function(errors, results){
           if (errors) {
             throw errors;
             res.status(422).send({error: errors.message});
           }
          });
          res.end('done');
        }
      });
    }
    else{
      res.end("Invalid Data received.");
    }
  });
}

var session =	require('express-session');
var mysql = require('mysql');

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'mydb'
});

module.exports = function(app){
  // ‘secret‘ is used for cookie handling, etc. but we have to put some secret for managing Session in Express.
  app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

  var sess;

  app.get('/admin',function(req,res){
  	sess=req.session;
  	if(sess.username)
  	{
  		res.redirect('/city');
  	}
  	else{
  	res.render('adminLogin.ejs');
  	}
  });

  app.post('/login',function(req,res){
  	pool.getConnection(function(err, connection){
      if (err) {
        throw err;
        res.status(422).send({error: err.message});
      }
      else{
        pool.query("SELECT COUNT(username) AS num FROM users WHERE username = \'"+req.body.username+"\' AND password = \'"+req.body.password+"\'", function(error, results){
          if (error) {
            throw error;
            res.status(422).send({error: error.message});
          }
          else if(results[0].num == 1){
  					sess=req.session;
  					sess.username=req.body.username;
  					res.end('done');
  				}
  				else{
  					res.send("User not found");
  				}
        });
      }
    });
  });

  // app.get('/city',function(req,res){
  // 	sess=req.session;
  // 	if(sess.username)
  // 	{
  // 		res.render('adminPanel.ejs');
  // 	}
  // 	else
  // 	{
  // 		res.write('<h1>Please login first.</h1>');
  // 		res.end('<a href='+'/'+'>Login</a>');
  // 	}
	//
  // });

  app.get('/logout',function(req,res){

  	req.session.destroy(function(err){
  		if(err){
  			res.status(422).send({error: err.message});
  		}
  		else
  		{
  			res.redirect('/admin');
  		}
  	});

  });
}

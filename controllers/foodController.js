var mysql = require('mysql');
// mysql connection
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mydb'
});

module.exports = function(app){
}

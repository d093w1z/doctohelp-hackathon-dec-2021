var http = require('http');
var express = require('express');
var mysql = require('mysql');
const { application } = require('express');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "doctohelp"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("select * from data", function (err, result) {
      if (err) throw err;
    //   console.log(result);
  });
});

var app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('Doctohelp_site_template'));

app.get('/getdata', (req,res)=>{
    // console.log('data recorded '+ Date());
    con.query("select * from data", function (err, result) {
        if (err) throw err;
        // console.log(result);
        // res.send('HEY IT WORKS');
        res.send(result);
    });
});

app.get('/docs', (req,res)=>{
    var type = req.query.type;
    if(type){
        con.query("select * from data where type=\""+type + "\"", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }else{
        con.query("select * from data;", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
});

app.get('/clicked', (req, res)=>{
    con.query("insert into appointments values (NULL,\"" + Date()+"\");", function (err, result) {
        if (err) throw err;
        console.log("Appointment booked!");
    });
});

app.post('/signup',function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var cpassword = req.body.cpassword;
    if(cpassword === password){
        con.query("insert into users values (NULL,\"" + username +"\",\""+password+"\");", function (err, result) {
            if (err) throw err;
            // res.send(result);
        });
    }
    res.end();
});

app.post('/login',function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    con.query("select password from users where username=\"" + username + "\";", function (err, result) {
        if (err) throw err;
        // res.send(result);
        if(password == result[0].password){
            console.log("login success");
            req.session.user_id = 0;
            res.status(200).send('User logged in');
        }else{
            console.log("login failed "  + username + " "+ password + " " + result[0].password);
            res.status(401).send('Bad user/pass');
        }
    });
    res.end();
});

app.listen(8080);
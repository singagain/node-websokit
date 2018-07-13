var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var CONFIG = require('./config')

var MongoClient = mongodb.MongoClient;
// var DB_CONN_STR = 'mongodb://admin:admin@127.0.0.1:27017/duitang';
var DB_CONN_STR = `${CONFIG.protocol}${CONFIG.user}:${CONFIG.pwd}@${CONFIG.host}:${CONFIG.port}/${CONFIG.dbname}`;

console.log(DB_CONN_STR)
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.all('/registor',function(req,res){
  var username = req.body['username'];
  var pwd =  req.body['pwd'];
  var data =[{username:username,password:pwd}];

  function insertData(db){
      var conn = db.collection('admin');
      conn.insert(data,function(err,results){
        if(err){
          console.log(err);
          return;
        }else {
        req.session.username = username;
          res.redirect('/');
          db.close();
        }
      })
  }
  MongoClient.connect(DB_CONN_STR,function(err,db){
    console.log('连接成功');
    if(err){
      console.log(err);
      console.log('数据库连接失败')
      return;
    }else {
      console.log('数据库连接成功');
      insertData(db);
    }
  })
})
//登陆
router.all('/login',function(req,res){
  var username = req.body['username'];
  var pwd = req.body['pwd'];

  var data = {username:username,password:pwd}

  function findData(db){
      var conn = db.collection('admin');
      conn.find(data,{username:0,password:0}).toArray(function(err,results){
        if(err){
          console.log(err);
          return;
        }
        if(results.length>0){
          console.log(req.session)
            req.session.username = username;
          res.redirect('/')
        }else {
          res.redirect('/login')
        }
      })
  }
  if(username&&pwd){
    MongoClient.connect(DB_CONN_STR,function(err,db){
      if(err){
        console.log(err);
        return;
      }else {
        findData(db);
      }
    })
  }else {
    res.redirect('/login')
  }
});




module.exports = router;

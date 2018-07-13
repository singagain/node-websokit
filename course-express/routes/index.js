var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var async = require('async');
var CONFIG = require('./config')
// var app = require('express')();
// var server = require('http').createServer(app);




var MongoClient = mongodb.MongoClient;
var CONN_DB_STR = `${CONFIG.protocol}${CONFIG.user}:${CONFIG.pwd}@${CONFIG.host}:${CONFIG.port}/${CONFIG.dbname}`;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',username:req.session.username});
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});
router.get('/registor', function(req, res, next) {
  res.render('registor', { title: 'registor' });
});
router.get('/logout', function(req, res, next) {
  req.session.username = undefined;
  res.redirect('/');
});
router.get('/comment' ,function(req, res) {
  res.render('comment', { title: 'comment' });
});
router.get('/myspace' ,function(req, res) {
  res.render('mySpace', { title: '我的空间' });
});
router.get('/talk', function(req, res){
  var username = req.session.username; 
  if(username){
    res.render('talk', { title: 'talk',username:req.session.username});
  }else{
    res.send('<script>alert("登录超时，请重新登录");location.href="/login"</script>')
  }
  
  });
// room page
router.get('/room/:roomID', function (req, res) {
  var roomID = req.params.roomID;
  // var roomID = '111111';
  // 渲染页面数据(见views/room.hbs)
  res.render('room', {
    roomID: roomID,
  });
});
 


    
// 列表
router.get('/list', function(req, res) {
  var pageNo = req.query['pageNo'] || 1; //当前第x页
  var pageSize = 5; //每页显示5条
  var totalPage = 0; //共x页
  var count = 0; //共x条
  var fileImg = "";

  function findData(db) {
    var conn = db.collection('comment');
    // async.parallel([
    async.series([
      function(callback) {
        conn.find().toArray(function(err, results) {
          count = results.length;
          totalPage = Math.ceil(count/5);

          pageNo = pageNo>=totalPage ? totalPage : pageNo;
          pageNo = pageNo<1 ? 1 : pageNo;
          callback(null,'');
        })
      },
      function(callback) {
        //skip:从第几条开始显示数据, limit:显示多少条数据；sort:排序；
        conn.find({}).sort({_id:-1}).skip((pageNo-1)*5).limit(pageSize).toArray(function(err, results) {
          // console.log(results);

          callback(null, results)
        })
      }
    ], function(err, results) {
      res.render('list',
      {
        resData: results[1],
        count: count,
        totalPage: totalPage,
        pageNo: pageNo,
        fileImg:fileImg
      })
    })
  }

  MongoClient.connect(CONN_DB_STR, function(err, db) {
    console.log(123);
    findData(db)
  })


})
    
router.get('/detail',function(req,res){
  var cid = parseInt(req.query['cid']);
  console.log(cid);

  MongoClient.connect(CONN_DB_STR,function(err,db){
    if(err){
      console.log(err);
      return;
    }else {
      db.collection('comment').findOne({cid:cid},function(err,item){
        if(err){
          console.log(err);
          return;
        }else {
          console.log(item);
          res.render('detail',{item:item});
        }
      })
    }
  })
})

module.exports = router;

var express =require('express');
var router = express.Router();
var mongodb = require('mongodb');
var async = require('async');
var CONFIG = require('./config')

var MongoClient = mongodb.MongoClient;
var CONN_DB_STR = `${CONFIG.protocol}${CONFIG.user}:${CONFIG.pwd}@${CONFIG.host}:${CONFIG.port}/${CONFIG.dbname}`;
router.all('/talk',function(req,res){
  var title = req.body['title'];
  var val = req.body['val'];
  var fileImg = req.body['fileImg'];
  var username = req.session.username;

  function insertData(db){
    var conn = db.collection('comment');
    var ids = db.collection('ids');
 
  async.waterfall([
    function(callback){
       //自增
      ids.findAndModify(
        {name:'comment'},
        [['_id','desc']],
        {$inc:{cid:1}},
        {new:true},
        function(err,results){
          console.log(results)
          callback(null,results.value.cid);
        }
      )
    },
    function(cid,callback){
      var data = [{cid:cid,username:username,title:title,val:val,fileImg:fileImg}];
      conn.insert(data,function(err,results){
        if(err){
          console.log(err);
          return;
        }else {
          callback(null,'');
        }
        db.close();
      })
    }
  ],function(err,results){
    res.redirect('/list')//重定向到list
  })
}
if(!username){
  res.send('<script>alert("登录超时，请重新登录");location.href="/login"</script>')

}else {
  MongoClient.connect(CONN_DB_STR,function(err,db){
    if(err){
      console.log(err);
      return;
    }else {
      console.log('connect Success~');
      insertData(db);
    }
  })
}

})
module.exports = router;

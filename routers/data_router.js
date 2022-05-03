const router=require('express').Router();
const db=require('../db');
const http=require("http");
const https=require("https");
const axios=require('axios');

router.get('/godata/dustdata',(req,res)=>{
    var url="https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=Lpf%2BUzX8pyGD2qc00I1isA7P7HwVmE93JfHZGvwlHu3kh2azXsKK%2FnNcsTOWKGNydN%2Bs26flhd5OWk0krPIH2Q%3D%3D&returnType=json&numOfRows=50&pageNo=1&sidoName=%EA%B2%BD%EA%B8%B0&ver=1.0";
    const options = { 
        method: "get", 
        headers: { "User-Agent": "test", }, 
        httpsAgent: new https.Agent({
             rejectUnauthorized: false, //허가되지 않은 인증을 reject하지 않겠다! 
        }), 
    };
    
    axios(url,options).then((Response)=>{
        res.send(Response.data);
        console.log(Response.data);
    }).catch((Error)=>{
        console.log(Error);
    })
});

router.get('/mydata/boarddata/:pageNumber',(req,res)=>{
    if(req.params.pageNumber==undefined)
        req.params.pageNumber=1;
    var q="SELECT board_no FROM board ORDER BY board_no DESC";
    db.query(q,function(err,lastresult,fields){
        var query=`SELECT * FROM board ORDER BY board_no DESC limit 5 OFFSET ${(req.params.pageNumber-1)*5};`
        db.query(query,function(err,results,fields){
            if(err){
                console.log(err);
            }
            res.send(results);
        })
    })
});
router.get('/mydata/boardAmount',(req,res)=>{
    var sql="SELECT count(*) AS amount FROM board";
    db.query(sql,function(err,result,fields){
        res.send(result);
    })
})

module.exports=router;
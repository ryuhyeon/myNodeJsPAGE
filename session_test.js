const express=require("express");
const session=require("express-session");


const app=express();

app.use(session({
    secret:"password",
    resave:false,
    saveUninitialized:true,
}));


app.get('/',function(req,res,next){
    console.log(req.session);
    if(req.session.num===undefined){
        req.session.num=1;
    }else{
        req.session.num+=1;
    }
    res.send(`Views : ${req.session.num}`);
})

app.listen(3000,()=>{
    console.log('server is running');
})
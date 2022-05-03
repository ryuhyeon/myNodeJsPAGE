const { default: axios } = require('axios');
const express= require('express');
const expressLayouts=require('express-ejs-layouts');
const session=require("express-session");
const http=require("http");
const https=require("https");
const bodyParser = require("body-parser");
const MemoryStore=require("memorystore")(session);
const path=require('path');
const { nextTick } = require('process');
const { setEnvironmentData } = require('worker_threads');
const req = require('express/lib/request');
var cheerio=require('cheerio');

const passport=require('passport');
const passportConfig=require('./passport');
const db=require('./db');

/* 라우터 import*/
const dataRouter=require('./routers/data_router');


const { appendTo } = require('cheerio/lib/api/manipulation');




async function getHTML(){
    try{
        return await axios.get('https://www.ysc.ac.kr/kor/CMS/DietMenuMgr/list.do?mCode=MN148&searchDietCategory=1')
    }catch(error){
        console.error(error);
    }
}


db.connect();


const app=express();

//passportConfig();
//var static=require('static');
const port=process.env.PORT || 3000;






app.use(express.static('./'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('data'));
app.use(express.static('views'));
app.use(express.static('scss'));
app.use(express.static('vender'));
app.use(express.static('js'));
app.use(express.static('css'));
//memory session 
app.use(
    session({
        secret:"secret key",
        resave:false,
        saveUninitialized:true,
        store: new MemoryStore({
            checkPeriod:180000,
        }),
        cookie:{
            maxAge:180000,
            httpOnly:true,
            secure:false
        },
    })
)
app.use(passport.initialize());
app.use(passport.session());

passportConfig();


app.use((req,res,next)=>{
    var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;

    console.log(ip);
    next();
})



//ejs-layout setting
app.use(expressLayouts);
app.set('layout','layout');
app.set("layout extractScripts",true);
app.engine('html',require('ejs').renderFile);
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.locals.nav="";
app.locals.session=0;
//ejs-layout setting end

/*
app.get('/',(Req,res)=>{
    console.log(req.session);
    
    console.log(req.session.num);
    app.locals.session=req.session.num;
    app.locals.nav='main';    
    res.render("pages/index.ejs");
    
});
*/
app.get("*",(req,res,next)=>{
    app.locals.isLogin=false;
    app.locals.user_id=" ";
    if(req.user!=undefined){
        app.locals.isLogin=true;
        app.locals.user_id=req.user.member_id;
    }

    next();
})
app.locals.id="";
app.locals.ip="";

// 로그인 처리
app.post('/auth/login_action',
        passport.authenticate('local',{
            successRedirect:'/',
            failureRedirect:"/login.html"
        })
    );
app.get("/auth/logout", (req, res) => {
        req.logout();
        req.session.destroy();
        res.redirect("/login.html");
    });
/*
const loginRouter=require('./routers/login_router')(app,passport);
app.use('/auth',loginRouter);
*/
app.get('/',function(req,res,next){
    
    if(req.session.num===undefined){
        req.session.num=0;
    }else{
        req.session.num+=1;
    }
    app.locals.session=req.session.num;
    app.locals.nav='main';
    app.locals.id="1";
    console.log(req.user);
    /*db test area*/
    res.render("pages/index");
    
    
})

app.use('/data',dataRouter);

app.get('/tables_haksik',(req,res)=>{
    app.locals.nav='tables/tables_haksik';
    getHTML()
    .then((html)=>{
        let titleList=[];
        const $=cheerio.load(html.data);
        const boblist=$("div.is-wauto-box").children('table').children('tbody').children('tr')
        var bobs=[];
        var bobfinal=[];
        boblist.each(function(i,elem){
            titleList[i]={
                bob:$(this).find("td").text().trim().replaceAll("\n","<br>")
            };
            bobs[i]=titleList[i].bob.split("<br>")
        });
        return bobs;
    })
    .then((dd)=>{
        
        res.locals.dd=dd;
        res.render("pages/tables_haksik",{title:'sex'});
    });
    
});


    
    /*
app.get('/tables_tmpl',(req,res)=>{
    app.locals.nav="tables/tables_tmpl";
    res.render("pages/tables_tmpl");
    
});
app.get('/tables',(req,res)=>{
    app.locals.nav='tables/tables'
    res.render("pages/tables");
    
});
app.get('/tables_xml_corona',(req,res)=>{
    app.locals.nav='tables/tables_xml_corona'
    res.render("pages/tables_xml_corona");
    
});
app.get('/dash',(req,res)=>{
    app.locals.nav='dash'
    res.render("pages/dash");
    
});
app.get('/charts',(req,res)=>{
    app.locals.nav='charts'
    res.render("pages/charts");
    
});
app.get('/board',(req,res)=>{
    app.locals.nav='board'
    res.render("pages/board");
    
});


/*
app.get('/menu1/*',(req,res,next)=>{
    switch(req.path){
        case "/menu1/buttons":
            app.locals.nav='menu1/buttons'
            res.render("pages/menu1/buttons");
            break;
        case "/menu1/cards":
            app.locals.nav='menu1/cards'
            res.render("pages/menu1/cards");
            break;
        default:
            next();
    }
})
*/
app.route('/menu1/:op')
    .get((req,res)=>{
        app.locals.nav='menu1/'+req.params.op
        res.render("pages/menu1/"+req.params.op);
    });
app.route('/menu2/:op')
    .get((req,res)=>{
        app.locals.nav='menu2/'+req.params.op
        res.render("pages/menu2/"+req.params.op);
    });
app.route('/board/view/:op')
    .get((req,res)=>{
        app.locals.nav='board'
        var query="SELECT *,DATE_FORMAT(board_date,'%Y/%m/%d %H:%i') as chg_date FROM board WHERE board_no="+req.params.op+";"
        db.query(query,function(err,results,fields){
        if(err){
            console.log(err);
        }
        res.locals.data=results;
        res.render('pages/board_view');
    })
});
app.get('/getmyip/*',(req,res)=>{
    res.send("<h1>Your IP is "+req.path+".</h1>");
})
/* JSON 전달 router화 
//cors 해결용
app.get('/data/godata/dustdata',(req,res)=>{
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
})

app.get('/data/mydata/boarddata/:pageNumber',(req,res)=>{
    if(req.params.pageNumber==undefined)
        req.params.pageNumber=1;
    var q="SELECT board_no FROM board ORDER BY board_no DESC";
    db.query(q,function(err,lastresult,fields){
        var query=`SELECT * FROM board WHERE board_no< ${lastresult[0].board_no-(req.params.pageNumber-1)*10} ORDER BY board_no DESC;`
        db.query(query,function(err,results,fields){
            if(err){
                console.log(err);
            }
            res.send(results);
        })
    })
})
*/
app.route('/:src')
    .get((req,res)=>{
        app.locals.nav=""+req.params.src;
        res.render('pages/'+req.params.src);
    });


app.all('*',function(req,res){
    app.locals.nav=res.path;
    res.render("pages/404.ejs");
});


app.listen(port,()=>{
    console.log(`server is listening at localhost:${port}`);
});
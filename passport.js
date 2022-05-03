const passport =require('passport');

const localStrategy=require('passport-local').Strategy;
const db=require('./db');



module.exports=()=>{
    /*
    const users = [
        { id: "hello", pw: "world" },
        { id: "good", pw: "bye" },
    ];
    const findIndexByID = id => {
        let len = users.length;
    
        for (let i = 0; i < len; i++) {
            if (users[i].id === id) return i;
        }
    
        return -1;
    };
    const login = async(id, pw) => {
        
        let index = findIndexByID(id)
    
        if (index === -1) return -1;
        if (users[index].pw === pw) return 1;
        return 0;
    };
    */
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        console.log("deserializeUser id : ",id);
        var userInfo;
        var sql='SELECT * FROM MEMBER WHERE member_id=?'
        db.query(sql,[id],function(err,results){
            if(err) console.log("db ERROR");

            
            var json=JSON.stringify(results[0]);
            userinfo=JSON.parse(json);
            console.log("deserializeUser mysql result: ",userinfo);
            done(null,userinfo);
        })
    });
    passport.use(new localStrategy({
        usernameField:'id',
        passwordField:'pw',
        session:true,
        passReqtoCallback:false,
    },async function(username,password,done){
        var query=`SELECT * FROM MEMBER WHERE member_id='${username}' AND member_pw='${password}';`;
        await db.query(query,function(err,results,fields){
            if(err){
                return -1;
            }
            
            if(results==0)//틀렷을 때
                done(null, false, { message: "Incorrect username." });
            else
            return done(null, { id: username });

        })
        /*
        if (result === -1){
            console.log("er1")
            return done(null, false, { message: "Incorrect username." });
        }else if (result === 0){
            console.error('shit');
            return done(null, false, { message: "Incorrect password." });
        }else {
            return done(null, { id: username });
        }
        */
    }));
    
};


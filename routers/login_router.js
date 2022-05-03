module.exports=(app,passport)=>{
    const router=require('express').Router();

    router.post('/auth/login_action',
        passport.authenticate('local',{
            successRedirect:'/',
            failureRedirect:"/login.html"
        })
    );
    router.get("/auth/logout", (req, res) => {
        req.logout();
        res.redirect("/login.html");
    });
    return router;
}
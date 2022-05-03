/*

const mongoose=require('mongoose');
module.exports=()=>{
    function connect(){
        mongoose.connect('localhost:27017',function(err){
            if(err){
                console.error('mongodb connection error',err);
            }
            console.log('mongodb connected');
        });
    }
    connect();
    mongoose.connection.on('disconnected',connect);
    require('./user.js');
}*/

const maria=require('mysql');

const conn=maria.createConnection({
    host:'localhost',
    port:3309,
    user:'root',
    password:'tjd2gus',
    database:'node_server'
});
module.exports=conn;

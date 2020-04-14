//import { dirname } from "path"; ???

const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const secret = require("./secret");
const postTemp = require("./posts.js");
const Db = require('tingodb')().Db;
 
const db = new Db(__dirname+'/database', {});
// Fetch a collection to insert document into
const users = db.collection("users");
const posts = db.collection("posts");

const app = express();

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(__dirname+'/public'))

app.get("/",function(req,res){
    //let token = jwt.verify(req.cookies.token,secret);
    //console.log(token);
    res.sendFile(__dirname+"/homeform.html");
    //res.send(req.cookies);
});

//Register formulär_________________________________________________________________________________________________________

app.get("/register",function(req,res){
    res.sendFile(__dirname+"/registerform.html");
});
app.post("/register",function(req,res){
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let img = req.body.profilepicture;
    users.findOne({email:req.body.email}, function(err,user){
        
    //users.find({email:req.body.email}).toArray(function(err,user){
        //Kommenterade body user.length och find för att de inte fungerade som de skulle och satte in samma setup som login
        
        
        if (user )
        //if(users.length > 1)
        {
            res.redirect("/register?err=user_exists")
        }
        else{
            bcrypt.hash(password,12,function(err,hash){

     
                password = hash;
                
                let user = {username,email,password,img};
                console.log(user);
                users.insert(user, (err, result)=>{
                    console.log(err);
                    console.log(result);
                    
                });
                

                res.redirect("/login");
            });

        }
        
        
    
    });




});

//Login _______________________________________________________________________________________________________________

app.get("/login",function(req,res){
    res.sendFile(__dirname+"/loginform.html");
});

app.post("/login",function(req,res){

    // Hämta våra användare från db/fil

    users.findOne({email:req.body.email}, function(err,user){
        //console.log("1");

        if (user ){

            bcrypt.compare(req.body.password,user.password,function(err,success){
                console.log(success);
                //console.log("2")
    
                if(success){
                    
                    // res.cookie("auth",true,{httpOnly:true,sameSite:"strict"});
                    //console.log("3")
                    const token = jwt.sign({email:user.email},secret,{expiresIn:3600});
                    res.cookie("token",token,{httpOnly:true,sameSite:"strict",maxAge:3600000}); 
                    res.redirect("/?loginSuccess");
                    //Ändra till hem menyn
                }
                else{
                    res.redirect("/login?err");
                } 
                
    
            })


        }
        else {
            res.redirect("/login?err");
        }


        
    });
    
});

//Hem menyn_______________________________________________________________________________________________________________________________

app.get("/posts",async function(req,res){
   //res.sendFile(__dirname + "/posts.html");
  /*posts.findOne({_id:2}, function(err, p){
    console.log(p)
    
  })*/
  
  let temp ="";
  posts.find({}).toArray(function(err, result) {
    /*console.log(result[0])
    console.log(result[1])
    for(let i = 0; i < result.length; i++){
      temp+= '<img src="' + result[i].picture +'"/>';
    }

    

    result.foreach(p =>{
      //temp+= "<img src="+p.posterimg +"/>";
      console.log(p)
    })*/
    res.send(postTemp(result));
  });

  //console.log(temp)
  


})

app.post("/posts", function(req,res){


})

//--------------------------------------------------------------------------------------------
app.get("/post",function(req,res){
    if(req.cookies.token !== null && req.cookies.token !== undefined ){
        
        res.sendFile(__dirname + "/postform.html");
    }
    else {
        res.redirect("/?err");
        
    }
    
})

app.post("/post", function(req,res){
    //console.log('hejehehe',req.body);
    
  //Datum------------------------------------------------------
    var today = new Date();
    //var tt = String(today.getTime()).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    //---------------------------------------------------------

    let token = jwt.verify(req.cookies.token,secret);
    let mail = token.email;

    users.findOne({email:mail},function(err,user){
        if(user)
        {
      /*       bcrypt.compare(req.body.password,user.username,function(err,success){
                bcrypt.compare(req.body.password,user.img,function(err,success){ */
                
                let poster = user.username;
                let userid = user._id;
                let posterimg = user.img;
                let title = req.body.title;
                let picture = req.body.picture;
                let text = req.body.text;

                posts.insert({userid,poster,posterimg,title,picture,text,today},function(err){
                    if(err){res.send("error")}
                    else {res.redirect("/posts");}
                });

                console.log("person:",user.username,user.img)
                console.log("inlägg:",title,picture,today,text);

              

        }

    console.log(token,mail);

})

})

// kollar om systemet har en angiven port, annars 3700..._______________________________________________________________________________
const port = process.env.PORT || 3700
app.listen(port, function(){console.log("port:" +port)});
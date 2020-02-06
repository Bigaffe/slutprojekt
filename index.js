//import { dirname } from "path"; ???

const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const secret = require("./secret");
const Db = require('tingodb')().Db;
 
const db = new Db(__dirname+'/database', {});
// Fetch a collection to insert document into
const users = db.collection("users");

const app = express();

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.get("/",function(req,res){
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
    users.find({email:req.body.email}).toArray(function(err,user){
        
        
        
        
        if(users.length > 0)
        {
            res.send("User already exists")
        }
        else{
            bcrypt.hash(password,12,function(err,hash){

     
                password = hash;
                
                let user = {username,email,password};
                console.log(user);
                users.insert(user, (err, result)=>{
                    console.log(err);
                    console.log(result);
                    
                });
                //Testing
                //res.send(user);
        
                /*users.findOne({username: 'affepaffe'}, (err, item)=>{
                    res.send(item)
                });*/


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
        console.log("1");

        if (user ){

            bcrypt.compare(req.body.password,user.password,function(err,success){
                console.log(success);
                console.log("2")
    
                if(success){
                    
                    // res.cookie("auth",true,{httpOnly:true,sameSite:"strict"});
                    console.log("3")
                    const token = jwt.sign({email:user.email},secret,{expiresIn:3600});
                    res.cookie("token",token,{httpOnly:true,sameSite:"strict",maxAge:3600000}); 
                    res.redirect("/?loginSuccess");
                    //Ändra till hem menyn
                }
                else{
                    res.send("Wrong Password");
                } 
                
    
            })


        }
        else {
            res.redirect("/login?err");
        }


        
    });
    /**
     * 1. hämta data som klienten skickat ( Repetition )
     * 2. Leta efter användare i databas/fil/minne
     * 3. Om användare ej finns skicka respons till klient med error
     * 4. Om användare finns gå vidare med att kolla lösenord
     * 5. Om löserord ej är korrekt skicka respons till klient med error
     * 6. Om lösenord är korrekt - Skicka respons/redirect 
     * 7. Nu när användaren är inloggad måste hen förbli så ett ta
     *    Detta löser vi med JWT.
     *    Skapa JWT och lagra i cookie innan din respons/redirect
     * 8. Skapa middleware för att skydda vissa routes.
     *    Här skall vi nu använda våra JWT för att hålla en användare inloggad. 
     * 9. Småfix för att förbättra säkerhet och fixa utloggning. 
     */

});

//Hem menyn_______________________________________________________________________________________________________________________________

app.get("/posts",function(req,res){
    res.sendFile(__dirname + "/posts.html");
})
app.get("/post",function(req,res){
    res.sendFile(__dirname + "/postform.html");
})

// kollar om systemet har en angiven port, annars 3700..._______________________________________________________________________________
const port = process.env.PORT || 3700
app.listen(port, function(){console.log("port:" +port)});
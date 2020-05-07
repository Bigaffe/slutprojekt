//import { dirname } from "path"; ???

const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const secret = require("./secret");
const postTemp = require("./posts.js");
const myPostTemp = require("./myposts.js");
const Db = require('tingodb')().Db;
const engine = require("tingodb")({});
const edit = require("./edit.js");
 
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
                    if(result){
                      const token = jwt.sign({email:user.email, password: user.password},secret,{expiresIn:3600});
                      res.cookie("token",token,{httpOnly:true,sameSite:"strict",maxAge:3600000}); 
                      res.redirect("/posts");
                    }else{
                      res.redirect("/register");
                    }
                    
                });
                

                //res.redirect("/login");
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

        if (user ){

            bcrypt.compare(req.body.password,user.password,function(err,success){
                console.log(success);

    
                if(success){
                    const token = jwt.sign({email:user.email, password: user.password},secret,{expiresIn:3600});
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
  
  let temp ="";
  posts.find({}).toArray(function(err, result) {
    res.send(postTemp(result));
  });

  


})

app.post("/posts", function(req,res){


})

//--------------------------------------------------------------------------------------------
app.get("/post",validate,function(req,res){

    res.sendFile(__dirname + "/postform.html");

})

app.post("/post", validate, function(req,res){
    
  //Datum------------------------------------------------------
    var today = new Date();
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

app.get("/myposts",validate,function(req,res){
  

  let token = jwt.verify(req.cookies.token,secret);
  let mail = token.email;

    users.findOne({email:mail},function(err,user){
      if(user)
      {
      
          let p = user.username;
          
          posts.find({poster:p}).toArray(function(err, result) {

            res.send(myPostTemp(result));
          });
              

      }

    console.log(token,mail);

  })
})

app.post("/myposts",validate,function(req,res){
  
})








function validate(req, res , next){
  //console.log(req.cookies.token);
  jwt.verify(req.cookies.token, secret, function(err, decoded) {
    //console.log(decoded) // bar

    if(!err){
      users.findOne({email:decoded.email}, function(err,user){
        //console.log("1");
        //console.log(user)
        if (user ){
          

          if(decoded.password === user.password){
              
              next();
             
              
          }
          else{
            res.redirect("/login");
          } 
        }
        else {
            res.redirect("/login");
        }        
      });
    }else{
      res.redirect("/login");
    }
  });
}
//-------------------------------------------------------------------------------------

app.get("/edit/:id",validate,function(req,res){
  posts.findOne({_id:req.params.id},function(err,result){
      if(result)
      {
        res.send(edit(req.params._id, result.title, result.picture, result.text))  
      }
  })
  
  


})


app.get("/delete/:_id",validate,function(req,res){
  res.send(req.params._id)
})



// kollar om systemet har en angiven port, annars 3700..._______________________________________________________________________________



const port = process.env.PORT || 3700
app.listen(port, function(){console.log("port:" +port)});
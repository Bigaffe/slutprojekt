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
const del = require("./delete.js");
const db = new Db(__dirname+'/database', {});
// Fetch a collection to insert document into
const users = db.collection("users");
const posts = db.collection("posts");
const app = express();

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(__dirname+'/public'))

app.get("/",function(req,res){
    res.sendFile(__dirname+"/homeform.html");
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
        if (user )
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
  jwt.verify(req.cookies.token, secret, function(err, decoded) {

    if(!err){
      users.findOne({email:decoded.email}, function(err,user){
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
  console.log("id", req.params.id)
  posts.findOne({_id:req.params.id},function(err,result){
      if(result)
      {
        res.send(edit(req.params.id, result.title, result.picture, result.text))  
      }else{
        res.redirect("/myposts")
      }
  })
})

app.post("/edit/:id",validate,function(req,res){
  console.log(req.body);
  posts.update({_id:req.params.id},{$set:{title: req.body.title, picture: req.body.picture, text: req.body.text}},{
     multi: false
   },function(err, result){
      console.log(err, result);
      res.redirect("/myposts")
   })
})
app.get("/delete/:id",validate,function(req,res){
  posts.findOne({_id:req.params.id},function(err,result){
    console.log(result)
      if(result)
      {
        res.send(del(req.params.id, result));
      }
      else{
        res.redirect("/myposts")
      }
  })
  
})
app.post("/delete/:id",validate,function(req,res){
  posts.remove({_id:req.params.id},{
     justOne: true
   },function(err,result){
      res.redirect("/myposts");
  })
})

// kollar om systemet har en angiven port, annars 3700..._______________________________________________________________________________
const port = process.env.PORT || 3700
app.listen(port, function(){console.log("port:" +port)});
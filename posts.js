module.exports = function(posts){
  //title,picture,today,text,poster,posterimg
  let postsString = "";
  var postlength = posts.length
  
  
  //En for loop som går igenom alla inlägg
  for(let i = 0; i < posts.length; i++){
      //Anledning den går minus är för den ska ta det senaste inlägget till den äldsta
      postlength = postlength - 1;
      //Det nedanför är det som syns på sidan sen, ${posts} är värdena som blev inmattade när inlägget skrevs.
    postsString += `
      <h4><img src="${posts[postlength].posterimg}" style="width:75px; height:75px;">${posts[postlength].poster}<h4>
        <h1 style="color:blue;">${posts[postlength].title}</h1>
        <h5>${posts[postlength].today}</h5>
        <img src="${posts[postlength].picture}" style="width:300px; height:300px;">
        <p>${posts[postlength].text}</p><br>
        <hr>

    `
  }
    //postsString är alla inläggen som blir stapplade på varandra i ordning som for loopen gick.
    return `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
        <title> Posts </title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <link rel="stylesheet" type="text/css" href="/posts.css">
    </head>
    <body style="width:800px; margin: auto;">
        <button onclick="window.location='/'" style="height:80px; width:100px;">Home</button>
        <button onclick="window.location='/login'" style="height:80px; width:100px;">Login</button>
        <button onclick="window.location='/register'" style="height:80px; width:100px;">Register</button>
        <button onclick="window.location='/post'" style="height:80px; width:100px;">Post something</button>
        <button onclick="window.location='/posts'" style="height:80px; width:100px;">Posts</button>
        <button onclick="window.location='/myposts'" style="height:80px; width:100px;">My Posts</button>

        ${postsString}
    
    </body>
    </html>
    `;
}
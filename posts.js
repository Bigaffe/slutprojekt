module.exports = function(posts){
  //title,picture,today,text,poster,posterimg
  let postsString = "";
  for(let i = 0; i < posts.length; i++){
    postsString += `
      <h4><img src="${posts[i].posterimg}" style="width:75px; height:75px;">${posts[i].poster}<h4>
        <h1 style="color:blue;">${posts[i].title}</h1>
        <h5>${posts[i].today}</h5>
        <img src="${posts[i].picture}" style="width:300px; height:300px;">
        <p>${posts[i].text}</p>
        <hr>

    `
  }
  
    return `
    <!DOCTYPE html>
    <html lang="sv">
    <head>

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <link rel="stylesheet" type="text/css" href="/posts.css">
    </head>
    <body style="width:600px; margin: auto;">
        <button onclick="window.location='/'" style="height:80px; width:100px;">Home</button>
        <button onclick="window.location='/login'" style="height:80px; width:100px;">Login</button>
        <button onclick="window.location='/register'" style="height:80px; width:100px;">Register</button>
        <button onclick="window.location='/post'" style="height:80px; width:100px;">Post something</button>
        <button onclick="window.location='/posts'" style="height:80px; width:100px;">Posts</button>

        ${postsString}
    
    </body>
    </html>
    `;
}
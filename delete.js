module.exports = function(id, post){
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" type="text/css" href="/posts.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Post something</title>
</head>
<body style="width:800px; margin: auto;">
        <button onclick="window.location='/'" style="height:80px; width:100px;">Home</button>
        <button onclick="window.location='/login'" style="height:80px; width:100px;">Login</button>
        <button onclick="window.location='/register'" style="height:80px; width:100px;">Register</button>
        <button onclick="window.location='/post'" style="height:80px; width:100px;">Post something</button>
        <button onclick="window.location='/posts'" style="height:80px; width:100px;">Posts</button>
        <button onclick="window.location='/myposts'" style="height:80px; width:100px;">My Posts</button>
        <h2>Are you sure you want to delete this post?</h2>
       
        <h4><img src="${post.posterimg}" style="width:75px; height:75px;">${post.poster}<h4>
        <h1 style="color:blue;">${post.title}</h1>
        <h5>${post.today}</h5>
        <img src="${post.picture}" style="width:300px; height:300px;">
        <p>${post.text}</p><br>

        <form action="/delete/${id}" method="post">
          <input type="submit" value="Delete">
        </form>
        <button onclick="window.location='/myposts'";">Cancel</button>
            
            

</body>
</html>`
}
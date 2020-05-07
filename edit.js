module.exports = function(id, titel, picture, text){

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
        <h2>Edit</h2>
        <!--<form action="/login" method="post">-->
            
            <form action="/edit/${id}" method="post">
    
            <input type="text" name="title" placeholder="title" value="${titel}">
            <input type="img" name="picture" placeholder="picture(URL)" value="${picture}">
            <textarea id="txtArea" name="text" rows="10" cols="70">${text}</textarea>
            <input type="submit" value="Edit">
            </form>
            
            

</body>
</html>`
}
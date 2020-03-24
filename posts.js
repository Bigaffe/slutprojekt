module.exports = function(title,picture,today,text,poster,posterimg){
    return `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        <button onclick="window.location='/'" style="height:80px; width:100px;">Home</button>
        <button onclick="window.location='/login'" style="height:80px; width:100px;">Login</button>
        <button onclick="window.location='/register'" style="height:80px; width:100px;">Register</button>
        <button onclick="window.location='/post'" style="height:80px; width:100px;">Post something</button>
        <button onclick="window.location='/posts'" style="height:80px; width:100px;">Posts</button>

        <h4><img src="${posterimg}" style="width:75px; height:75px;">${poster}<h4>
        <h1 style="color:blue;">${title}</h1>
        <h5>${today}</h5>
        <img src="${picture}" style="width:300px; height:300px;">
        <p>${text}</p>
        
    
    
        
    
    </body>
    </html>
    `;
}
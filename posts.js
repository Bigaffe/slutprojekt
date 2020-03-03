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
        <h4><img src="${posterimg}">${poster}<h4>
        <h1>${title}</h1>
        <h5>${today}</h5>
        <img src="${picture}">
        <p>${text}</p>
        
    
    
        
    
    </body>
    </html>
    `;
}
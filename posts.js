module.exports = function(title,picture,today){
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
        <h1>${title}</h1>
        <h5>${today}</h5>
        <img src="${picture}">
        <p>
    
    
        </p>
    
    </body>
    </html>
    `;
}
const express = require('express');
const app= express();
const mongoose= require('mongoose');
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./keys');
//11MxEj7uQsPqWLk8

// require('./models/storyUser');
// app.use(express.json());
// app.use(require('./routes/auth'));


mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', ()=>{
    console.log("connected to my mongo yupp");
});

mongoose.connection.on('error', (err)=>{
    console.log("err connecting",err)
});

require('./models/storyUser');
require('./models/storyPosts');


app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/posts'));
app.use(require('./routes/user'))


//ws5xM1jWM1DOrNff
// const customMiddleware = (req,res,next)=>{
//     console.log("middleware executed!!")
//     next()
// }

//  app.use(customMiddleware)

// app.get('/',(req,res)=>{
//     console.log("home")
//     res.send("Hello Programming..")
// })

// app.get('/about',customMiddleware,(req,res)=>{
//     console.log("about")
//     res.send("Hello world..")
// })

// if(process.env.NODE_ENV=="production"){
//     app.use(express.static('client/build'))
//     const path = require('path')
//     app.get("*",(req,res)=>{
//         res.sendFile(path.resolve(__dirname,'client','build','index.html'))
//     })
// }
app.listen(PORT,()=>{
    console.log("Server is running on", PORT)
});
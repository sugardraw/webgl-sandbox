const express = require('express');

const app = express();
app.use(express.static('public'));

app.listen(3001, ()=>{
    console.log('server listening in port 3001')
});
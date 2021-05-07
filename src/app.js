require('./db/mongoose');
const express = require('express');
const Router = require('./routes/routes');


const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(Router);


app.listen(port, () => {
    console.log('Server started at port '+ port);
});
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.LOCAL_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('database connection successful')
}).catch(error => 
    console.log(error)
);

app.listen(8000, ()=>{
    process.env.NODE_ENV = 'production'
    // process.env.NODE_ENV = 'development'
    console.log('listening to server on port 8080')
});

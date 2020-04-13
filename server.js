import config from './config';
// import express from 'express';
// import apiRouter from './api';
// import bodyParser from 'body-parser';
import app from './app';
import http from 'http'

const server = http.createServer(app);
// const server = express();

// server.use(bodyParser.json());

//server.set('view engine', 'ejs');

// server.use('/api', apiRouter);

server.listen(config.port, config.host,() => {
    console.info("Express listening on port", config.port);
});
// import config,{nodeEnv, logStars} from './config';
// import http from 'http'
// const server = http.createServer();

// server.listen(8080);

// server.on('request',(req, res)=> {
//     res.write('Hello HTTP!\n');
//     setTimeout(() => {
//         res.write('I can stream!\n');
//         res.end();
//     }, 3000);
// });
// console.log(config,nodeEnv);
// logStars('Function');
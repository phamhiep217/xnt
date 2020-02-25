import config from './config';
import express from 'express';
import apiRouter from './api';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
const server = express();

server.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public'),
}));

server.set('view engine', 'ejs');

import serverRender from './serverRender';

server.get('/', (req, res) => {
    serverRender()
        .then(content =>{
            res.render('index', {
                content
            });
        })
        .catch(console.error);
});

server.use('/api', apiRouter);
server.use(express.static('public'));
// server.get('/about.html', (req, res) => {
//     res.send('the about page');
// });

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
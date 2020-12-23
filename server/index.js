const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const session = require('express-session');
const cors = require('cors')
const {constants} = require('./configs')

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(cookieParser());
app.use(compression());
const routes = require('./routes')
app.use(cors({ origin: '*' }));

const { isIP } = require('net');


app.use((req, res, next) => {
    if (isIP(req.hostname) == 0) {
        req.baseUri = req.protocol + '://' + req.hostname + '/';
    } else {
        if (!req.secure) {
            let port = app.get('port');
            req.baseUri = req.protocol + '://' + req.hostname + (port == 80 ? '' : (':' + port)) + '/';
        } else {
            let port = app.get('https_port');
            req.baseUri = req.protocol + '://' + req.hostname + (port == 443 ? '' : (':' + port)) + '/';
        }
    }
    next();
});

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(express.static(path.resolve(__dirname, '../content')))
app.use(express.static(path.resolve(__dirname, '../public')))
app.use(express.static(path.resolve(__dirname, '../dist')))

app.use('/api', routes)


app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/client/index.html'));
})

app.listen(constants.PORT, function () {
    console.log(`>> App listening on port ${constants.PORT} <<`);
});
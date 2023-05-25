const express = require('express'),
  bodyParser = require('body-parser'),
  envVariables = require('./env-variables'),
  port = envVariables.port;

const createAppServer = () => {
const app = express();
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,' + 'cid, user-id, x-auth, Cache-Control, X-Requested-With, datatype, *')
        if (req.method === 'OPTIONS') res.sendStatus(200)
        else next()
    })
    app.use(bodyParser.json({ limit: '10mb' }));
    // app.use(logger('dev'));
    app.use(express.json());
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
    // app.use(cookieParser());
    app.use(envVariables.contextPath, require('./channel/routes'));
    module.exports = app;
    return app;
}

const app = createAppServer();
app.listen(port, () => console.log(`XState-Chatbot-Server is running on port ${envVariables.port} with contextPath: ${envVariables.contextPath}`));
/**
 * Bootstrap file
 *
 * @author Long Pham
 * @type {*|start}
 */

const express = require ('express');
const accessLogger = require ('morgan');
const bodyParser = require ('body-parser');
const nofavicon = require ('express-no-favicons');
const process = require ('process');
const path = require ('path');
const http = require ('http');
const fs = require ('fs');
const compression = require ('compression');
const helmet = require ("helmet");
const cookieParser = require ('cookie-parser');
const methodOverride = require ('method-override');

//===== define root path
global.__ROOT = __dirname + '/';

//===== Default Timezone
process.env.TZ = 'Asia/Ho_Chi_Minh';

//===== INCLUDING ENVIRONMENT CONFIGURATION
global.CONSTANT = require ('./config/constant');
// global.APP_SETTINGS = require ('./config/config');

//===== Enable logger
global.logger = require ('./libraries/Common/Logger/Logger');

//===== all of our routes
const ErrorHandler = require ('./middlewares/Error/ErrorHandler');
const NotAcceptableError = require ('./libraries/Exception/NotAcceptableError');

//===== ZIPKIN Middleware Declare
const {Tracer} = require ('zipkin');
const zipkinMiddleware = require ('zipkin-instrumentation-express').expressMiddleware;
const CLSContext = require ('zipkin-context-cls');
const ctxImpl = new CLSContext ('zipkin');
// const {recorder} = require ('./middlewares/Zipkin/Recorder');
// const localServiceName = APP_SETTINGS.ZIPKIN.NAME;
// global.tracer = new Tracer ({ctxImpl, recorder: recorder (), localServiceName});


//===== CREATE EXPRESS INSTANCE
const app = express ();

//===== RUN ZIPKIN MIDDLEWARE
// app.use (zipkinMiddleware ({tracer}));

/**
 * Running API behind LB
 * http://expressjs.com/en/guide/behind-proxies.html
 */
app.enable ('trust proxy');

// set server listening port
let PORT = 3001 //APP_SETTINGS.PORT;
let HOST = 'phanphunghaocs' //APP_SETTINGS.HOST;
let PROTOCOL = 'https' //APP_SETTINGS.PROTOCOL;

//===== COMPRESS RESPONSE
app.use (compression ());

// Armoring the API with Helmet
app.use (helmet ());

//===== ENABLE LOG
const rfs = require ('rotating-file-stream');
let logDirectory = path.join (__dirname, 'logs');
// ensure log directory exists
fs.existsSync (logDirectory) || fs.mkdirSync (logDirectory);
// create a rotating write stream
let accessLogStream = rfs ('access.log', {
  interval: '1d', // rotate daily
  path    : logDirectory
});
// setup the access logger
app.use (accessLogger ('combined', {stream: accessLogStream}));

// app.use ((req, res, next) => {
//   let contentType = req.get ('content-type');

//   if (!contentType || ((contentType.indexOf ('application/json') === -1) && (contentType.indexOf (
//       'application/x-www-form-urlencoded') === -1))) {
//     next (new NotAcceptableError ('Content-Type is not acceptable', CONSTANT.HTTP_STATUS_NOT_ACCEPTABLE));
//   }
//   next ();
// });

// If one of bodyParser middleware apply then next one will not run.
// If request is not a json nor urlencoded then raw parser will process it.
app.use (bodyParser.json ());

app.use (cookieParser ());
app.use (methodOverride ('X-HTTP-Method-Override'));

//===== IMPLEMENT MIDDLE-WARES LOGIC HERE
app.use ((req, res, next) => {
  // ALLOW CORS
  // Website you wish to allow to connect
  res.setHeader ('Access-Control-Allow-Origin', PROTOCOL + '://' + HOST + ':' + PORT);

  // Request methods you wish to allow: GET, POST, OPTIONS, PUT, PATCH, DELETE
  res.setHeader ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader ('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader ('Access-Control-Allow-Credentials', false);

  // res.setHeader ("Content-Type", APP_SETTINGS.ACCEPT_CONTENT_TYPE);

  // res.setHeader ("Accept", APP_SETTINGS.ACCEPT_TYPE.join (', '));

  // set power-by
  // res.setHeader ('X-Powered-By', APP_SETTINGS.POWER_BY);

  if (req.method === 'OPTIONS') {
    res.status (CONSTANT.HTTP_STATUS_OK).end ();
  }

  next (); // make sure we go to the next routes and don't stop here
});

// UNSET FAVICON
app.use (nofavicon ());

//==== Initiate Database
require ('./models');

app.use ((req, res, next) => {
  // Go and validate request's security here (you can implement the following methods: HMAC, RSA, ACCESS TOKEN, STUB)
  next ();
});

app.get ('/', function (req, res) {
  return res.json ({
    code    : '200',
    message : 'success',
    data    : "{ app: 'example-backend', version: '1.0.0', apiUrl: '/v1' }",
    metadata: {created: new Date ().toISOString ()}
  });
});

//======== CONTROLLER ROUTING
app.use('/v1', require('./routes/example'));

// MUST ADD ERROR HANDLER AT VERY BOTTOM
// catch 404 and forward to error handler
app.use (function (req, res, next) {
  let err = new Error ('Not Found');
  err.status = CONSTANT.HTTP_STATUS_NOT_FOUND;
  next (err);
});

//===== ERROR HANDLER
app.use (ErrorHandler ());

//===== START SERVER
http.createServer (app).listen (3001);

module.exports = app;

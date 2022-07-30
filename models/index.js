// /**
//  * Default folder loader to index.js
//  *
//  * @see https://nodejs.org/api/modules.html#modules_folders_as_modules
//  */
// const DbConnectionError = require (__ROOT + 'libraries/Exception/DbConnectionError');
// const process = require ('process');

// let mongoose = require ('mongoose');
// mongoose.connect (APP_SETTINGS.DB_CONNECTION_STRING, {
//   useCreateIndex    : true,
//   useNewUrlParser   : true,
//   useUnifiedTopology: true,
//   poolSize          : 10,
//   socketTimeoutMS  : 0,
//   keepAlive        : true
// });

// mongoose.connection.on ('error', function (err) {
//   logger.error ('Connection error:');
//   logger.error (JSON.stringify (err));

//   // Internal server error
//   throw new DbConnectionError ('Internal Server Error.', CONSTANT.HTTP_STATUS_INTERNAL_SERVER_ERROR);
// });

// mongoose.connection.on ('disconnected', function () {
//   logger.info ('Mongoose.connection.disconnected');
// });

// mongoose.connection.once ('open', function () {
//   logger.debug ('Mongoose.connection.opened');
// });

// let onTerminate = function () {
//   mongoose.connection.close (function () {
//     logger.info ('Mongoose default connection disconnected through app termination.');
//     process.exit (0);
//   });
// };

// // If the Node process ends, close the Mongoose connection
// process.on ('SIGINT', onTerminate).on ('SIGTERM', onTerminate);

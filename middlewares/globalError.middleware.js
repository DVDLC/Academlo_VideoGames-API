const { AppError } = require("../utils/AppError");

const sendErrorDev = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
}

// Production errors

const sendErrorProd = ( err, req, res ) => {
  const statusCode = err.statusCode || 500;
  res.status( statusCode ).json({
    status: 'fail',
    error: err || 'Something went wrong :c'
  });
}

const handleUniqueEmailError = () => {
  return new AppError( 400, 'The email already exists' )
}

const handletTokenExpiredError = () => {
  return new AppError( 401, 'Session expired' )
}

const handleTokenError = () => {
  return new AppError( 404, 'Invalid session, Please login again' )
}

const globalErrorHandler = (err, req, res, next) => {
    

    if( process.env.NODE_ENV === 'development' ){
      sendErrorDev( err, req, res )
    }else if( process.env.NODE_ENV === 'production' ){

      let error = { ...err }
      
      switch ( err.name ) {
        case 'SequelizeUniqueConstraintError':
          error = handleUniqueEmailError() 
        case 'TokenExpiredError':
          error = handletTokenExpiredError()
        case 'JsonWebTokenError':
          error = handleTokenError()
        default:
          break;
      }

      sendErrorProd( error, req, res )
    }
  

  };
  
  module.exports = { globalErrorHandler };
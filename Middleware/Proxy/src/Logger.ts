const winston = require('winston');
const winistonMongoDB = require('winston-mongodb').MongoDB;

const Logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
          level: 'info',
          prettyPrint: true,
          colorize: true,
        }),
      ],
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.colorize(),
      winston.format.simple(),
    ),

  });

export default class logger {

  public static error(
    data: any,
    message: string = '',
    methodType: string = 'GET',
  ) {
    this.createLog(data, message, methodType, 'error');
  }

  public static info(
    data: any,
    message: string = '',
    methodType: string = 'GET',
  ) {
    this.createLog(data, message, methodType, 'info');
  }


  public static warn(
    data: any,
    message: string = '',
    methodType: string = 'GET',
  ) {
    this.createLog(data, message, methodType, 'warn');
  }

  public static success(
    data: any,
    message: string = '',
    methodType: string = 'GET',
  ) {
    this.createLog(data, message, methodType, 'info');
  }


  private static createLog(
    data: any,
    message: string = '',
    methodType: string,
    logType: string,
  )  {

    Logger[logType](message, {
            methodType: methodType,
            type: logType,
            data: data,
          });
  }
}

import App from './init/init';
import logger from './libraries/Logger';
require("dotenv").config();

logger.warn({}, `Your Enviroment Mode : ${process.env.NODE_ENV}`, '', 'CONSOLE');

new App().start();

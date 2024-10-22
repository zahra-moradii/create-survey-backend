import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { IncomingMessage, Server, ServerResponse } from 'http';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import logger from '../libraries/Logger';
import {
  IFormReviewDocument,
  FormReview,
} from '../models/formReviews';
import {
  IFormReviewsAnswersDocument,
  FormReviewsAnswer,
} from '../models/formReviewsAnswers'
import {
  IPackageDocument,
  Package,
} from '../models/packages'
import {
  IPackagePriceDocument,
  PackagePrice,
} from '../models/packagePrices'
import {
  IDiscountTypeDocument,
  DiscountType
} from '../models/discountType'
import{
  IDiscountDocument,
  Discount
}from '../models/discount'
import{
  IEventDocument,
  Event
}from '../models/event'
import{
  IUserDocument,
  User
}from '../models/User'
import{
  IOrderDocument,
  Orders
}from '../models/Orders'
import{
  IProfileDocument,
  Profile
} from '../models/Profile'
/**
 * Database Entities
 * * This section is very important
 * * All entity from your database define in this section
 * * With mongoose you can implement CRUD operation
 * * All models and schema integrate with together in this section
 */
export interface IDatabase {
  FormReview:Model<IFormReviewDocument>;
  FormReviewsAnswer:Model<IFormReviewsAnswersDocument>;
  Package:Model<IPackageDocument>;
  PackagePrice:Model<IPackagePriceDocument>;
  DiscountType:Model<IDiscountTypeDocument>;
  Discount:Model<IDiscountDocument>;
  Event:Model<IEventDocument>;
  User:Model<IUserDocument>;
  Orders:Model<IOrderDocument>;
  Profile:Model<IProfileDocument>;
}

const models: IDatabase = {
  FormReviewsAnswer,
  FormReview,
  Package,
  PackagePrice,
  DiscountType,
  Discount,
  Event,
  User,
  Orders,
  Profile
};

const mongodbHost = process.env.MONGO_HOST_DEV || 'localhost';
const mongodbDatabase = process.env.MONGO_DATABASE_DEV || "surveyDB";
const mongodbPort = process.env.MONGO_PORT_DEV || '27017';

const mongouri = `mongodb://${mongodbHost}:${mongodbPort}/${mongodbDatabase}`;

export default fp.default(
  async (
    app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
    opts: {},
    done: (err?: Error) => void,
  ) => {
    mongoose.connection.on('connected', () =>
      logger.success({}, 'Mongo connected successfully', '', 'CONSOLE'),
    );
    mongoose.connection.on('error', (error) => {
      logger.error(error, error.message, '', 'CONSOLE');
    });
    await mongoose.createConnection(mongouri).asPromise();
    await mongoose.connect(mongouri);
    app.decorate('db', models);
    done();
  },
);

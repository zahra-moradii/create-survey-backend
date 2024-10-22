import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
/**
 * Controller utility, with abstract methods, to allow child classes to inherit,
 *  - Fastify instance,
 *  - Incoming request body,
 *  - Incoming request object, and
 *  - Outgoing response object
 *
 * @export
 * @abstract
 * @class Controller
 */
// export default abstract class Controller<T> {
export default abstract class Controller {
  /**
   * Fastify application instance
   *
   * @protected
   * @type {FastifyInstance<Server, IncomingMessage, ServerResponse>}
   * @memberof Controller
   */
  protected app: FastifyInstance<Server, IncomingMessage, ServerResponse>;

  /**
   * Incoming request body object
   *
   * @protected
   * @type {{}}
   * @memberof Controller
   */
  protected body: any;

  /**
   * Incoming request object
   *
   * @protected
   * @type {FastifyRequest<{}>}
   * @memberof Controller
   */
  protected request: FastifyRequest<{}>;

  /**
   * Outgoing response object
   *
   * @protected
   * @type {FastifyReply<{}>}
   * @memberof Controller
   */
  protected reply: FastifyReply<any>;

  /**
   * Currently logged in user
   *
   * @protected
   * @type {{ email: string; id: Types.ObjectId; account: string }}
   * @memberof Controller
   */

  protected user: object;

  /**
   * db Models
   *
   * @protected
   * @memberof Controller
   */
  protected dbModel: string;

  constructor(
    app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
    request: FastifyRequest<{}>,
    reply: FastifyReply<any>,
    dbModel: string,
  ) {
    this.app = app;
    this.body = request.body;
    this.request = request;
    this.reply = reply;
    this.dbModel = dbModel;
  }

  public async find(query): Promise<any> {
    const users = await this.app.db[this.dbModel].find(query);
    return users;
  }

  public async searchByTitle(text): Promise<any> {
    const found = await this.app.db[this.dbModel].find({title: {$regex: new RegExp(text, "i")}})
    return found;
    }

  public async searchByCode(text): Promise<any> {
      const found = await this.app.db[this.dbModel].find({code: {$regex: new RegExp(text, "i")}})
      return found;
      }

  public async findByPaginate(query, options): Promise<any> {
    // const defaultOptions = {
    //   page: 1,
    //   limit: 10,
    //   collation: {
    //     locale: 'en',
    //   },
    // };
    const option = {
      page: this.request.params["page"],
      limit: this.request.params["limit"],
      pagination:
        this.request.params["page"] === "0" &&
        this.request.params["limit"] === "0"
          ? false
          : true,
      collation: {
        locale: "en",
      },
    };
    const results = await this.app.db[this.dbModel]["paginate"](
      query,
      option
    );
    return results;
  }

  
  // public async findById(id: string): Promise<T> {
  public async findById(id: string): Promise<any> {
    const document = await this.app.db[this.dbModel].findById({ _id: id });
    return document;
  }

  public async findByIdAndDelete(id: string): Promise<any> {
    return this.app.db[this.dbModel].findByIdAndDelete(id);
  }

  public async findByIdAndRemove(id: string): Promise<any> {
    return this.app.db[this.dbModel].findByIdAndRemove(id);
  }

  public async findByIdAndUpdate(
    id: string,
    model: any,
    option: any,
  ): Promise<any> {
    return this.app.db[this.dbModel].findByIdAndUpdate(id, model, option);
  }

  public async findOne(query: object): Promise<any> {
    return this.app.db[this.dbModel].findOne(query);
  }

  public async findOneAndDelete(query: object): Promise<any> {
    return this.app.db[this.dbModel].findOneAndDelete(query);
  }

  public async findOneAndRemove(query: object): Promise<any> {
    return this.app.db[this.dbModel].findOneAndRemove(query);
  }

  public async findOneAndReplace(query: object): Promise<any> {
    return this.app.db[this.dbModel].findOneAndReplace(query);
  }

  public async findOneAndUpdate(query: object): Promise<any> {
    return this.app.db[this.dbModel].findOneAndUpdate(query);
  }

  public async replaceOne(query: object): Promise<any> {
    return this.app.db[this.dbModel].replaceOne(query);
  }

  public async updateMany(query: object): Promise<any> {
    return this.app.db[this.dbModel].updateMany(query);
  }

  public async updateOne(query: object): Promise<any> {
    return this.app.db[this.dbModel].updateOne(query);
  }

  public async deleteMany(query: object): Promise<any> {
    return this.app.db[this.dbModel].deleteMany(query);
  }

  public async create(model: any = undefined): Promise<any> {
    const result = await this.app.db[this.dbModel].create(this.request.body);
    return result;
  }

  ///Todo : Create app logger
  // public async logging(model:any=undefined):Promise<any>{

  // }
}
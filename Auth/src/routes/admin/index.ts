import { Message } from './../../../node_modules/esbuild/lib/main.d';
import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import AdminController  from "../../controllers/admin";
import user from '../user';
import { protectAuthorizedUser } from '../../middlewares/Authentication';
import { includes } from 'lodash';

const jwt = require('jsonwebtoken')




interface ISigninBody {
    userName : string,
    password : string,
}
interface IChangeBody {
    userName : string,
    firstName: string,
    lastName: string,
    companyName: string,
    phone : string,
}
interface IUser {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    companyName: string;
    phone:string;
    permission : string[];
    options: string;
}
  
export default async (
    app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
    opts: { prefix: string },
    next: (err?: Error) => void
  ) => {
    
    app.post("/finduser",async (request, reply) => {
        
        const body = request.body as ISigninBody;
        const username = body.userName;
        if(!username)
            return reply.code(400).send({message: "username or password must be exist!"})
        const controller = new AdminController(app,request,reply,"User");
        let userinfo = await controller.findUser(username);
        if(!userinfo)
            return reply.code(404).send({message: "The username is incorrect."});
        return reply.code(200).send({userinfo})
    })
    app.post("/ActiveAccount",async (request, reply) => {
        
        const body = request.body as ISigninBody;
        const username = body.userName;
        if(!username)
            return reply.code(400).send({message: "username must be exist!"})
        
        const controller = new AdminController(app,request,reply,"User");
        let userinfo = await controller.ActiveAccount(username);
       
        return reply.code(200).send({userinfo})
    })
    app.post("/InActiveAccount",async (request, reply) => {
        
        const body = request.body as ISigninBody;
        const username = body.userName;
        if(!username)
            return reply.code(400).send({message: "username must be exist!"})
        
        const controller = new AdminController(app,request,reply,"User");
        let userinfo = await controller.InActiveAccount(username);       
        return reply.code(200).send({userinfo})
    })
   
    
    app.get("/alluser/:page/:limit", {}, async(request, reply)=>{
        const controller = new AdminController(app, request, reply, "User");
        const users = await controller.findByPaginate({},{});
        console.log(users.docs);
        return reply.code(200).send({data: users, message: "All users are read"});
      })
    app.post("/searchbar/:page/:limit",{
      },async(request, reply)=>{
        const body = request.body as {userName:''};
        const username = body.userName;
        
        const controller = new AdminController(app,request,reply,"User");
        let userinfo = await controller.findByPaginate({userName: {'$regex' : '.*' + username + '.*'}},{});
        if(!userinfo)
            return reply.code(404).send({message: "The username is incorrect."});
        return reply.code(200).send({userinfo})
      })
    
    
    
    next()

  }
  exports.autoPrefix = "/admin";
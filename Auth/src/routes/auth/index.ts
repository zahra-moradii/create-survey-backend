import { Message } from './../../../node_modules/esbuild/lib/main.d';
import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import AuthController  from "../../controllers/Auth";
import user from '../user';
import { Types } from 'mongoose';
import { replace } from 'lodash';
import { protectAuthorizedUser } from '../../middlewares/Authentication';
import ProfileController from '../../controllers/profile';

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
    profile: Types.ObjectId;
}
  
export default async (
    app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
    opts: { prefix: string },
    next: (err?: Error) => void
  ) => {
    app.post("/signin",async (request, reply) => {
        
        const body = request.body as ISigninBody;
        const username = body.userName;
        const password = body.password;
        //reply.send(username);

        if(!username || !password )
            return reply.code(400).send({message: "username or password must be exist!"})
        
        const controller = new AuthController(app,request,reply,"User");
        let userinfo = await controller.loginUser(username,password);
         if(!userinfo)
             return reply.code(404).send({message: "The username or password is incorrect."});
       // reply.send(await controller.loginUser(username,password));
       let payload={subject: username}
       let token=jwt.sign(payload, 'secretkey')
       
        return reply.code(200).send({token, userinfo})
    })
   
    app.post("/signup", async (request, reply) => {
        const newUser = request.body as IUser;
        // user validation
        if(!newUser.password || !newUser.userName || !newUser.phone)
            return reply.code(404).send({message: "user is invalid"})
        const controller = new AuthController(app, request, reply, "User")
        if(await controller.checkUserExist(newUser.userName))
            return reply.code(409).send({message: "user already exists"})
        let userinfo = await controller.createUser(newUser.companyName, newUser.firstName, newUser.lastName,newUser.password,newUser.userName, newUser.phone,newUser.options, newUser.profile)
        let payload={subject: newUser.userName}
        let token=jwt.sign(payload, 'secretkey')
        return reply.code(200).send({token, userinfo})
      });
      app.post("/signupprofile", async (request, reply) => {
        const newUser = request.body as IUser;
        // user validation
        if(!newUser.password || !newUser.userName || !newUser.phone)
            return reply.code(404).send({message: "user is invalid"})
        const controller = new AuthController(app, request, reply, "User")
        if(await controller.checkUserExist(newUser.userName))
            return reply.code(409).send({message: "user already exists"})
        let userinfo = await controller.createUserProfile(newUser.companyName, newUser.firstName, newUser.lastName,newUser.password,newUser.userName, newUser.phone,newUser.options,newUser.profile)
        let payload={subject: newUser.userName}
        let token=jwt.sign(payload, 'secretkey')
        return reply.code(200).send({token, userinfo})
      });
    // app.delete("/deleteaccount", async(request, reply)=>{
    //     const newUser = request.body as IUser;
    //     if(!newUser.userName)
    //         return reply.code(400).send({message: "username is required!"})
    //     const controller = new AuthController(app, request, reply, "User")
    //     if(!await controller.deleteAccount(newUser.userName))
    //         return reply.code(400).send({message:"Sorry you can't delete account."})
    //     return reply.code(200).send({message: "user deleted successfully"})
    // })

    app.delete("/:id",{
      preHandler: async (request, reply) =>
        protectAuthorizedUser(app, request, reply, ['user'], [], (done) => {}),
    }, async(request, reply) => {
      const id = request.params["id"];
    const data = new AuthController(
      app,
      request,
      reply,
      "User"
    ).findByIdAndDelete(id);
    return reply.code(200).send({ data: data, message: "User deleted" });
    })

    app.post("/forgetpassword", async(request,reply) => {
        const newUser = request.body as IUser;
        if(!newUser.userName || !newUser.password)
            return reply.code(404).send({message: "user is invalid"})
        const controller = new AuthController(app, request, reply, "User")
        if(await controller.updatePassword(newUser.userName, newUser.password))
            return reply.code(200).send({message:"Update password successfully"})
        return reply.code(404).send({message: "The username is incorrect."});
    })

    app.post("/updateinfo", {}, async (request, reply) => {
        const newUser = request.body as IUser;
        const controller = new AuthController(app, request, reply, "User");
        let userinfo= await controller.updateinfo(newUser.userName, newUser.firstName, newUser.lastName, newUser.companyName, newUser.phone);
        if(userinfo)
            return reply.code(200).send({message:"Update successfully", data: userinfo})
        return reply.code(404).send({message: "The username is incorrect."});

      });
    app.post("/getinfo", {}, async (request, reply) => {
        const controller = new AuthController(app, request, reply, "User");
        const newUser = request.body as IUser
        let userinfo = await controller.finduser(newUser.userName);
        if(!userinfo)
            return reply.code(400).send({message:"Sorry you can't delete account."})
        return reply.code(200).send({message: "user deleted successfully", data: userinfo})
      });
      app.get("/checkpackage", {}, async (request, reply) => {

        const profileId = request['user']['profiles'];
        const result = await new ProfileController(app, request, reply, "Profile").findById(profileId);
        return reply.code(200).send({data: result, message: "User Profile found"})
      });
    
      app.get("/:id", {}, async(request, reply) =>{
        const id = request.params['id'];
        const result = await new AuthController(app, request, reply, "User").findOne({"_id": id});
        return reply.code(200).send({data: result, message: "User with specific id found"});
      })
    
      app.get("/", {}, async(request, reply)=>{
        const controller = new AuthController(app, request, reply, "User");
        const users = await controller.find({});

        return reply.code(200).send({data: users, message: "All users are read"});
      })

      app.get("/getAllUsers", {
        preHandler: async (request, reply) =>
          protectAuthorizedUser(app, request, reply, ['user'], [], (done) => {}),
      },async(request, reply) => {
        const profileId = request["user"]["profiles"];
        const controller = new AuthController(app, request, reply, "User");
        const data = await controller.find({profile: profileId});
        return reply.code(201).send({data: data, message: "users with specific profileId found"});
      });
    
      app.get(
        "/getUserProfile",
        {
          preHandler: async (request, reply) =>
            protectAuthorizedUser(app, request, reply, ['user'], [], (done) => {}),
        },
        async (request, reply) => {
          const profileId = request["user"]["profiles"];
          return reply
            .code(200)
            .send({
              profileId: profileId,
              message: "Profile with specific owner found",
            });
        }
      );
    
      app.get(
        "/SearchByUserName/:userName",
        {
          preHandler: async (request, reply) =>
            protectAuthorizedUser(app, request, reply, ["user"], [], (done) => {}),
        },
        async (request, reply) => {
          const search = request.params['userName'];
          const controller = new AuthController(
            app,
            request,
            reply,
            "User"
          );
    
          const data = await controller.searchByUserName(search);
          
          const filterData:any | [] = [];
          data.forEach((el:any) => {
            if(el.profile == request['user']['profiles']){
              filterData.push(el);
            }
          });
          return reply
            .code(201)
            .send({ data: filterData, message: "users with specific username found" });
        }
      );
        
    next()

  }
  exports.autoPrefix = "/auth";
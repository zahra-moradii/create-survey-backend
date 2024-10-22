import fastify, { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage } from "http";
import { functions } from "lodash";
import UserController from "../../controllers/User";
import { IUser, User } from "../../models/User";


export default (
  app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: { prefix: string },
  next: (err?: Error) => void
) => {
  app.get("/", {}, async (request, reply) => {
    const controller = new UserController(app, request, reply, "User");
    const users = await controller.find({});

    return reply.code(200).send({data: users});
  });

  app.post("/", {}, async (request, reply) => {
    const newUser = request.body as IUser;
    // user validation
    // if(!newUser.firstName || !newUser.lastName || !newUser.email)
    //     return reply.code(404).send({message: "user is invalid"})

    await new UserController(app, request, reply, "User").create(newUser)
    // reply.header("Access-Control-Allow-Origin", "*");
    // reply.header("Access-Control-Allow-Methods", "POST");
    return reply.code(201).send({message: "user created"})
  });

  app.delete("/", {}, async (request, reply) => {
    const { username } = request.body as {username:string};
    if(!!username) return reply.code(400).send({message: "username is required!"})

    const data = new UserController(app, request, reply, "User").findOneAndRemove({username})

    return reply.code(200).send({data, message: "user deleted successfully"})
  })


  next();
};



exports.autoPrefix = "/users";

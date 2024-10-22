import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import PackagesController from "../../controllers/packages";

const uuid = require('uuid');

export default async(
  app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: { prefix: string },
  next: (err?: Error) => void
) => { 

  //Create
  app.post("/", {}, async (request, reply) => {
    const packageCode = uuid.v4();
    request.body['code'] = packageCode;
    const result = await new PackagesController(app, request, reply, "Package").create();

    return reply.code(201).send({data: result,message: "Package created"});
  });

  //Read All
  app.get("/", {}, async (request, reply) => {
    const controller = new PackagesController(app, request, reply, "Package");
    const packages = await controller.find({});

    return reply.code(200).send({data: packages, message: "All packages are read"});
  });

  //Read One 
  app.get("/name/:name",{},async (request, reply) => {
    const name = request.params['name'];
    const controller = new PackagesController(app,request,reply,"Package");
    const data = await controller.findOne({"name": name});

    return reply.code(200).send({data: data, message: "Package with specific name found"})
  })

  app.get("/id/:id",{},async (request, reply) => {
    const id = request.params['id'];
    const controller = new PackagesController(app,request,reply,"Package");
    const data = await controller.findById(id);

    return reply.code(200).send({data: data, message: "Package with specific id found"})
  })

  //Update
  app.put("/:id", {}, async(request, reply) => {
    const id = request.params['id'];
    const data = new PackagesController(app, request, reply, "Package").findByIdAndUpdate(id, request.body, {});
    return reply.code(200).send({data: data, message: "package Updated"})
  })

  //Delete
  app.delete("/:id", {}, async (request, reply) => {
    const id = request.params['id'];
    const data = new PackagesController(app, request, reply, "Package").findByIdAndDelete(id)
    return reply.code(200).send({data: data, message: "package deleted"})
  })

  

   next()
}


exports.autoPrefix = "/packages";
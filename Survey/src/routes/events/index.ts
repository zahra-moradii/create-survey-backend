import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import EventController from "../../controllers/event";

const uuid = require('uuid'); 

export default (
  app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: { prefix: string },
  next: (err?: Error) => void
) => { 

  //Create
  app.post("/", {}, async (request, reply) => {
    const eventCode = uuid.v4();
    request.body['code'] = eventCode;
    const result = await new EventController(app, request, reply, "Event").create();
Event
    return reply.code(201).send({data: result,message: "Event created"});
  });

  //Read All
  app.get("/", {}, async (request, reply) => {
    const controller = new EventController(app, request, reply, "Event");
    const packages = await controller.find({});

    return reply.code(200).send({data: packages, message: "All Event are read"});
  });

  //Read One 
  app.get("/name/:name",{},async (request, reply) => {
    const name = request.params['name'];
    const controller = new EventController(app,request,reply,"Event");
    const data = await controller.findOne({"name": name});

    return reply.code(200).send({data: data, message: "Event with specific name found"})
  })

  app.get("/id/:id",{},async (request, reply) => {
    const id = request.params['id'];
    const controller = new EventController(app,request,reply,"Event");
    const data = await controller.findById(id);

    return reply.code(200).send({data: data, message: "Event with specific id found"})
  })

  //Update
  app.put("/:id", {}, async(request, reply) => {
    const id = request.params['id'];
    const data = new EventController(app, request, reply, "Event").findByIdAndUpdate(id, request.body, {});
    return reply.code(200).send({data: data, message: "Event Updated"})
  })

  //Delete
  app.delete("/:id", {}, async (request, reply) => {
    const id = request.params['id'];
    const data = new EventController(app, request, reply, "Event").findByIdAndDelete(id)
    return reply.code(200).send({data: data, message: "Event deleted"})
  })

   next();
};



exports.autoPrefix = "/event";

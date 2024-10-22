import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import DiscountTypeController from "../../controllers/discountType";

const uuid = require('uuid');

export default (
  app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: { prefix: string },
  next: (err?: Error) => void
) => { 

  //Create
  app.post("/", {}, async (request, reply) => {
    const discountTypeCode = uuid.v4();
    request.body['code'] = discountTypeCode;
    const result = await new DiscountTypeController(app, request, reply, "DiscountType").create();

    return reply.code(201).send({data: result,message: "discountType created"});
  });

  //Read All
  app.get("/", {}, async (request, reply) => {
    const controller = new DiscountTypeController(app, request, reply, "DiscountType");
    const packages = await controller.find({});

    return reply.code(200).send({data: packages, message: "All discountTypes are read"});
  });

  //Read One 
  app.get("/name/:name",{},async (request, reply) => {
    const name = request.params['name'];
    const controller = new DiscountTypeController(app,request,reply,"DiscountType");
    const data = await controller.findOne({"name": name});

    return reply.code(200).send({data: data, message: "DiscountType with specific name found"})
  })

  app.get("/id/:id",{},async (request, reply) => {
    const id = request.params['id'];
    const controller = new DiscountTypeController(app,request,reply,"DiscountType");
    const data = await controller.findById(id);

    return reply.code(200).send({data: data, message: "DiscountType with specific id found"})
  })

  //Update
  app.put("/:id", {}, async(request, reply) => {
    const id = request.params['id'];
    const data = new DiscountTypeController(app, request, reply, "DiscountType").findByIdAndUpdate(id, request.body, {});
    return reply.code(200).send({data: data, message: "discountType Updated"})
  })

  //Delete
  app.delete("/:id", {}, async (request, reply) => {
    const id = request.params['id'];
    const data = new DiscountTypeController(app, request, reply, "DiscountType").findByIdAndDelete(id)
    return reply.code(200).send({data: data, message: "discountType deleted"})
  })

   next();
};



exports.autoPrefix = "/discountType";

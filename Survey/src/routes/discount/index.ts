import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import DiscountController from "../../controllers/discount";
const moment = require('moment-jalaali')

const uuid = require('uuid'); 

export default (
  app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: { prefix: string },
  next: (err?: Error) => void
) => { 

  //Create
  app.post("/", {}, async (request, reply) => {
    const discountCode = uuid.v4();
    request.body['code'] = discountCode;
    request.body['startDate'] = moment(request.body['startDate'], 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss') 
    request.body['endDate'] = moment(request.body['endDate'], 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss') 

    const result = await new DiscountController(app, request, reply, "Discount").create();
    return reply.code(201).send({data: result,message: "Discount created successfully"});
  });

  //Read All
  app.get("/", {}, async (request, reply) => {
    const controller = new DiscountController(app, request, reply, "Discount");
    const packages = await controller.find({});

    return reply.code(200).send({data: packages, message: "All Discount are read"});
  });

  //Read One 
  app.get("/:id",{},async (request, reply) => {
    const id = request.params['id'];
    const controller = new DiscountController(app,request,reply,"Discount");
    const data = await controller.findById(id);

    return reply.code(200).send({data: data, message: "Discount with specific id found"})
  })

  //Read One by packagePriceId
  app.get("/packagePriceId/:packagePriceId",{},async (request, reply) => {
    const packagePriceId = request.params['packagePriceId'];
    const controller = new DiscountController(app,request,reply,"Discount");
    const data = await controller.findOne({"packagePriceId": packagePriceId});

    return reply.code(200).send({data: data, message: "Discount with specific packagePriceId found"})
  })

  //Update
  app.put("/:id", {}, async(request, reply) => {
    const id = request.params['id'];
    const data = new DiscountController(app, request, reply, "Discount").findByIdAndUpdate(id, request.body, {});
    return reply.code(200).send({data: data, message: "Discount Updated"})
  })

  //Delete
  app.delete("/:id", {}, async (request, reply) => {
    const id = request.params['id'];
    const data = new DiscountController(app, request, reply, "Discount").findByIdAndDelete(id)
    return reply.code(200).send({data: data, message: "Discount deleted"})
  })

   next();
};

exports.autoPrefix = "/discount";

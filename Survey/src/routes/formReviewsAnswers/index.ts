import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import { replace } from "lodash";
import FormReviewsAnswersController from "../../controllers/formReviewsAnswers";
import { protectAuthorizedUser } from "../../middlewares/Authentication";
import { IFormReviewsAnswers ,FormReviewsAnswer } from "../../models/formReviewsAnswers";
const uuid = require('uuid');

export default (
  app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: { prefix: string },
  next: (err?: Error) => void
) => {

  app.post("/", {}, async (request, reply) => {
    // const newFormReview = request.body as IFormReview;

    //FormReview means dbModel from database folder index.ts dbmodelObject
    //db model must be same at point of Grammar and Syntax
    const formCode = uuid.v4();
    request.body['code'] = formCode;
    request.body['ip'] = request.ip;
    const result = await new FormReviewsAnswersController(app, request, reply, "FormReviewsAnswer").create();
    return reply.code(201).send({data: result,message: "FormReviewAnswer created"});
  });

  app.get("/", {}, async (request, reply) => {
    const controller = new FormReviewsAnswersController(app, request, reply, "FormReviewsAnswer");
    const formReviewsAnswer = await controller.find({});

    return reply.code(200).send({data: formReviewsAnswer});
  });

  app.get("/code/:code",{},async (request, reply) => {
    const code = request.params['code'];
    const controller = new FormReviewsAnswersController(app,request,reply,"FormReviewsAnswer");
    const data = await controller.findOne({"code" : code});

    return reply.code(201).send({data, message: "FormReviewAnswer with specific code found"})
  })

  app.get("/creatorId/:creatorId",{
    preHandler: async (request, reply) =>
      protectAuthorizedUser(app, request, reply, ['user'], [], (done) => {}),
  },async (request, reply) => {
    const creatorId = request.params['creatorId'];
    const controller = new FormReviewsAnswersController(app,request,reply,"FormReviewsAnswer");
    const data = await controller.find({"creatorId" : creatorId});

    return reply.code(201).send({data, message: "FormReviewAnswers with specific creatorId found"})
  })

  app.get("/formReview/:id",{},async(request, reply) =>{

    const formReview = request.params['id'];
    const controller = new FormReviewsAnswersController(app, request, reply, "FormReviewsAnswer");
    const data = await controller.find({formReviews: formReview});

    return reply.code(201).send({data: data, message: "FormReviewsAnswer with specific formReview found"});
  });
    
  app.put("/:id", {}, async(request, reply) => {
    const id = request.params['id'];
    request.body['viewBy'] = request['user']['_id'];
    const data = new FormReviewsAnswersController(app, request, reply, "FormReviewsAnswer").findByIdAndUpdate(id, request.body, {});
    return reply.code(200).send({data: data, message: "FormReviewAnswer Updated"})
  })

  app.delete("/deleteMany/:id", {
    preHandler: async (request, reply) =>
      protectAuthorizedUser(app, request, reply, ['user'], [], (done) => {}),
  }, async (request, reply) => {
    const formReviews = request.params["id"];
    const data = new FormReviewsAnswersController(
      app,
      request,
      reply,
      "FormReviewsAnswer"
    ).deleteMany({formReviews: formReviews});
    return reply.code(200).send({ data: data, message: "FormReviewAnswers deleted" });
  });
  next();
};



exports.autoPrefix = "/formReviewsAnswers";
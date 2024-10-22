import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import FormReviewsController from "../../controllers/formReviews";
import {
  protectAuthorizedUser,
  protectUserRoute,
} from "../../middlewares/Authentication";
const uuid = require("uuid");
const moment = require("moment-jalaali");

export default (
  app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: { prefix: string },
  next: (err?: Error) => void
) => {
  app.post(
    "/",
    {
      preHandler: async (request, reply) =>
        protectAuthorizedUser(app, request, reply, ["user"], [], (done) => {}),
    },
    async (request, reply) => {
      // const newFormReview = request.body as IFormReview;

      //FormReview means dbModel from database folder index.ts dbmodelObject
      //db model must be same at point of Grammar and Syntax
      const formCode = uuid.v4();
      request.body["code"] = formCode;
      request.body["userId"] = request["user"]["_id"];
      request.body["profileId"] = request["user"]["profiles"];
      const result = await new FormReviewsController(
        app,
        request,
        reply,
        "FormReview"
      ).create();
      return reply
        .code(201)
        .send({ data: result, message: "FormReview created" });
    }
  );

  app.get(
    "/",
    // {
    //   preHandler: async (request, reply) =>
    //     protectAuthorizedUser(app, request, reply, [], [], (done) => {}),
    // },
    {
      preHandler: async (request, reply) =>
        protectAuthorizedUser(app, request, reply, ["user"], [], (done) => {}),
    },
    async (request, reply) => {
      //request['user']
      const controller = new FormReviewsController(
        app,
        request,
        reply,
        "FormReview"
      );
      const formReviews = await controller.find({});

      return reply.code(200).send({
        data: formReviews,
        message: "FormReview created successfully",
      });
    }
  );

  app.delete(
    "/:id",
    {
      preHandler: async (request, reply) =>
        protectAuthorizedUser(app, request, reply, ["user"], [], (done) => {}),
    },
    async (request, reply) => {
      const id = request.params["id"];
      const data = new FormReviewsController(
        app,
        request,
        reply,
        "FormReview"
      ).findByIdAndDelete(id);
      return reply
        .code(200)
        .send({ data: data, message: "FormReview deleted" });
    }
  );

  app.get("/:id", {}, async (request, reply) => {
    const controller = new FormReviewsController(
      app,
      request,
      reply,
      "FormReview"
    );

    const data = await controller.findById(request.params["id"]);
    return reply
      .code(201)
      .send({ data: data, message: "FormReview with specific id founded" });
  });

  app.get("/code/:code", {}, async (request, reply) => {
    const code = request.params["code"];
    const controller = new FormReviewsController(
      app,
      request,
      reply,
      "FormReview"
    );
    let data = await controller.findOne({ code: code });
    return reply
      .code(201)
      .send({ data: data, message: "FormReview with specific code found" });
  });

  app.get(
    "/getByUserId",
    {
      preHandler: async (request, reply) =>
        protectAuthorizedUser(app, request, reply, ["user"], [], (done) => {}),
    },
    async (request, reply) => {
      const userId = request["user"]["_id"];
      const controller = new FormReviewsController(
        app,
        request,
        reply,
        "FormReview"
      );
      const data = await controller.find({ userId: userId });

      return reply
        .code(201)
        .send({ data: data, message: "FormReview with specific userId found" });
    }
  );

  app.get(
    "/SearchByTitle/:title",
    {
      preHandler: async (request, reply) =>
        protectAuthorizedUser(app, request, reply, ["user"], [], (done) => {}),
    },
    async (request, reply) => {
      const search = request.params['title'];
      const controller = new FormReviewsController(
        app,
        request,
        reply,
        "FormReview"
      );

      const data = await controller.searchByTitle(search);
      
      const filterData:any | [] = [];
      data.forEach((el:any) => {
        if(el.userId == request['user']['_id']){
          filterData.push(el);
        }
      });
      return reply
        .code(201)
        .send({ data: filterData, message: "FormReview with specific text found" });
    }
  );

  app.get(
    "/SearchByCode/:code",
    {
      preHandler: async (request, reply) =>
        protectAuthorizedUser(app, request, reply, ["user"], [], (done) => {}),
    },
    async (request, reply) => {
      const search = request.params['code'];
      const controller = new FormReviewsController(
        app,
        request,
        reply,
        "FormReview"
      );

      const data = await controller.searchByCode(search);
      
      const filterData:any | [] = [];
      data.forEach((el:any) => {
        if(el.userId == request['user']['_id']){
          filterData.push(el);
        }
      });
      return reply
        .code(201)
        .send({ data: filterData, message: "FormReview with specific text found" });
    }
  );

  app.get(
    "/profileId",
    {
      preHandler: async (request, reply) =>
        protectAuthorizedUser(app, request, reply, ["user"], [], (done) => {}),
    },
    async (request, reply) => {
      const profileId = request['user']['profiles'];
      const controller = new FormReviewsController(
        app,
        request,
        reply,
        "FormReview"
      );
      const data = await controller.find({ profileId: profileId });

      return reply.code(201).send({
        data: data,
        message: "FormReview with specific profileId found",
      });
    }
  );

  //Update
  app.put(
    "/:id",
    {
      preHandler: async (request, reply) =>
        protectAuthorizedUser(app, request, reply, ["user"], [], (done) => {}),
    },
    async (request, reply) => {
      const id = request.params["id"];
      const data = new FormReviewsController(
        app,
        request,
        reply,
        "FormReview"
      ).findByIdAndUpdate(id, request.body, {});
      return reply
        .code(200)
        .send({ data: data, message: "FormReview Updated" });
    }
  );

  next();
};

exports.autoPrefix = "/formReviews";

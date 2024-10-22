import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import ProfileController from "../../controllers/profile";
import { IProfile } from "../../models/Profile";

export default (
  app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: { prefix: string },
  next: (err?: Error) => void
) => {
  app.post("/", {}, async (request, reply) => {
    const newProfile = request.body as IProfile;

    const profile = await new ProfileController(
      app,
      request,
      reply,
      "Profile"
    ).create(newProfile);
    return reply
      .code(201)
      .send({ data: profile, message: "Profile created successfully" });
  });

  app.put("/:id", {}, async (request, reply) => {
    const id = request.params["id"];
    const result = new ProfileController(
      app,
      request,
      reply,
      "Profile"
    ).findByIdAndUpdate(id, request.body, {});
    return reply
      .code(200)
      .send({ data: result, message: "profile updated successfully" });
  });

  app.put("/update", {}, async (request, reply) => {
    const id = request['user']['profiles'];
    const result = new ProfileController(
      app,
      request,
      reply,
      "Profile"
    ).findByIdAndUpdate(id, request.body, {});
    return reply
      .code(200)
      .send({ data: result, message: "profile updated successfully" });
  });

  app.get("/:id", {}, async (request, reply) => {
    const id = request.params["id"];
    const result = await new ProfileController(
      app,
      request,
      reply,
      "Profile"
    ).findOne({ _id: id });
    return reply
      .code(200)
      .send({ data: result, message: "Profile with specific id found" });
  });

  next();
};

exports.autoPrefix = "/profile";

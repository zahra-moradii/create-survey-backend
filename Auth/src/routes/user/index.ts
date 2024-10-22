import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import UserController from "../../controllers/User";
import { protectAuthorizedUser } from "../../middlewares/Authentication";
import { IUser } from "../../models/User";

export default (
  app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: { prefix: string },
  next: (err?: Error) => void
) => {
  app.get(
    "/",
    {
      preHandler: async (request, reply) =>
        protectAuthorizedUser(app, request, reply, [], [], (done) => {}),
    },
    async (request, reply) => {
      console.log("User Info From Req : ", request["user"]);
      const controller = new UserController(app, request, reply, "User");
      const users = await controller.find({});

      return reply.code(200).send({ data: users });
    }
  );

  app.post("/", {}, async (request, reply) => {
    const newUser = request.body as IUser;
    // user validation
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.password ||
      !newUser.userName
    )
      return reply.code(404).send({ message: "user is invalid" });

    const user = await new UserController(app, request, reply, "User").create(
      newUser
    );
    return reply.code(201).send({ data: user, message: "user created" });
  });

  app.delete("/", {}, async (request, reply) => {
    const { username } = request.body as { username: string };
    if (!!username)
      return reply.code(400).send({ message: "username is required!" });

    const data = new UserController(
      app,
      request,
      reply,
      "User"
    ).findOneAndRemove({ username });

    return reply.code(200).send({ data, message: "user deleted successfully" });
  });

  next();
};

exports.autoPrefix = "/users";

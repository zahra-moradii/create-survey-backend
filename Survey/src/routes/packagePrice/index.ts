import { FastifyInstance } from "fastify";
import { Server, ServerResponse, IncomingMessage, request } from "http";
import { replace } from "lodash";
import PackagePricesController from "../../controllers/packagePrices";
import BuyPackagesController from "../../controllers/toBuyPackages";
import axios from "axios";
import { use } from "chai";
import OrderController from "../../controllers/Orders";
import { Orders } from "../../models/Orders";
import { Profile } from "../../models/Profile";
interface RequestPaymentZarinPalInput {
  order_id: string;
  amount: number;
  name: string;
  phone: string;
  mail: string;
  callback: string;
  desc: string;
}
interface InputPayment {
  id: string;
  order_id: string;
  track_id: number;
  status: string;
}
export default async (
  app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  opts: { prefix: string },
  next: (err?: Error) => void
) => {
  //Create
  app.post("/", {}, async (request, reply) => {
    const result = await new PackagePricesController(
      app,
      request,
      reply,
      "PackagePrice"
    ).create();

    return reply
      .code(201)
      .send({ data: result, message: "packagePrice created" });
  });

  //Read All
  app.get("/", {}, async (request, reply) => {
    const controller = new PackagePricesController(
      app,
      request,
      reply,
      "PackagePrice"
    );
    const packages = await controller.find({});

    return reply
      .code(200)
      .send({ data: packages, message: "All packagePrice are read" });
  });
  //---------------------------------------------------------------------------------------------
  //Payment:

  app.post("/orderrequest", {}, async (request, reply) => {
    const package_id = request.body["package"];
    console.log(package_id);
    const tax = 0.09;
    const packagePriceInfo = await app.db.PackagePrice.findOne({
      packageId: package_id,
    });
    console.log("packagePriceInfo", packagePriceInfo);
    const discountInfo = await app.db.Discount.findOne({
      packagePriceId: packagePriceInfo._id,
    });
    let discount = 0;
    let discount_id = null;
    if (!!discountInfo) {
      discount = discountInfo.percent;
      discount_id = discountInfo._id;
    }
    console.log("discount", discount);
    const priceCalculated =
      discount > 0
        ? packagePriceInfo.price - (packagePriceInfo.price * discount) / 100
        : packagePriceInfo.price;
    const amount = Math.round(priceCalculated + priceCalculated * tax) * 10;
    console.log("amount", amount);

    if (!packagePriceInfo)
      return reply.code(400).send({ message: "must be exist!" });
    const profile = await app.db.Profile.findOne({
      _id: request["user"]["profiles"],
    });
    const user = await app.db.User.findOne({ _id: request["user"]["_id"] });
    console.log(request["user"]["_id"]);
    console.log("profile", request["user"]["profiles"]);
    console.log(user);
    const order = await Orders.create({
      user: user,
      profile: profile,
      packageprice: packagePriceInfo,
      discount: discountInfo,
      totalprice: amount,
      pureprice: packagePriceInfo.price,
      taxperc: tax * 100,
      taxprice: Math.round(priceCalculated * tax),
      disprice: Math.round((packagePriceInfo.price * discount) / 100),
      gateway: null,
      gatewayCode: null,
      gatewayReq: null,
      gatewayAns: null,
      paytype: null,
      fishvarizi: null,
      isSuccesspay: false,
      status: null,
      monyunit: null,
    });
    await order.save();
    if (packagePriceInfo.price > 0) {
      console.log(order);
      const controller = new BuyPackagesController(app, request, reply, "");
      //orderid means order inserted record id
      const userFullname = user.firstName + user.lastName;
      const legalname = user.companyName;
      let names;
      if (user.options == "User") names = userFullname;
      else names = legalname;
      let zarinpalInput: RequestPaymentZarinPalInput = {
        order_id: order._id.toString(),
        amount: amount,
        name: names,
        phone: user.phone,
        mail: user.userName,
        desc: "توضیحات پرداخت کننده",
        callback: "http://localhost:4200/Packageshopcard/bill",
      };
      console.log("zarinpalInput", zarinpalInput);
      const orderInfo = await controller.requestPayment(zarinpalInput);
      //update order record -> request
      await Orders.updateOne(
        { _id: order._id },
        { gatewayReq: orderInfo.id, gateway: orderInfo.link }
      );
      await order.save();

      console.log("orderInfo", orderInfo);
      if (!orderInfo) return reply.code(404).send({ message: "incorrect." });

      return reply.code(200).send({
        message: "correct.",
        data: orderInfo,
        isGatewayRedirectRequired: true,
      });
    } else {
      return reply.code(200).send({
        message: "correct.",
        data: { order_id: order._id, id: order._id },
        isGatewayRedirectRequired: false,
      });
    }
  });
  //==============================================================================

  app.post("/orderverify", {}, async (request, reply) => {
    const info = request.body as InputPayment;
    console.log(info);
    const id = info.id;
    const order_id = info.order_id;
    const track_id = info.track_id;
    const status = info.status;
    if (status !== "10")
      return reply.code(404).send({ message: "incorrect1." });
    const order = await app.db.Orders.findOne({ _id: order_id });
    if (order.packageprice["price"] > 0 && order.gatewayReq.toString() !== id)
      return reply.code(404).send({ message: "incorrect2." });

    const controller = new BuyPackagesController(app, request, reply, "");
    const user = await app.db.User.findOne({ _id: order.user["_id"] });
    console.log("User From Verify : ", user);
    const profile = await app.db.Profile.findOne({ _id: order.profile["_id"] });
    console.log("profile From Verify : ", profile);
    const packagesprice = await app.db.PackagePrice.findOne({
      _id: order.packageprice["_id"],
    });
    console.log("packagesprice From Verify : ", packagesprice);
    const packages = await app.db.Package.findOne({
      _id: packagesprice.packageId,
    });
    console.log("packages From Verify : ", packages);
    const discountInfo = await app.db.Discount.findOne({
      packagePriceId: order.packageprice,
    });
    console.log("discountInfo From Verify : ", discountInfo);
    const userFullname = user.firstName + user.lastName;
    const legalname = user.companyName;
    let names;
    if (user.options == "User") names = userFullname;
    else names = legalname;

    let returnvalue = {
      user: names,
      order_id: order_id,
      packagename: packages.name,
      packagetime: packagesprice.duration,
      price: packagesprice.price,
      forms: packagesprice.forms,
      users: packagesprice.users,
      tax: order.taxperc,
      discount: discountInfo ? discountInfo.percent : 0,
      amount: order.totalprice,
      createdat: order["createdat"],
    };

    let orderInfo =
      order.packageprice["price"] > 0
        ? await controller.verifyPayment(id, order_id)
        : undefined;
    //update order record -> request
    console.log("orderInfo", orderInfo);
    if (!orderInfo && order.packageprice["price"] > 0)
      return reply.code(404).send({ message: "incorrect3." });

    await Orders.updateOne(
      { _id: order._id },
      {
        gatewayCode: orderInfo ? orderInfo.track_id : null,
        fishvarizi: orderInfo ? orderInfo.payment.track_id : null,
        status: orderInfo ? orderInfo.status : null,
        isSuccesspay: true,
      }
    );
    await order.save();
    await Profile.updateOne(
      { owner: request["user"]["_id"] },
      { packagePrice: packagesprice }
    );
    await profile.save();
    return reply.code(200).send({ message: "correct.", data: returnvalue });
  });

  app.get("/allorders/:page/:limit", {}, async (request, reply) => {
    const controller = new OrderController(app, request, reply, "Orders");
    const orders = await controller.findByPaginate({}, {});
    console.log(orders.docs);
    return reply
      .code(200)
      .send({ data: orders, message: "All orders are read" });
  });

  app.get("/getOrderByUserId/:page/:limit", {}, async (request, reply) => {
    const userId = request["user"]["_id"];
    console.log("IDDDD", request["user"]["_id"]);
    const user = await app.db.User.findOne({ _id: request["user"]["_id"] });
    const controller = new OrderController(app, request, reply, "Orders");
    const data = await controller.findByPaginate({ "user._id": user._id }, {});
    console.log("data", data);
    return reply
      .code(201)
      .send({ data: data, message: "FormReview with specific userId found" });
  });
  app.get("/getOrder/:id", {}, async (request, reply) => {
    const id = request.params["id"];
    const controller = new OrderController(app, request, reply, "Orders");
    const data = await controller.findById(id);

    return reply
      .code(200)
      .send({ data: data, message: "order with specific id found" });
  });

  //Read One
  app.get("/:id", {}, async (request, reply) => {
    const id = request.params["id"];
    const controller = new PackagePricesController(
      app,
      request,
      reply,
      "PackagePrice"
    );
    const data = await controller.findById(id);

    return reply
      .code(200)
      .send({ data: data, message: "packagePrice with specific id found" });
  });

  //Read by packageId
  app.get("/packageId/:packageId", {}, async (request, reply) => {
    const packageId = request.params["packageId"];
    const controller = new PackagePricesController(
      app,
      request,
      reply,
      "PackagePrice"
    );
    const data = await controller.findOne({ packageId: packageId });

    return reply
      .code(200)
      .send({ data, message: "packagePrice with specific packageId found" });
  });

  //Update
  app.put("/:id", {}, async (request, reply) => {
    const id = request.params["id"];
    const data = new PackagePricesController(
      app,
      request,
      reply,
      "PackagePrice"
    ).findByIdAndUpdate(id, request.body, {});
    return reply
      .code(200)
      .send({ data: data, message: "packagePrice Updated" });
  });

  //Delete
  app.delete("/:id", {}, async (request, reply) => {
    const id = request.params["id"];
    const data = new PackagePricesController(
      app,
      request,
      reply,
      "PackagePrice"
    ).findByIdAndDelete(id);
    return reply
      .code(200)
      .send({ data: data, message: "packagePrice deleted" });
  });

  next();
};

exports.autoPrefix = "/packagePrices";

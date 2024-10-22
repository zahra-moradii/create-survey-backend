// import { PackagePrice } from '../../models/packagePrices';
// import { FastifyInstance } from "fastify";
// import { Server, ServerResponse, IncomingMessage, request } from "http";
// import { replace } from "lodash";
// import BuyPackagesController from "../../controllers/toBuyPackages";

// interface RequestPaymentZarinPalInput {
//     amount:number,
//     callback_url:string,
//     description:string,
//     mobile:string,
//     userName:string;
// }

// export default async(
//   app: FastifyInstance<Server, IncomingMessage, ServerResponse>,
//   opts: { prefix: string },
//   next: (err?: Error) => void
// ) => { 

//     //request.body['package]
//     app.post("/orderrequest",{},async (request, reply) => {
        
//         const package_id = request.body['package'];
//         const tax = 0.09;
//         const packagePriceInfo = await app.db.PackagePrice.findById(package_id);
//         // const PackagePrice_id = await 
//         const discountInfo = await app.db.Discount.findOne({"packagePriceId" : packagePriceInfo._id} );
//         const discount = discountInfo.percent;
//         console.log("discount", discount);
//         const priceCalculated = discount > 0 ?
//         packagePriceInfo.price - (packagePriceInfo.price * discount) : packagePriceInfo.price;
//         const amount = priceCalculated + (priceCalculated * tax);
//         console.log("amount", amount);

//         if(!packagePriceInfo)
//             return reply.code(400).send({message: "must be exist!"})
        
//         const user = await app.db['User'].findById(request['user'['_id']]);


//         const controller = new BuyPackagesController(app,request,reply,"");
//         let zarinpalInput : RequestPaymentZarinPalInput = {
//             amount:amount,
//             description:"hello world!!!",
//             callback_url:"",
//             userName:user.userName,
//             mobile:user.phone
//         }
//         let orderInfo = await controller.requestPayment(zarinpalInput);
//          if(!orderInfo)
//              return reply.code(404).send({message: "incorrect."});
       
//         return reply.code(200).send({orderInfo})
//       })

//       //request.body['authority]
//       app.post("/orderverify",async (request, reply) => {
//         //Step 1 : select order record by authority code from body
//         //Step 2 : check userid of order record equal to user id from request
//         //Step 3 : fill zarinpal verify method input from order record.  authority: string, amount: number,
//         //Step 4 : call zarinpal verify api axios
//         //Step 5 : response zarinapl verify to front
//       });

//       //request.body['authority]
//       app.post("/orderbill",async (request, reply) => {
//         //Step 1 : select order record by authority code from body
//         //Step 2 : check userid of order record equal to user id from request
//         //Step 3 : return order record finded to front
//       });
//       app.get("/",{}, async (request, reply) => {
//         //Step 1 : select order record by authority code from body
//         //Step 2 : check userid of order record equal to user id from request
//         //Step 3 : return order record finded to front
//         return reply.send("hello")
//       });

//  next();

// };



// exports.autoPrefix = "/toBuyPackages";
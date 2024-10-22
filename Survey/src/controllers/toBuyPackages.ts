import Controller from "../utils/Controller"
import axios from 'axios';

interface RequestPaymentZarinPalInputtttt {
  order_id: string,
  amount: number,
  name: string,
  phone: string,
  mail: string,
  desc: string,
  callback: string,
   }
interface RequestPaymentResult{
  code: string,
  message: string,
  authority: string,
  fee_type: string,
  fee: string,
  url: string,
}

class BuyPackagesController extends Controller {
    

async requestPayment(
  args: RequestPaymentZarinPalInputtttt,
) {
  //   // `data` is of type ServerData, correctly inferred
  let res = await axios.post<any>
  (
    "https://api.idpay.ir/v1.1/payment", 
     args,
    {headers: {'Content-Type': 'application/json','X-API-KEY': 'd72a169e-337f-451e-985e-53977dc0d6c9','X-SANDBOX': 1}},
   
    
  )
    console.log("Axios IdPay Request Response : ", res);
    return(res.data)

  };


async verifyPayment(
  id: string,
  order_id: string,
): Promise<any> {
  let verifyInput= {
    id:id,
    order_id: order_id
    };
  console.log(verifyInput);
  let res = await axios.post<any>
  (
    "https://api.idpay.ir/v1.1/payment/verify", 
    verifyInput,
    {headers: {'Content-Type': 'application/json','X-API-KEY': 'd72a169e-337f-451e-985e-53977dc0d6c9','X-SANDBOX': 1}},
   
    
  )
    console.log("response", res);
    return(res.data)
}

}

export default BuyPackagesController;

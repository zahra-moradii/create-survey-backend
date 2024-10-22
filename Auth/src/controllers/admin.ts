import Controller from "../utils/Controller"
import {User} from "../models/User"

class AdminController extends Controller  {

    async findUser(username : string){
      const UserData = {
        firstName:"",
        lastName:"",
        companyName:"",
        userName:"",
        options:"",
        phone:"",
        permission:{},
        active:"",
      
      };
      const user = await User.findOne({userName: username});
      if(await user){
        if(user.options=="Legal")
          UserData.companyName =  user.companyName
        else
        {
            UserData.firstName=  user.firstName;
            UserData.lastName=  user.lastName;
        }
        UserData.userName= user.userName;
        UserData.options= user.options;
        UserData.phone= user.phone;
        UserData.permission=user.permissions;
        UserData.active=user.active;
        return UserData}
        
      return false;
      
    }
    

  async ActiveAccount(username:string) :Promise<boolean>{
    const user = await User.updateOne({userName: username} ,{active: 'true'}, {new: true});
    return true;
    }
  async InActiveAccount(username:string) :Promise<boolean>{
    const user = await User.updateOne({userName: username} ,{active: 'false'}, {new: true});
    return true;
  }
}



export default AdminController;
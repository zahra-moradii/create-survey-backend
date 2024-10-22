import * as bcrypt from "bcryptjs";


//We don't need to define class, Just export functions(hash & compare)
class PasswordManagement {
     hash(password : string) :string {

           return bcrypt.hashSync(password, 5);
    }
    compare(password:string, hashpassword:string){
            return bcrypt.compareSync(password, hashpassword);
    }


}
export default PasswordManagement;
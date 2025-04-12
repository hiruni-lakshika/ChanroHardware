import {Employee} from "./employee";
import {Role} from "./role";
import {UserStatus} from "./userstatus";
import {UserType} from "./usertype";


export interface User {
  id:number;
  username:string;
  password:string;
  user:User;
  docreated:string;
  tocreated:string;
  userstatus:UserStatus;
  role:Role;
  description:string;
  usertype:UserType;
}

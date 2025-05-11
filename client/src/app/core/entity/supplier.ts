import {Gender} from "./gender";
import {EmployeeType} from "./employeetype";
import {Designation} from "./designation";
import {EmployeeStatus} from "./employeestatus";
import {Employee} from "./employee";
import {SupplierStatus} from "./supplierstatus";
import {Supply} from "./supply";

export interface Supplier {
  id?: number;
  name?:string;
  address?:string;
  tpoffice?:string;
  email?:string;
  contactperson?:string;
  tpcontact?:string;
  description?:string;
  doregistered?:string;
  supplierstatus?:SupplierStatus;
  employee?:Employee;
  supplies?:Array<Supply>;
}

import {SupplierComponent} from "../../modules/supplier/supplier/supplier.component";
import {Employee} from "./employee";
import {Supplier} from "./supplier";

export interface Purchaseorder {
  id? : number;
  number? : number;
  doexpected? : string;
  expectedtotal? : number;
  description? : string;
  date? : string;
  employee? : Employee;
  postatus? : Postatus;
  supplier? : Supplier;
}

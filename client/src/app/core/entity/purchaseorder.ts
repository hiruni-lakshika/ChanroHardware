import {Employee} from "./employee";
import {Supplier} from "./supplier";
import {POStatus} from "./postatus";
import {POItem} from "./poitem";

export interface Purchaseorder {
  id? : number;
  number? : number;
  doexpected? : string;
  expectedtotal? : number;
  description? : string;
  date? : string;
  employee? : Employee;
  postatus? : POStatus;
  supplierIdsupplier? : Supplier;
  poitems?:Array<POItem>;
}

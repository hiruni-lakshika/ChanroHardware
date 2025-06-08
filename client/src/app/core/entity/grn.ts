import {Purchaseorder} from "./purchaseorder";
import {Supplier} from "./supplier";

export interface Grn {
  id? : number;
  doreceived? : string;
  grandtotal? : number;
  purchaseorder_id? : Purchaseorder;
  grnstatus_id? : Grn;
  supplier_id? : Supplier;
}

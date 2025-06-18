import {Purchaseorder} from "./purchaseorder";
import {Supplier} from "./supplier";
import {GrnItem} from "./grnitem";
import {GrnStatus} from "./grnstatus";

export interface Grn {
  id? : number;
  code? : string;
  doreceived? : string;
  grandtotal? : number;
  purchaseorder? : Purchaseorder;
  grnstatus? : GrnStatus;
  supplierIdsupplier? : Supplier;
  grnitems? : Array<GrnItem>;
}


import {Supplier} from "./supplier";
import {Category} from "./category";

export class Supply{
  id: number
  supplierIdsupplier:Supplier
  category:Category

  constructor(id: number, supplierIdsupplier: Supplier, category: Category) {
    this.id = id;
    this.supplierIdsupplier = supplierIdsupplier;
    this.category = category;
  }
}

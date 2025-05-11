import {Supplier} from "./supplier";
import {Category} from "./category";

export class Supply{
  id: number
  category:Category

  constructor(id: number, category: Category) {
    this.id = id;
    this.category = category;
  }
}

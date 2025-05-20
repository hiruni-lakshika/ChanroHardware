import {SubCategory} from "./subcategory";

export interface Item{
  id:number;
  name?:string;
  cost?:number;
  subcategory?:SubCategory;
}


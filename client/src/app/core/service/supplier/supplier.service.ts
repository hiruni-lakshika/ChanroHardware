import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Supplier} from "../../entity/supplier";

const API_URL = environment.apiUrl+"/suppliers";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http:HttpClient) { }

  getAll(query:string){
    return this.http.get<Supplier[]>(API_URL+query);
  }

  save(supplier:Supplier){
    return this.http.post<Supplier>(API_URL,supplier);
  }

  update(supplier:Supplier){
    return this.http.put<Supplier>(API_URL,supplier);
  }

  delete(id:number){
    return this.http.delete(API_URL+"/"+id);
  }
}

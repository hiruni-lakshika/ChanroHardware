import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Purchaseorder} from "../../entity/purchaseorder";


const apiurl =environment.apiUrl+"/purchaseorders";

@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService {

  constructor(private http: HttpClient) { }

  getAll(query:string){
    return this.http.get<Purchaseorder[]>(apiurl+query)
  }

  save(purchaseorder : Purchaseorder){
    return this.http.post<Purchaseorder>(apiurl,purchaseorder)
  }

  update(purchaseorder: Purchaseorder){
    return this.http.put<Purchaseorder>(apiurl,purchaseorder)
  }

  delete(id:number){
    return this.http.delete<Purchaseorder>(apiurl+"/"+id)
  }
}

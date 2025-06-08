import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Purchaseorder} from "../../entity/purchaseorder";
import {Grn} from "../../entity/grn";


const apiurl= environment.apiUrl+"/grns";

@Injectable({
  providedIn: 'root'
})
export class GrnService {

  constructor(private http: HttpClient) { }

  getAll(query:string){
    return this.http.get<Grn[]>(apiurl+query)
  }

  save(grn : Grn){
    return this.http.post<Grn>(apiurl,grn)
  }

  update(grn: Grn){
    return this.http.put<Grn>(apiurl,grn)
  }

  delete(id:number){
    return this.http.delete<Grn>(apiurl+"/"+id)
  }
}

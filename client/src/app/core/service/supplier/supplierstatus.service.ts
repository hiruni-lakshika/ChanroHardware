import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {SupplierStatus} from "../../entity/supplierstatus";

const API_URL = environment.apiUrl+"/supplierstatuses";

@Injectable({
  providedIn: 'root'
})
export class SupplierstatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<SupplierStatus[]>(API_URL)
  }
}

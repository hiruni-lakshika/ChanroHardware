import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Grn} from "../../entity/grn";
import {GrnStatus} from "../../entity/grnstatus";

const apiurl= environment.apiUrl+"/grnstatuses";

@Injectable({
  providedIn: 'root'
})
export class GrnstatusService {

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get<GrnStatus[]>(apiurl);
  }
}

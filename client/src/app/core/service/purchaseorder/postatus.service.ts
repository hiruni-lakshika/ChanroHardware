import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {POStatus} from "../../entity/postatus";
import {environment} from "../../../environment";

const API_URL = environment.apiUrl + "/postatuses";

@Injectable({
  providedIn: 'root'
})
export class PostatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<POStatus[]>(API_URL);
  }
}

import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../../entity/user";

const apiurl = environment.apiUrl+"/users";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  getAll(query:string){
    console.log(apiurl+query);
    return this.http.get<User[]>(apiurl+query)
  }
}

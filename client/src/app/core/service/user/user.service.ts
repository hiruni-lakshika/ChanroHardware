import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";

const apiurl = environment.apiUrl+"/users";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  getAll(){
    return this.http.get<UserType[]>(apiurl)
  }
}

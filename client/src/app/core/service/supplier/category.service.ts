import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Category} from "../../entity/category";

const API_URL = environment.apiUrl+"/categories";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<Category[]>(API_URL)
  }
}

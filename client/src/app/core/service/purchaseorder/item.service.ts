import { Injectable } from '@angular/core';
import {environment} from "../../../environment";
import {HttpClient} from "@angular/common/http";
import {Item} from "../../entity/item";

const API_URL = environment.apiUrl + "/items";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<Item[]>(API_URL);
  }
}

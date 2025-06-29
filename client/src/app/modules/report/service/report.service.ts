import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CountByDesignation} from "../entity/count-by-designation";
import {environment} from "../../../environment";

const API_URL = environment.apiUrl+'/admin/reports';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }

  countByDesignation(){
    return this.http.get<CountByDesignation[]>(API_URL + "/countbydesignation");
  }
}

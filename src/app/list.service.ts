import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as listData from '../Model/data.json';
@Injectable({
  providedIn: 'root'
})
export class ListService {
  constructor(private http: HttpClient) {
  }

  getListData(){
    return listData;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as listData from '../Model/data.json';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
 searchObject = new BehaviorSubject({});
 themeToggle = new BehaviorSubject(false);
  constructor(
    private http: HttpClient,
   
  ) {
  }

  getListData(){
    return listData;
  }

  getById(param:any){
    let data = Object.entries(listData);
    const found:any = data.find((el) => el[1].id == param);
    return found[1];
  }

  search(param:any) {
    this.searchObject.next(param);
  }
}

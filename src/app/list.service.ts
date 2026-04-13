import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as listData from '../Model/data.json';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  searchObject = new BehaviorSubject<any>({});
  themeToggle = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  // Helper to get a clean array for Orama
  getCleanListData(): any[] {
    const data = listData as any;
    // Removing the metadata/default exports that come with JSON imports
    return Object.values(data).filter(item => typeof item === 'object' && item !== null && 'id' in item);
  }

  getListData() {
    return listData;
  }

  getById(param: any) {
    const data = this.getCleanListData();
    return data.find((el) => el.id == param);
  }

  search(param: any) {
    this.searchObject.next(param);
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListService } from 'src/app/list.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {
  listData:any[]=[];
  listDataShort:any[]=[];
  data:any[]=[];
  showMore = false;
  
  constructor(
    private List: ListService,    private router: Router
  ) { }

  ngOnInit(): void {
     this.getListData();
     this.List.searchObject.subscribe(value => {
        if(Object.keys(value).length === 0){
          this.listDataShort = this.data;
        } else {
          this.searchList(value);
        }
     });
  }

  getListData() {
    const data = this.List.getListData();
    this.listData = Object.keys(data).map((key:any) => ({index:key, value: data[key]})).slice(0, -2);
    this.data = Object.keys(data).map((key:any) => ({index:key, value: data[key]})).slice(0, -8);
    const mappedShort = Object.keys(data).map((key:any) => ({index:key, value: data[key]})).slice(0, -8);
    this.listDataShort = mappedShort;
  }

  getImageUrl(item:any) {
    return item.substring(2)
  }

  searchList(param:any) {
    const paramCopy = JSON.parse(JSON.stringify(param));
   
    if(paramCopy !== false){
      if(paramCopy.fulltime === true) {
        paramCopy.fulltime = 'Full Time';
      } else {
        paramCopy.fulltime = '';
      }
      let data = [...this.listDataShort].filter(obj => 
        obj.value.position.toLowerCase().includes(paramCopy.general.toLowerCase())
        &&
        obj.value.location.toLowerCase().includes(paramCopy.location.toLowerCase())
        &&
        obj.value.contract.toLowerCase().includes(paramCopy.fulltime.toLowerCase())
      );
      this.listDataShort = data;
    }
  }

  toggleEntry(param:any) {
    const jobId = param.value.id;
    this.router.navigate([`/job/${jobId}`])
  }

  toggleShowMore() {
    if(this.showMore === false){
      this.listDataShort = this.listData;
      this.showMore = true;
    } else {
      this.listDataShort = this.data;
      this.showMore = false;
    }
    
  }
}

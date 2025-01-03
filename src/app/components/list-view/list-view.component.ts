import { Component, OnInit } from '@angular/core';
import { ListService } from 'src/app/list.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {
  listData:any[]=[];
  constructor(private List: ListService) { }

  ngOnInit(): void {
     this.getListData();
  } 

  getListData(){
    const data = this.List.getListData();
    const mapped = Object.keys(data).map((key:any) => ({index:key, value: data[key]})).slice(0, -2);
    this.listData = mapped;
  }
  getImageUrl(item:any){
    console.log(item);
    return item.substring(2)
  }

}

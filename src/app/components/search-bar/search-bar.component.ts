import { Component, OnInit } from '@angular/core';
import { ListService } from 'src/app/list.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  filter = {
      general:'',
      location: '',
      fulltime: false
  }
  filterToggle:boolean = false;
  constructor(private List: ListService) { }

  search(){
    this.List.search(this.filter);
  }
  clear() {
    this.filter = {
      general:'',
      location: '',
      fulltime: false
  }

  this.List.searchObject.next(false);
  }
  toggleFilter() {
    this.filterToggle = !this.filterToggle;
  }
  ngOnInit(): void {
  }

}

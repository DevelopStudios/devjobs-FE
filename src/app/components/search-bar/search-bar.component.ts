import { Component, inject, OnInit } from '@angular/core';
import { ListService } from 'src/app/list.service';
import { SmartSearchService } from 'src/app/shared/smart-search.service'; // Adjust path

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    standalone: false
})
export class SearchBarComponent implements OnInit {
  filter = {
      general:'',
      location: '',
      fulltime: false
  }
  filterToggle: boolean = false;
  
  // Inject the service to use its signals in the template
  public smartSearch = inject(SmartSearchService);
  private List = inject(ListService);

  search() {
    // Only trigger search if the model is ready, or let it fallback to standard
    this.List.search(this.filter);
  }

  clear() {
    this.filter = {
      general: '',
      location: '',
      fulltime: false
    };
    this.List.searchObject.next(false);
  }

  toggleFilter() {
    this.filterToggle = !this.filterToggle;
  }

  ngOnInit(): void {
  }
}
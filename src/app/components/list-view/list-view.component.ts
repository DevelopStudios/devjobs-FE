import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from 'src/app/list.service';

interface Listing {
  id: number,
  company: string,
  logo: string,
  logoBackground: string,
  position: string,
  postedAt: string,
  contract: string,
  location: string,
  website: string,
  apply: string,
  description: string,
  requirements: {
    content: string,
    items: string[]
    },
  role: {
  content: string,
  items: string[]
  }
}


@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {
  Listings:Listing[]=[];
  filteredListings:Listing[]=[];
  diplayedListings: Listing[]=[];
  itemsToShowInitially = 5;
  itemsToLoadOnScroll = 5;
  showMoreButtonVisible = false;
  searchParams: any = {};
  constructor(
    private List: ListService,    private router: Router
  ) { }

  ngOnInit(): void {
     this.getListData();
     this.List.searchObject.subscribe(value => {
      if (Object.keys(value).length > 0){
        this.searchList(value);
      }
     });
  }

  getListData() {
    this.applyFilterAndPaginate();
    let data:Listing[] = this.List.getListData();
    this.Listings = Object.entries(data).slice(0, -2).map(([key,value]) => value as Listing);
    this.diplayedListings = this.Listings.slice(0, this.itemsToShowInitially);
    this.showMoreButtonVisible = this.Listings.length > this.diplayedListings.length;
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
      this.searchParams = paramCopy;
      this.applyFilterAndPaginate();
    }
  }

  applyFilterAndPaginate(){
    this.filteredListings = this.Listings.filter(obj => {
      const generalMatch = obj.position.toLowerCase().includes(this.searchParams.general.toLowerCase());
      const locationMatch = obj.location.toLowerCase().includes(this.searchParams.location.toLowerCase());
      const fulltimeMatch = obj.contract.toLowerCase().includes(this.searchParams.fulltime.toLowerCase());
      return generalMatch && locationMatch && fulltimeMatch;
    });
    this.diplayedListings = this.filteredListings.slice(0, this.itemsToShowInitially);
    this.showMoreButtonVisible = this.filteredListings.length > this.diplayedListings.length;
  }

  toggleEntry(param:any) {
    const jobId = param.id;
    this.router.navigate([`/job/${jobId}`])
  }

  toggleShowMore() {
    const nextItems = this.Listings.slice(
      this.diplayedListings.length,
      this.diplayedListings.length + this.itemsToLoadOnScroll
    );
    this.diplayedListings = [...this.diplayedListings,...nextItems];
    this.showMoreButtonVisible = this.Listings.length > this.diplayedListings.length;
  }
}

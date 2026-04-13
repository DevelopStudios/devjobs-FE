import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, switchMap, from } from 'rxjs';
import { ListService } from 'src/app/list.service';
import { SmartSearchService } from 'src/app/shared/smart-search.service';

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
  styleUrls: ['./list-view.component.scss'],
  standalone: false
})

export class ListViewComponent implements OnInit {
  Listings: Listing[] = [];
  filteredListings: Listing[] = [];
  displayedListings: Listing[] = [];
  itemsToShowInitially = 10;
  itemsToLoadOnScroll = 5;
  showMoreButtonVisible = false;
  searchParams: any = { general: '', location: '', fulltime: '' }; // Initialize defaults

  private List = inject(ListService);
  private router = inject(Router);
  private smartSearchService = inject(SmartSearchService);

  constructor() { }

  async ngOnInit(): Promise<void> {
    // Reset search state in service to ensure "initial view" on navigation back
    this.List.searchObject.next({});

    // 1. Get data from service
    this.Listings = this.List.getCleanListData();
    this.filteredListings = [...this.Listings];
    this.displayedListings = this.filteredListings.slice(0, this.itemsToShowInitially);
    this.showMoreButtonVisible = this.filteredListings.length > this.displayedListings.length;

    // 2. Initialize AI Indexing (Background)
    // We don't 'await' this if we want the UI to be usable immediately
    this.smartSearchService.initializeIndex(this.Listings);

    // 3. Listen for search updates
    this.List.searchObject.pipe(
      debounceTime(300), // Wait for 300ms pause in typing
      switchMap(value => {
        const params = value || {};
        // Map parameters and pass them directly into the search logic
        const mappedParams = { ...params, fulltime: params.fulltime === true ? 'Full Time' : '' };
        return from(this.getFilteredResults(mappedParams));
      })
    ).subscribe(results => {
      this.filteredListings = results;
      this.displayedListings = this.filteredListings.slice(0, this.itemsToShowInitially);
      this.showMoreButtonVisible = this.filteredListings.length > this.displayedListings.length;
    });
}

  getImageUrl(item: any) {
    return item.substring(2)
  }

  searchList(param: any) {
  }

  async getFilteredResults(params: any): Promise<Listing[]> {
    // 1. If the search query is empty or cleared, reset to the full unfiltered list immediately
    if (!params.general) {
      return [...this.Listings];
    }

    let baseResults: Listing[] = [];

    // 2. Determine Search Mode: Semantic vs. Standard
    if (params.general && this.smartSearchService.isIndexReady()) {
      // Use the WebGPU + Orama path
      const smartMatches = await this.smartSearchService.performSearch(params.general);
      baseResults = smartMatches ? (smartMatches as unknown as Listing[]) : this.Listings;
    } else {
      const query = (params.general || '').toLowerCase();
      baseResults = this.Listings.filter(obj => 
        [obj.position, obj.company, obj.description, obj.location]
          .some(field => field?.toLowerCase().includes(query)) ||
        obj.requirements.items.some(item => item.toLowerCase().includes(query))
      );
    }

    // 3. Apply Strict "Hard" Filters (Location & Contract)
    const finalResults = baseResults.filter(obj => {
      const loc = obj.location || '';
      const con = obj.contract || '';
      const locationMatch = loc.toLowerCase().includes((params.location || '').toLowerCase());
      const fulltimeMatch = con.toLowerCase().includes((params.fulltime || '').toLowerCase());
      return locationMatch && fulltimeMatch;
    });

    return finalResults;
  }

  toggleEntry(param: any) {
    const jobId = param.id;
    this.router.navigate([`/job/${jobId}`])
  }

  toggleShowMore() {
    const nextItems = this.filteredListings.slice(
      this.displayedListings.length,
      this.displayedListings.length + this.itemsToLoadOnScroll
    );
    this.displayedListings = [...this.displayedListings, ...nextItems];
    this.showMoreButtonVisible = this.filteredListings.length > this.displayedListings.length;
  }
}

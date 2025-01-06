import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from 'src/app/list.service';

@Component({
  selector: 'app-edit-view',
  templateUrl: './edit-view.component.html',
  styleUrls: ['./edit-view.component.scss']
})
export class EditViewComponent implements OnInit {
  job:any;
  constructor(
    private List: ListService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    this.job = this.List.getById(jobId);
  }
  
  getImageUrl(item:any){
    return item.substring(2);
  }
}

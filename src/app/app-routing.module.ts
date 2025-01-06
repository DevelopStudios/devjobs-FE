import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListViewComponent } from './components/list-view/list-view.component';
import { EditViewComponent } from './components/edit-view/edit-view.component';

const routes: Routes = [
  {path: '', component: ListViewComponent},
  {path: 'job/:id', component: EditViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

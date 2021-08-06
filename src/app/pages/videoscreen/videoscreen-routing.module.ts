import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoscreenComponent } from './videoscreen.component';

const routes: Routes = [
  {
    path:'',
    component:VideoscreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoscreenRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TakescreenshotComponent } from './takescreenshot.component';

const routes: Routes = [
  {
    path: '',
    component: TakescreenshotComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TakescreenshotRoutingModule { }

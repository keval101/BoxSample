import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelfAssesmentComponent } from './self-assesment.component';

const routes: Routes = [
  {
    path: '',
    component: SelfAssesmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelfAssesmentRoutingModule {}

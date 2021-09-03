import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelfassesmentQuestionsComponent } from './selfassesment-questions.component';

const routes: Routes = [
  {
    path: '',
    component: SelfassesmentQuestionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelfassesmentQuestionsRoutingModule {}

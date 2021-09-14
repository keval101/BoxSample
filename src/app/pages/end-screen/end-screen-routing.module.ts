import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndScreenComponent } from './end-screen.component';

const routes: Routes = [
  {
    path: '',
    component: EndScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EndScreenRoutingModule {}

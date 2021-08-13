import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseScreenshotComponent } from './choose-screenshot.component';

const routes: Routes = [
  {
    path: '',
    component: ChooseScreenshotComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseScreenshotRoutingModule {}

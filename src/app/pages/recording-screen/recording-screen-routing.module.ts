import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordingScreenComponent } from './recording-screen.component';

const routes: Routes = [
  {
    path: '',
    component: RecordingScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordingScreenRoutingModule {}

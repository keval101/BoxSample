import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('src/app/pages/home-page/home-page.module').then(
        (m) => m.HomePageModule
      ),
  },
  {
    path: 'choosescreenshot',
    loadChildren: () =>
      import('src/app/pages/choose-screenshot/choose-screenshot.module').then(
        (m) => m.ChooseScreenshotModule
      ),
  },
  {
    path: 'recording',
    loadChildren: () =>
      import('src/app/pages/recording-screen/recording-screen.module').then(
        (m) => m.RecordingScreenModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

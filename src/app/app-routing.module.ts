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
    path: 'recording',
    loadChildren: () =>
      import('src/app/pages/recording-screen/recording-screen.module').then(
        (m) => m.RecordingScreenModule
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
    path: 'self-assesment',
    loadChildren: () =>
      import('src/app/pages//self-assesment/self-assesment.module').then(
        (m) => m.SelfAssesmentModule
      ),
  },
  {
    path: 'self-assesment-questions',
    loadChildren: () =>
      import(
        'src/app/pages/selfassesment-questions/selfassesment-questions.module'
      ).then((m) => m.SelfassesmentQuestionsModule),
  },
  {
    path: 'evaluation',
    loadChildren: () =>
      import('src/app/pages/evaluation/evaluation-routing.module').then(
        (m) => m.EvaluationRoutingModule
      ),
  },
  {
    path: 'end',
    loadChildren: () =>
      import('src/app/pages/end-screen/end-screen.module').then(
        (m) => m.EndScreenModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

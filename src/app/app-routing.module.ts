import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { } from '../app/pages/'
 
const routes: Routes = [
  { path: '', loadChildren: () => import('src/app/pages/home-page/home-page.module').then(m => m.HomePageModule)}
  // { path: 'home', loadChildren: './pages/home-page/home-page.module#HomePageModule'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

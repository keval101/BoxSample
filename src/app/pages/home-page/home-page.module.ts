import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePageComponent } from './home-page.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HomePageComponent],
  imports: [CommonModule, FormsModule, TranslateModule, HomePageRoutingModule],
})
export class HomePageModule {}

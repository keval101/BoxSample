import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoscreenRoutingModule } from './videoscreen-routing.module';
import { VideoscreenComponent } from './videoscreen.component';
import { HeaderModule } from 'src/app/features/header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {SliderModule} from 'primeng/slider';

@NgModule({
  declarations: [
    VideoscreenComponent
  ],
  imports: [
    CommonModule,
    VideoscreenRoutingModule,
    HeaderModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    SliderModule
  ]
})
export class VideoscreenModule { }

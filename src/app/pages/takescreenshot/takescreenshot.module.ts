import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TakescreenshotRoutingModule } from './takescreenshot-routing.module';
import { TakescreenshotComponent } from './takescreenshot.component';
import { HeaderModule } from 'src/app/features/header/header.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TakescreenshotComponent
  ],
  imports: [
    CommonModule,
    TakescreenshotRoutingModule,
    HeaderModule,
    TranslateModule,
  ]
})
export class TakescreenshotModule { }

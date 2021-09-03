import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { EndScreenRoutingModule } from './end-screen-routing.module';
import { EndScreenComponent } from './end-screen.component';
import { HeaderModule } from 'src/app/features/header/header.module';

@NgModule({
  declarations: [EndScreenComponent],
  imports: [
    CommonModule,
    EndScreenRoutingModule,
    TranslateModule,
    HeaderModule,
  ],
})
export class EndScreenModule {}

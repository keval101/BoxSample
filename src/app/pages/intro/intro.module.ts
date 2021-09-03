import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroRoutingModule } from './intro-routing.module';
import { IntroComponent } from './intro.component';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/features/header/header.module';

@NgModule({
  declarations: [IntroComponent],
  imports: [CommonModule, IntroRoutingModule, TranslateModule, HeaderModule],
})
export class IntroModule {}

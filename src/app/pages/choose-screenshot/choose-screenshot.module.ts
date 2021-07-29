import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChooseScreenshotRoutingModule } from './choose-screenshot-routing.module';
import { ChooseScreenshotComponent } from './choose-screenshot.component';
import { FormsModule } from '@angular/forms';

import { HeaderModule } from 'src/app/features/header/header.module';
import { TranslateModule } from '@ngx-translate/core';

import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [ChooseScreenshotComponent],
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    ButtonModule,
    ToastModule,
    TabViewModule,
    HeaderModule,
    ChooseScreenshotRoutingModule,
    TranslateModule,
  ],
})
export class ChooseScreenshotModule {}

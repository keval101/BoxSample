import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SelfAssesmentComponent } from './self-assesment.component';
import { SelfAssesmentRoutingModule } from './self-assesment-routing.module';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/features/header/header.module';

import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [SelfAssesmentComponent],
  imports: [
    CommonModule,
    TranslateModule,
    HeaderModule,
    FormsModule,
    CarouselModule,
    ButtonModule,
    ToastModule,
    TabViewModule,
    GalleriaModule,
    SelfAssesmentRoutingModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  providers: [ConfirmationService],
})
export class SelfAssesmentModule {}

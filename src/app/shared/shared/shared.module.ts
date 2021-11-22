import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  exports: [ToastModule, ProgressSpinnerModule],
  providers: [MessageService],
})
export class SharedModule {}

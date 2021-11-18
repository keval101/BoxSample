import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedRoutingModule, ToastModule],
  exports: [ToastModule],
  providers: [MessageService],
})
export class SharedModule {}

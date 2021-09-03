import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationRoutingModule } from './evaluation-routing.module';
import { EvaluationComponent } from './evaluation.component';
import { HeaderModule } from 'src/app/features/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [EvaluationComponent],
  imports: [
    CommonModule,
    HeaderModule,
    FormsModule,
    TableModule,
    RatingModule,
    TranslateModule,
    RadioButtonModule,
    EvaluationRoutingModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
})
export class EvaluationModule {}

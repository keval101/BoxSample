import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SelfassesmentQuestionsRoutingModule } from './selfassesment-questions-routing.module';
import { SelfassesmentQuestionsComponent } from './selfassesment-questions.component';
import { HeaderModule } from 'src/app/features/header/header.module';

import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SelfassesmentQuestionsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    HeaderModule,
    RadioButtonModule,
    SelfassesmentQuestionsRoutingModule,
  ],
})
export class SelfassesmentQuestionsModule {}

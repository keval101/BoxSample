import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TranslateModule } from '@ngx-translate/core';
import { SliderModule } from 'primeng/slider';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    HeaderComponent,
    FormsModule,
    InputSwitchModule,
    ReactiveFormsModule,
    SliderModule,
  ],
})
export class HeaderModule {}

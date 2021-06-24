import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class RegexpModule {
  public PASSWORD =
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
}

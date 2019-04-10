import { NgModule } from '@angular/core';
import { LineTruncationDirective } from './line-truncation.directive';

@NgModule({
  declarations: [LineTruncationDirective],
  exports: [LineTruncationDirective],
})
export class LineTruncationLibModule {}

import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { lineTruncation, getContentHeight } from './line-truncation-helper';
import { LineClampOptions } from './line-truncation.model';

/**
 * This Directive allows you to specify the number of lines that you want to truncate a text by.
 *
 * @example
 * <!-- with <p> -->
 *   <p [innerHTML]="description"
 *      [line-truncation]="5"
 *      (hasTruncated)="handler(booleanValue)">
 *   </p>
 * !-- with div, span -->
 *  <div [line-truncation]="5">your text</div>
 *
 */
@Directive({
  selector: '[line-truncation]',
})
export class LineTruncationDirective implements AfterViewInit, OnInit {
  /**
   * Number of lines to display
   */
  @Input('line-truncation')
  lines = 1;

  /**
   *  A boolean value to indicate that it has been truncated
   */
  @Output()
  hasTruncated = new EventEmitter();

  MAX_TRIES = 10;

  // Target Node
  elem: HTMLElement = this.el.nativeElement;

  options: LineClampOptions = { ellipsis: '\u2026', onFinish: val => this.onFinishHandler(val) };

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  /**
   * Hide the original text content until we've finished the truncation
   */
  ngOnInit() {
    this.renderer.setStyle(this.elem, 'visibility', 'hidden');
  }

  ngAfterViewInit() {
    this.truncateWhenNecessary(this.elem, this.MAX_TRIES);
  }

  truncateWhenNecessary(elem: HTMLElement, tries: number) {
    if (tries > 0) {
      // Allows buffer period for DOM to be ready
      setTimeout(() => {
        const clientHeight = elem.clientHeight;

        /**
         * Recursively call the truncate itself if Client Height is not ready
         */
        if (clientHeight > 0) {
          const contentHeight = getContentHeight(elem);
          const lineHeight = this.getLineHeight(elem);
          const targetHeight = this.lines * lineHeight;

          if (contentHeight > targetHeight) {
            try {
              lineTruncation(elem, this.lines, lineHeight, this.options);
            } catch (error) {
              console.error(`[truncate-lines.directive:lineTruncation] ${error}`);
            }
          } else {
            this.renderer.removeStyle(this.elem, 'visibility');
          }
        } else {
          console.log(`${11 - tries} time truncation try for element:`, elem);
          this.truncateWhenNecessary(elem, --tries);
        }
      }, 100);
    } else {
      console.error(`Cannot retrieve item's clientHeight`);
    }
  }

  getLineHeight(elem) {
    const lineHeightComputedStyle = window.getComputedStyle(elem).lineHeight;

    if (lineHeightComputedStyle === 'normal') {
      // Define a fallback for 'normal' value with 1.2 as a line-height
      // https://www.w3.org/TR/CSS21/visudet.html#normal-block
      return parseInt(window.getComputedStyle(elem).fontSize, 10) * 1.2;
    } else {
      return parseInt(lineHeightComputedStyle, 10);
    }
  }

  onFinishHandler(hasTruncated = false) {
    if (hasTruncated) {
      this.hasTruncated.emit(hasTruncated);
    }
    this.renderer.removeStyle(this.elem, 'visibility');
  }
}

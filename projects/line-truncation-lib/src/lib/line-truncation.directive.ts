import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { getContentHeight, getLineHeight, truncate } from 'line-truncation';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * This Directive allows you to specify the number of lines that you want to truncate a text by.
 *
 * @example
 * <!-- with <p> -->
 *   <p [innerHTML]="description"
 *      [line-truncation]="5"
 *      (hasTruncated)="onTruncationFinish(e)">
 *   </p>
 * <!-- with div -->
 *  <div [line-truncation]="5">your text</div>
 *
 */

interface Options {
  ellipsis: string;
}

@Directive({
  selector: '[line-truncation]',
})
export class LineTruncationDirective implements AfterViewInit, OnInit, OnDestroy {
  @Input('line-truncation')
  lines = 1;

  @Input()
  options: Options = { ellipsis: '\u2026' };

  @Output()
  hasTruncated = new EventEmitter();

  MAX_TRIES = 10;

  element: HTMLElement = this.elementRef.nativeElement;
  windowResize$ = new Subject();
  windowListener: Subscription;
  elementClone;

  observerFlag = true;

  mutationObserver: MutationObserver;

  @HostListener('window:resize', ['$event'])
  handleClick(event: Event) {
    this.windowResize$.next(event);
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  /**
   * Hide the original text content until we've finished the truncation
   */
  ngOnInit() {
    this.renderer.setStyle(this.element, 'visibility', 'hidden');
    this.initWindowResizeListener();

    this.mutationObserver = new MutationObserver(() => {
      if (this.observerFlag) {
        this.truncateWhenNecessary(this.element);
      }
    });

    this.mutationObserver.observe(this.element, {
      childList: true,
    });
  }

  ngAfterViewInit() {
    this.truncateWhenNecessary(this.element);
  }

  initWindowResizeListener() {
    this.windowListener = this.windowResize$.pipe(debounceTime(500)).subscribe(() => {
      this.renderer.setStyle(this.element, 'visibility', 'hidden');
      // grab old child nodes
      const childNodes: Node[] = Array.from(this.elementClone.childNodes);
      // clean element
      while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
      }

      // push child node to element shell
      childNodes.forEach(node => {
        this.element.appendChild(node);
      });

      this.truncateWhenNecessary(this.element);
    });
  }

  truncateWhenNecessary(element: HTMLElement, tries: number = 1, maxTries = this.MAX_TRIES) {
    // backup original element before truncation
    this.elementClone = element.cloneNode(true);

    if (tries > maxTries) {
      return;
    }

    // Allows buffer period for DOM to be ready
    setTimeout(() => {
      // Recursively call the truncate itself if Client Height is not ready
      if (element.clientHeight > 0) {
        const contentHeight = getContentHeight(element);
        const lineHeight = getLineHeight(element);
        const targetHeight = this.lines * lineHeight;

        if (contentHeight > targetHeight) {
          truncate(element, this.lines, this.options.ellipsis, this.handler.bind(this));
        } else {
          this.renderer.removeStyle(this.element, 'visibility');
          this.hasTruncated.emit(false);
        }
      }
    }, 100);
  }

  handler(e: boolean) {
    this.hasTruncated.emit(e);
    this.observerFlag = false;
    this.mutationObserver.disconnect();
    this.renderer.removeStyle(this.element, 'visibility');
  }

  ngOnDestroy() {
    this.mutationObserver.disconnect();
    this.windowListener.unsubscribe();
  }
}

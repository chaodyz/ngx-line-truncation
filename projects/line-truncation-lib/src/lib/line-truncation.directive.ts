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
  HostListener
} from "@angular/core";
import { getContentHeight, getLineHeight, truncate } from "line-truncation";
import { Subject, Subscription, BehaviorSubject } from "rxjs";
import { debounceTime, skip } from "rxjs/operators";

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
  selector: "[line-truncation]"
})
export class LineTruncationDirective
  implements AfterViewInit, OnInit, OnDestroy {
  @Input("line-truncation")
  lines = 1;

  @Input()
  options: Options = { ellipsis: "\u2026" };

  @Input() set disabled(val: boolean) {
    this._disabled$.next(val);
  }

  @Input()
  watchChanges = false;

  @Output()
  hasTruncated = new EventEmitter();

  elementClone;
  MAX_TRIES = 10;
  observerFlag = true;

  _disabled$ = new BehaviorSubject<boolean>(false);
  element: HTMLElement = this.elementRef.nativeElement;
  windowResize$ = new Subject();
  windowListener: Subscription;
  mutationObserver: MutationObserver;

  @HostListener("window:resize", ["$event"])
  handleClick(event: Event) {
    this.windowResize$.next(event);
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  /**
   * Hide the original text content until we've finished the truncation
   */
  ngOnInit() {
    this._disabled$.pipe(skip(1)).subscribe(disable => {
      // If there is elementClone, then recover
      if (!!this.elementClone) {
        this.putbackElement();
      }

      if (disable) {
        // shut down listener, observer
        this.disconnectMutationObserver();
        this.disconnectWindowLisener();
      } else {
        // re-register
        this.truncationInit();
        // re-execute truncation
        this.truncateWhenNecessary(this.element);
      }
    });
    // first emit handling
    if (!this._disabled$.getValue()) {
      this.truncationInit();
    }
  }

  ngAfterViewInit() {
    this.truncateWhenNecessary(this.element);
  }

  truncateWhenNecessary(
    element: HTMLElement,
    tries: number = 1,
    maxTries = this.MAX_TRIES
  ) {
    if (this._disabled$.getValue()) {
      return;
    }
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
          truncate(
            element,
            this.lines,
            this.options.ellipsis,
            this.handler.bind(this)
          );
        } else {
          // when there is no need, simply show the element and emit false
          this.renderer.removeStyle(this.element, "visibility");
          this.hasTruncated.emit(false);
        }
      }
    }, 100);
  }

  handler(e: boolean) {
    this.hasTruncated.emit(e);

    if (!this.watchChanges) {
      this.observerFlag = false;
      this.disconnectMutationObserver();
    }
    this.renderer.removeStyle(this.element, "visibility");
  }

  truncationInit() {
    this.renderer.setStyle(this.element, "visibility", "hidden");
    this.initWindowResizeListener(this.element);
    this.initMutationObserver(this.element);
  }

  putbackElement() {
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

    this.elementClone = null;
  }

  initWindowResizeListener(element) {
    this.windowListener = this.windowResize$
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.renderer.setStyle(element, "visibility", "hidden");
        this.putbackElement();
        this.truncateWhenNecessary(element);
      });
  }

  initMutationObserver(element) {
    this.mutationObserver = new MutationObserver(() => {
      if (this.observerFlag) {
        this.truncateWhenNecessary(element);
      }
    });

    this.mutationObserver.observe(element, {
      childList: true
    });
  }

  disconnectMutationObserver() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }
  disconnectWindowLisener() {
    if (this.windowListener) {
      this.windowListener.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.disconnectMutationObserver();
    this.disconnectWindowLisener();
  }
}

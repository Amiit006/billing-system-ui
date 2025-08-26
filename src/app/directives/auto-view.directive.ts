// auto-view.directive.ts
import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({ selector: '[autoView]' })
export class AutoViewDirective implements OnInit, OnDestroy {
  @Input() aspect = 0.6;         // height = width * aspect
  @Input() minHeight = 260;      // floor so small phones aren’t unusable
  @Output() viewChange = new EventEmitter<[number, number]>();

  private ro?: ResizeObserver;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.ro = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      const w = Math.max(0, Math.floor(rect.width));
      const h = Math.max(this.minHeight, Math.round(w * this.aspect));
      this.viewChange.emit([w, h]);
    });
    console.log("AMIT")
    this.ro.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.ro?.disconnect();
  }
}

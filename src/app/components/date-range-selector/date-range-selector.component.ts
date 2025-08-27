import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.css']
})
export class DateRangeSelectorComponent implements OnInit {

  @Input() pageInitiator?: string;
  @Input() maxDate = new Date();

  // Treat as default: apply once (or when different), then allow user to change.
  private _rangeFromParent?: { start?: Date | string | null; end?: Date | string | null } | null;
  private appliedParentDefault = false;
  private userEdited = false;

  @Input() set rangeFromParent(val: { start?: Date | string | null; end?: Date | string | null } | null | undefined) {
    this._rangeFromParent = val;

    const incomingStart = this.toDateOrNull(val?.start);
    const incomingEnd = this.toDateOrNull(val?.end);

    // Only apply if we haven't applied a default yet OR the incoming value is different
    // AND the user hasn't edited the form.
    if (!this.userEdited && this.shouldApplyIncoming(incomingStart, incomingEnd)) {
      this.applyRange(incomingStart, incomingEnd);
      this.appliedParentDefault = true;
    }
  }

  @Output() rangeEmitter = new EventEmitter<FormGroup>();

  range = new FormGroup({
    start: new FormControl(<Date | null>null),
    end: new FormControl(<Date | null>null)
  });

  constructor(private toastrService: ToastrService) {}

  ngOnInit(): void {
    // Mark when user edits so we stop overwriting with parent defaults.
    this.range.valueChanges.subscribe(() => {
      this.userEdited = true;
    });

    // If no parent default has been applied, fall back to sessionStorage flow.
    if (!this.appliedParentDefault && this.pageInitiator === 'SellReport') {
      const sell_report_from_date = sessionStorage.getItem('sell_report_from_date');
      const sell_report_to_date = sessionStorage.getItem('sell_report_to_date');
      this.applyRange(this.toDateOrNull(sell_report_from_date), this.toDateOrNull(sell_report_to_date));
    }
  }

  /** Backwards-compatible public method */
  setRange(from_date: Date | string | null | undefined, to_date: Date | string | null | undefined) {
    this.applyRange(this.toDateOrNull(from_date), this.toDateOrNull(to_date));
  }

  emitDate() {
    const startVal = this.range.get('start')!.value;
    const endVal = this.range.get('end')!.value;

    if (startVal && endVal && moment(endVal).isBefore(moment(startVal))) {
      this.toastrService.error("To Date can't be earlier than From Date.");
      return;
    }
    this.rangeEmitter.emit(this.range);
  }

  // ---------- helpers ----------

  private applyRange(start: Date | null, end: Date | null) {
    if (start !== null) this.range.get('start')!.setValue(start, { emitEvent: true });
    if (end !== null) this.range.get('end')!.setValue(end, { emitEvent: true });
  }

  private toDateOrNull(value: Date | string | null | undefined): Date | null {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  private datesEqual(a: Date | null, b: Date | null): boolean {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    return a.getTime() === b.getTime();
  }

  private shouldApplyIncoming(incomingStart: Date | null, incomingEnd: Date | null): boolean {
    const currentStart = this.range.get('start')!.value;
    const currentEnd = this.range.get('end')!.value;

    // If we haven't applied a parent default yet, allow applying once when at least
    // one of the incoming values exists.
    if (!this.appliedParentDefault && (incomingStart || incomingEnd)) {
      return true;
    }

    // Apply only if incoming differs from current form values.
    return !this.datesEqual(incomingStart, currentStart) || !this.datesEqual(incomingEnd, currentEnd);
  }
}

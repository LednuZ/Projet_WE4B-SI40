import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.css']
})
export class RangeSliderComponent implements OnInit, OnChanges {
  @Input() label: string = '';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() unit: string = '';

  @Input() minValue!: number;
  @Input() maxValue!: number;

  @Output() minValueChange = new EventEmitter<number>();
  @Output() maxValueChange = new EventEmitter<number>();
  @Output() filterChange = new EventEmitter<void>();

  leftPercent: number = 0;
  rightPercent: number = 0;

  ngOnInit(): void {
    this.updatePercentages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePercentages();
  }

  onMinSliderChange(val: string): void {
    let num = Number(val);
    if (num > this.maxValue) {
      num = this.maxValue;
    }
    this.minValue = num;
    this.minValueChange.emit(this.minValue);
    this.updatePercentages();
    this.filterChange.emit();
  }

  onMaxSliderChange(val: string): void {
    let num = Number(val);
    if (num < this.minValue) {
      num = this.minValue;
    }
    this.maxValue = num;
    this.maxValueChange.emit(this.maxValue);
    this.updatePercentages();
    this.filterChange.emit();
  }

  onMinInputChange(val: any): void {
    let num = Number(val);
    if (isNaN(num) || num < this.min) num = this.min;
    if (num > this.maxValue) num = this.maxValue;
    
    this.minValue = num;
    this.minValueChange.emit(this.minValue);
    this.updatePercentages();
    this.filterChange.emit();
  }

  onMaxInputChange(val: any): void {
    let num = Number(val);
    if (isNaN(num) || num > this.max) num = this.max;
    if (num < this.minValue) num = this.minValue;

    this.maxValue = num;
    this.maxValueChange.emit(this.maxValue);
    this.updatePercentages();
    this.filterChange.emit();
  }

  private updatePercentages(): void {
    const range = this.max - this.min;
    if (range <= 0) return;
    
    const currentMin = this.minValue !== undefined ? this.minValue : this.min;
    const currentMax = this.maxValue !== undefined ? this.maxValue : this.max;

    this.leftPercent = ((currentMin - this.min) / range) * 100;
    this.rightPercent = 100 - (((currentMax - this.min) / range) * 100);
  }
}

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnChanges {

  @Input() rating: number = 0;
  @Input() editable: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [1, 2, 3, 4, 5];
  hovered: number = 0;

  ngOnChanges(): void {
    this.hovered = 0;
  }

  getFill(star: number): string {
    const effective = this.editable && this.hovered > 0 ? this.hovered : this.rating;
    if (effective >= star)         return 'full';
    if (effective >= star - 0.5)   return 'half';
    return 'empty';
  }

  select(star: number): void {
    if (!this.editable) return;
    this.ratingChange.emit(star);
  }

  onHover(star: number): void {
    if (this.editable) this.hovered = star;
  }

  onLeave(): void {
    this.hovered = 0;
  }
}

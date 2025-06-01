import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  imports: [CommonModule],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss'
})
export class CustomButtonComponent {
  @Input() label: string = 'Click Me';
  @Input() type: 'chequing' | 'savings' | 'default' = 'default';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<void>();
  getButtonClasses() {
    return {
      'btn': true,
      'btn-chequing': this.type === 'chequing',
      'btn-savings': this.type === 'savings',
      'btn-default': this.type === 'default'
    };
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  @Input() deg: string = '340';
  @Input() color: string = 'white';
  @Input() pad: string = '12px 42px';
  
  constructor() { }

  ngOnInit(): void {
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'common-display-error',
  templateUrl: './common-display-error.component.html',
  styleUrls: ['./common-display-error.component.scss'],
})
export class CommonDisplayErrorComponent implements OnInit {
  @Input('error') error: any;
  @Input('showError') showError: boolean | undefined;
  constructor() {}

  ngOnInit(): void {}
}

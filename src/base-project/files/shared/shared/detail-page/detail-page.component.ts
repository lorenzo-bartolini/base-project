import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() routeBack?: string;
  @Input() loading = false;
  @Input() buttonsTemplate?: TemplateRef<any>;
  @Input() bottomButtonsTemplate?: TemplateRef<any>;
  @Input() noPadding?: boolean;

  @Input() saveDisabled?: boolean;
  @Output() save = new EventEmitter();

  @Input() cancelDisabled?: boolean;
  @Output() cancel = new EventEmitter();

  @Input() deleteDisabled?: boolean;
  @Output() delete = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSave(event : any) {
    this.save.emit(event);
  }

  onCancel(event : any) {
    this.cancel.emit(event);
  }

  onDelete(event : any) {
    this.delete.emit(event);
  }
}

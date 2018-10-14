import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Output('modalResponse') modalResponse = new EventEmitter();
  
  @Input() title = "";
  @Input() message = "";

  @Input() isAI = false;

  constructor() { }

  ngOnInit() {
  }

  response(data) {
    this.modalResponse.emit(data);
  }
}

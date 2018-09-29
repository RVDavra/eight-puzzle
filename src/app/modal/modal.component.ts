import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Output('modalResponse') modalResponse = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

  response(data) {
    this.modalResponse.emit(data);
  }
}

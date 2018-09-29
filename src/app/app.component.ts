import { Component, ViewChild, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'eight-puzzle';

  pString = "A12345678_"

  selectClass = "bg-danger"

  response = true;

  first = null;

  dataloaded = false;

  jsonData = [];

  @ViewChildren('p') puzzle;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get("assets/data.json").subscribe(this.getJsonData.bind(this));
  }

  puzzleClick(number) {
    this.resetBG();
    this.first = number;
    this.openEmpty();
  }

  resetBG() {
    this.puzzle.toArray().forEach(element => {
      element.nativeElement.classList.remove(this.selectClass);
    });
  }

  openEmpty() {
    let f = Math.floor((this.first - 1) / 3);
    let up = f === 0 ? -1 : (this.first - 3);
    let down = f === 2 ? -1 : (this.first + 3);
    let left = ((this.first - 1) % 3) === 0 ? -1 : (this.first - 1);
    let right = ((this.first - 1) % 3) === 2 ? -1 : (this.first + 1);
    if (this.pString[down] === '_' || this.pString[up] === '_' || this.pString[left] === '_' || this.pString[right] === '_') {
      let temp = this.pString[this.first];
      this.pString = this.pString.replace('_', temp);
      this.pString = this.pString.replace(/./g, (c, i) => i == this.first ? '_' : c);
    } else {
      let p = this.puzzle.toArray();
      let undIndex = this.pString.indexOf('_');
      if(this.first < undIndex) {
        p[this.first-1].nativeElement.classList.add(this.selectClass);
      } else {
        p[this.first-2].nativeElement.classList.add(this.selectClass);
      }
    }
  }

  isWon() {
    return this.pString === "A12345678_"
  }

  modalResponse(event) {
    if(event) {
      this.setPuzzle();
    } else {
      this.response = false;
    }
  }

  getJsonData(data) {
    this.jsonData = data;
    this.setPuzzle();
  }

  setPuzzle() {
    this.dataloaded = true;
    let selected = Math.floor(Math.random() * (this.jsonData.length - 1));
    this.pString = "A" + this.jsonData[selected];
  }
}

import { Component, ViewChild, ElementRef, OnInit, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'eight-puzzle';

  pString = "A12345678_"

  selectClass = "bg-primary"

  first = null;
  firstElement = null;

  @ViewChildren('p') puzzle;

  ngOnInit() {
  }

  puzzleClick(number) {
    if (this.first) {
      this.first = null;
      this.resetBG();
      this.closeEmpty();
    } else {
      this.first = number;
      let puzzleArray: ElementRef[] = this.puzzle.toArray();
      puzzleArray[+number - 1].nativeElement.classList.add(this.selectClass);
      this.openEmpty();
    }
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
    if (this.pString[up] === '_' || this.pString[down] === '_' || this.pString[left] === '_' || this.pString[right] === '_') {
      this.pString = this.pString.replace('_', ' ');
    }
  }
  closeEmpty() {
    this.pString = this.pString.replace(' ', '_');
  }
}

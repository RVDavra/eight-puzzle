import { Component, ViewChild, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = "You Won";
  message = "You won this game would you like to play another game";

  pString = "A12345678_"

  tmpPString = "A12345678_";

  selectClass = "bg-danger"

  isDialogVisible = false;

  first = null;

  dataloaded = false;

  isAI = false;

  jsonData = [];

  states = [];

  myInterval;

  @ViewChild('interval') interval: ElementRef;

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
      if (this.first < undIndex) {
        p[this.first - 1].nativeElement.classList.add(this.selectClass);
      } else {
        p[this.first - 2].nativeElement.classList.add(this.selectClass);
      }
    }
    if(this.isWon()) {
      this.showDialog("You Won", "You won this game.\nwould you like to play another game?");
    }
  }

  isWon() {
    return this.pString === "A12345678_";
  }

  

  getJsonData(data) {
    this.jsonData = data;
    this.setPuzzle();
  }

  setPuzzle() {
    clearInterval(this.myInterval);
    this.myInterval = undefined;
    this.states = [];
    this.dataloaded = true;
    let selected = Math.floor(Math.random() * (this.jsonData.length - 1));
    this.pString = "A" + this.jsonData[selected];
    this.tmpPString = JSON.parse(JSON.stringify(this.pString));
    this.states.push(this.pString);
  }

  calculateHeuristic(tempState: string) {
    let count = 1;
    let solution = "A12345678_";
    for (let i = 1; i < tempState.length; i++) {
      if (solution[i] === tempState[i]) {
        count++;
      }
    }
    return count;
  }

  tryAi() {
    let time = +this.interval.nativeElement.value;
    this.states = [];
    this.pString = JSON.parse(JSON.stringify(this.tmpPString));
    this.myInterval = setInterval(() => {
      this.findSolution();
    }, time? time : 10);
  }

  findSolution() {
    let undIndex = this.pString.indexOf('_');
    let upIndex = undIndex - 3;
    let downIndex = undIndex + 3;
    let leftIndex = undIndex - 1;
    let rightIndex = undIndex + 1;
    let upString;
    let downString;
    let leftString;
    let rightString;
    let nextStates: string[] = [];
    if (upIndex > 1) {
      let temp = this.pString[upIndex];
      upString = this.pString.replace('_', temp);
      upString = upString.replace(/./g, (c, i) => i == upIndex ? '_' : c);
      nextStates.push(upString);
    }
    if (downIndex < 10) {
      let temp = this.pString[downIndex];
      downString = this.pString.replace('_', temp);
      downString = downString.replace(/./g, (c, i) => i == downIndex ? '_' : c);
      nextStates.push(downString);
    }
    if ((leftIndex) % 3 > 0) {
      let temp = this.pString[leftIndex];
      leftString = this.pString.replace('_', temp);
      leftString = leftString.replace(/./g, (c, i) => i == leftIndex ? '_' : c);
      nextStates.push(leftString);
    }
    if ((rightIndex - 1) % 3 != 0) {
      let temp = this.pString[rightIndex];
      rightString = this.pString.replace('_', temp);
      rightString = rightString.replace(/./g, (c, i) => i == rightIndex ? '_' : c);
      nextStates.push(rightString);
    }
    let nextState;
    for (const state of nextStates) {
      if (!nextState && !this.states.includes(state)) {
        nextState = state;
      }
      if (nextState && this.calculateHeuristic(nextState) < this.calculateHeuristic(state) && !this.states.includes(state)) {
        nextState = state;
      }
    }
    if (!nextState || nextState === this.pString) {
      clearInterval(this.myInterval);
      this.showDialog("AI Stuck","Sorry i can't solve this puzzle.\nclick OK to try by your self", true);
    } else {
      this.pString = nextState;
      this.states.push(nextState);
      if(this.isWon()) {
        clearInterval(this.myInterval);
        this.showDialog("AI Won","AI Successfully solved this puzzle.\nclick OK to load another puzzle", true);
      }
    }
  }

  showDialog(title, message, ai?) {
    this.title = title;
    this.message = message;
    this.isAI = ai? true: false;
    this.isDialogVisible = true;
  }

  modalResponse(event) {
    this.isAI = false;
    this.isDialogVisible = false;
    if (event && this.isWon()) {
      this.setPuzzle();
    }
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-component2',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class Component2Component {
  showFailTable = false;
  showFavTable = false;
  storedValue?: any;

  values = new Array;

  constructor() {
    const keys = Object.keys(localStorage);
    const len = keys.length;
    if (len == 0) {
      this.showFailTable = true;
      this.showFavTable = false;
    } else {
      this.showFailTable = false;
      this.showFavTable = true;
      
      for (let i = 0; i < len; i++) {
        let val = localStorage.getItem(keys[i]);
        if((val !== null)){
        const valStr = JSON.parse(val);
        this.values.push(valStr);
        }
      }
      console.log(this.values[0].eveid);
    }
  }

  removeItem(stid: string) {
    console.log(stid);
    localStorage.removeItem(stid);
    alert("Removed from Favorites!");
    const keys = Object.keys(localStorage);
    const len = keys.length;
    this.values = [];
    for (let i = 0; i < len; i++) {
      let val = localStorage.getItem(keys[i]);
      if((val !== null)){
      const valStr = JSON.parse(val);
      this.values.push(valStr);
      }
    }
    if(len == 0){
      this.showFailTable = true;
      this.showFavTable = false;
    }
  }

}
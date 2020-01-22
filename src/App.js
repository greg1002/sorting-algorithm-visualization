import React, { Component } from 'react';
import NavTop from './navtop.jsx';
import NavBot from './navbot.jsx';
import Body from './body.jsx';
import './style.css';
import {sort} from './sortingAlgorithms.js';

export const UNSORTED_ARRAY_COLOR = 'turquoise';
export const SORTED_ARRAY_COLOR = 'green';
export const VALUE_MOVED_ARRAY_COLOR = 'red';
export const VALUE_ACCESSED_ARRAY_COLOR = 'orange';

const FRAMES_PER_SEC = 60;

//color

export default class App extends Component {

  state = {
    array: [],
    sortType: 'bubble',
    sortSpeed: 20,
    sorting: false,
    sortState: null,
    windowWidth: 800,
    interval: null,
    runningTick: 0
  }


  componentDidMount() {
    this.resetArray('random', 100);
    const sorting = false;
    this.setState({sorting});
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({windowWidth: window.innerWidth});
  }

  run = () => {
    if (this.state.sorting && (this.state.sortState === null || !this.state.sortState.finished)) {
      let runningTick = this.state.runningTick + this.state.sortSpeed / FRAMES_PER_SEC;
      if (runningTick > 1) {
        const sortState = sort(this.state.array, this.state.sortType, this.state.sortState, Math.floor(runningTick));
        runningTick -= Math.floor(runningTick);
        this.setState({sortState});
      }
      this.setState({runningTick});
    } else {
      clearInterval(this.state.interval);
      const sorting = false;
      this.setState({sorting});
    }
  }

  //Cases: 'random', 'reversed', 'nearlySorted', 'fewUnique'
  resetArray = (generationType, arraySize) => {
    const array = [];
    const temp = [];
    switch (generationType) {
      case 'reversed':
        for (let i = arraySize; i > 0; i--) {
          array.push({value: i, color: UNSORTED_ARRAY_COLOR});
        }
        break;
      case 'random':
        for (let i = 1; i <= arraySize; i++) {
          temp.push(i);
        }
        while (temp.length !== 0) {
          const index = randomIntFromInterval(0, temp.length - 1);
          array.push({value: temp[index], color: UNSORTED_ARRAY_COLOR});
          temp.splice(index, 1);
        }
        break;
      case 'nearlySorted':
        for (let i = 1; i <= arraySize; i++) {
          array.push({value: i, color: UNSORTED_ARRAY_COLOR});
        }
        const variation = Math.floor(Math.log(arraySize) / Math.log(2));
        for (let i = 0; i < arraySize; i++) {
          const rand = randomIntFromInterval(Math.max(i - variation, 0), Math.min(i + variation, arraySize - 1));
          [array[i],array[rand]] = [array[rand], array[i]];
        }
        console.log(array);
        break;
      case 'fewUnique':
        const num = Math.log(arraySize) / Math.log(2);
        for (let i = 1; i <= arraySize; i++) {
          temp.push(Math.floor(Math.ceil(i * num / arraySize) * arraySize / num * .9));
        }
        while (temp.length !== 0) {
          const index = randomIntFromInterval(0, temp.length - 1);
          array.push({value: temp[index], color: UNSORTED_ARRAY_COLOR});
          temp.splice(index, 1);
        }
        break;
    }
    this.setState({ array });
    this.changeSettings();
  }

  handleSortTypeToggle = (sortType_) => {
    if (sortType_ === this.state.sortType) return;
    const sortType = sortType_;
    this.changeSettings();
    this.resetArrayColor();
    this.setState({ sortType });
  }

  handleSortSpeedChange = (event) => {
    const sortSpeed = Math.ceil(Math.pow(event.target.value / 1000.0, 2) * 1000);
    this.setState({ sortSpeed });
  }

  handleSortToggle = () => {
    const sorting = !this.state.sorting;
    this.setState({sorting}, () => {
      if (sorting === true) {
        var interval = setInterval(this.run, 1000 / FRAMES_PER_SEC);
        this.setState({interval});
      } else {
        clearInterval(this.state.interval);
        if (this.state.sortSpeed > FRAMES_PER_SEC) {
          const sortState = sort(this.state.array, this.state.sortType, this.state.sortState, 1);
          this.setState({sortState});
        }
      }
    });
  }

  resetArrayColor = () => {
    const array = this.state.array;
    array.forEach(element => {
      element.color = UNSORTED_ARRAY_COLOR;
    });
    this.setState({array});
  }

  changeSettings = () => {
    clearInterval(this.state.interval);
    const sorting = false;
    var sortState = null;
    this.setState({ sorting, sortState });
  }

  render() {
    return (
      <React.Fragment>
        <NavTop onReset={this.resetArray}/>
        <Body array={this.state.array}
          windowWidth={this.state.windowWidth}
        />
        <NavBot
          onSortTypeToggle={this.handleSortTypeToggle}
          sortType={this.state.sortType}
          onSortSpeedChange={this.handleSortSpeedChange}
          sortSpeed={this.state.sortSpeed}
          sorting={this.state.sorting}
          onSortToggle={this.handleSortToggle}
          sortState={this.state.sortState}
        />
      </React.Fragment>
    );
  }
}

//inclusive
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

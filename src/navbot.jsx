import React, { Component } from 'react';
import './style.css';

const sortTypes = [
 {innerHTML: "Bubble Sort", id: 'bubble'},
 {innerHTML: "Insertion Sort", id: 'insertion'},
 {innerHTML: "Selection Sort", id: 'selection'},
 {innerHTML: "Quick Sort", id: 'quick'},
 {innerHTML: "Merge Sort", id: 'merge'},
 {innerHTML: "Radix Sort", id: 'radix'}
]

export default class NavBot extends Component {
  render () {
    const {onSortSpeedChange, onSortTypeToggle, sortType, sortSpeed, onSortToggle, sorting, sortState} = this.props;
    return (
      <nav className="navbar navbar-light navbar-expand-lg">
        <SortType onSortTypeToggle={onSortTypeToggle} sortType={sortType} />
        <SortSpeed onSortSpeedChange={onSortSpeedChange} sortSpeed={sortSpeed} />
        <Sort onSortToggle={onSortToggle} sorting={sorting} />
        <Info sortState={sortState} />
      </nav>
    )
  }
}

class SortType extends Component {
  render () {
    const {sortType, onSortTypeToggle} = this.props;
    return (
      <div className="nav group">
        <h4>Algorithm: </h4>
        <div className="btn-group btn-group-toggle m-2">{
          sortTypes.map(type => (
            <label key={type.id} className={type.id === sortType ? "btn btn-primary active" : "btn btn-primary"}>
              <input type="radio" id={type.id} autoComplete="off" onClick={() => onSortTypeToggle(type.id)}/>{type.innerHTML}
            </label>
          ))}
        </div>
      </div>
    )
  }
}

class SortSpeed extends Component {
  render () {
    const {onSortSpeedChange, sortSpeed} = this.props;
    return (
      <div className="nav group">
        <h4 style={{width: 150}}>Sort Speed: {sortSpeed}</h4>
        <input className="m-2" type="range" name="range" min={1} max={1000} defaultValue={sortSpeed} onChange={(event) => onSortSpeedChange(event)} />
      </div>
    )
  }
}

class Sort extends Component {
  render () {
    const {onSortToggle, sorting} = this.props;
    return (
      <div style={{width: 100}}><button className="btn btn-md btn-primary m-2" onClick={onSortToggle}>{sorting ? "Pause" : "Sort"}</button></div>
    )
  }
}

class Info extends Component {
  render () {
    const {sortState} = this.props;
    let comparisons = 0, accesses = 0;
    if (sortState !== null) {
      comparisons = sortState.comparisons;
      accesses = sortState.accesses;
    }
    return (
      <div style={{width: 155}}>
        <h6>Comparisons: {comparisons}</h6>
        <h6>Accesses: {accesses}</h6>
      </div>
    )
  }
}

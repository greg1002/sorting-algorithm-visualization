import React, { Component } from 'react';
import './style.css';

export default class Body extends Component {


  render () {
    const { array, windowWidth } = this.props;
    return (
      <div className="array-container" style={{left: Math.max(.15 * windowWidth, 207), right: Math.max(.15 * windowWidth, 207)}}>{
        array.map((entry) => (
          <div
            key={array.indexOf(entry)}
            className="array-bar-container"
            style={
              array.length <= 200 ? {width: 80 / array.length + '%', margin: 10 / array.length + '%'} : {width: 90 / array.length + '%'}
            }
            ><div
              className="array-bar"
              style={{
                backgroundColor: entry.color,
                height: entry.value / array.length * 100 + '%'
              }}
              ></div>
          </div>
        ))}</div>
    )
  }

}

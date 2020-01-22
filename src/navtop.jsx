import React, { Component } from 'react';
import './style.css';

const generateModes = [
 {innerHTML: "Random", id: 'random'},
 {innerHTML: "Reversed", id: 'reversed'},
 {innerHTML: "Nearly Sorted", id: 'nearlySorted'},
 {innerHTML: "Few Unique", id: 'fewUnique'}
]

export default class NavTop extends Component {

  state = {
    generationType: 'random',
    arraySize: 100
  }

  render () {
    return (
      <nav className="navbar navbar-light navbar-expand-lg">
        <Title />
        <GenerationType onGenerationTypeToggle={this.handleGenerationTypeToggle} generationType={this.state.generationType}/>
        <ArraySize onArraySizeChange={this.handleArraySizeChange} arraySize={this.state.arraySize}/>
        <Generate onGenerate={this.handleGenerate}/>
      </nav>
    )
  }

  handleGenerationTypeToggle = (generationType_) => {
    const generationType = generationType_;
    this.setState({ generationType });
  }

  handleArraySizeChange = (event) => {
    const arraySize = event.target.value;
    this.setState({ arraySize });
  }

  handleGenerate = () => {
    this.props.onReset(this.state.generationType, this.state.arraySize);
  }

}

class Title extends Component {
  render() {
    return (
      <div className="group" style={{backgroundColor: '#FFDEAD'}}>
        <h1>Sorting Sandbox</h1>
      </div>
    )
  }
}

class GenerationType extends Component {
  render () {
    const {generationType, onGenerationTypeToggle} = this.props;
    return (
      <div className="nav group">
        <h4>Generation Types: </h4>
        <div className="btn-group btn-group-toggle m-2">{
          generateModes.map(mode => (
            <label key={mode.id} className={mode.id === generationType ? "btn btn-primary active" : "btn btn-primary"}>
              <input type="radio" id={mode.id} autoComplete="off" onClick={() => onGenerationTypeToggle(mode.id)}/>{mode.innerHTML}
            </label>
          ))}
        </div>
      </div>
    )
  }
}

class ArraySize extends Component {
  render () {
    const {arraySize, onArraySizeChange} = this.props;
    return (
      <div className="nav group">
        <h4 style={{width: 150}}>Array Size: {arraySize}</h4>
        <input className="m-2" type="range" name="range" min={20} max={1000} defaultValue={arraySize} onChange={(value) => onArraySizeChange(value)} />
      </div>
    )
  }
}

class Generate extends Component {
  render () {
    const {onGenerate} = this.props;
    return (
      <button className="btn btn-md btn-primary m-2" onClick={onGenerate}>Generate</button>
    )
  }
}

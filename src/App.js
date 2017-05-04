import './App.css';
var g = require('./map');
import React, { Component } from 'react';

//eslint-disable-next-line
var weapon = {
  'brassknuckles': { name: 'Brass knuckles', strength: 5 },
  'knife': { name: 'Knife', strength: 8 },
  'sword': { name: 'Sword', strength: 15 },
  'mace': { name: 'Mace', strength: 20 },
  'axe': { name: 'Axe', strength: 25 }
}


class App extends Component {
  constructor(props) {
    super(props);
    var cellmap = g.map(row => row.map(col => <div className={'cell ' + col.type}></div>));
    this.state = {
      maparray: g,
      map: cellmap
    };
  }

  componentDidMount() {
    // console.log(document.querySelectorAll('.f'));
  }

  render() {
    return (
      <div className='board'>
        {this.state.map}
      </div>
    );
  }
}

export default App;
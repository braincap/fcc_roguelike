import './App.css';
var g = require('./map');
import React, { Component } from 'react';

//eslint-disable-next-line
var elements = {
  weapon: [
    { name: 'Brass knuckles', strength: 5, x: null, y: null },
    { name: 'Knife', strength: 8, x: null, y: null },
    { name: 'Sword', strength: 15, x: null, y: null },
    { name: 'Mace', strength: 20, x: null, y: null },
    { name: 'Axe', strength: 25, x: null, y: null },
  ],
  hero: { x: null, y: null, life: 100 },
  boss: { x: null, y: null, life: 200 }
}

for (var i = 0; i < g.length; i++) {
  for (var j = 0; j < g[0].length; j++) {
    if (g[i][j].type === 'h') {
      elements.hero.x = i;
      elements.hero.y = j;
    }
    if (g[i][j].type === 'b') {
      elements.boss.x = i;
      elements.boss.y = j;
    }
  }
}

var Cell = (props) => <div className={props.className}></div>


class App extends Component {
  constructor(props) {
    super(props);
    this.mapArrayDivs;
    this.state = {
      prevTile: 'f',
      mapArray: g,
      hero: elements.hero,
      boss: elements.boss
    };
  }

  generateDivArray(mapArray) {
    var mapArrayDivs = [];
    for (var i = 0; i < mapArray.length; i++) {
      for (var j = 0; j < mapArray[0].length; j++) {
        mapArrayDivs.push(
          <Cell
            key={(i * mapArray.length) + j}
            className={'cell ' + mapArray[i][j].type}
            x={i} y={j}>
          </Cell >
        );
      }
    }
    return mapArrayDivs;
  }


  bossfight = () => {
    console.log('a');

    var newMapArray = this.state.mapArray;

    var currBoss = this.state.boss;
    var newBossX = currBoss.x;
    var newBossY = currBoss.y;
    var newBossLife = currBoss.life -= 100;
    var newBoss = { x: newBossX, y: newBossY, life: newBossLife };

    var currHero = this.state.hero;
    var newHeroX = currHero.x;
    var newHeroY = currHero.y;
    var newHeroLife = currHero.life -= 50;
    var newHero = { x: newHeroX, y: newHeroY, life: newHeroLife };

    if (newBossLife <= 0) {
      // newMapArray[newBossX][newBossY].type === 'f';
      // this.setState({ mapArray: newMapArray, mapArrayDivs: this.generateDivArray(newMapArray) });
      alert("You Won!");
      location.reload();
    }
    if (newHeroLife <= 0) {
      // newMapArray[newHeroX][newHeroY].type === 'f';
      // this.setState({ mapArray: newMapArray, mapArrayDivs: this.generateDivArray(newMapArray) });
      alert("You Lost!");
      location.reload();
    }

    this.setState({ boss: newBoss, hero: newHero });
  }

  componentDidMount() {
    this.mapArrayDivs({ mapArrayDivs: this.generateDivArray(this.state.mapArray) });

    document.body.addEventListener('keydown', (e) => {

      var currHeroX = this.state.hero.x;
      var currHeroY = this.state.hero.y;
      var currHeroLife = this.state.hero.life;
      var currMapArray = this.state.mapArray;
      var newMapArray = currMapArray;
      var prevTile = this.state.prevTile;

      switch (e.keyCode) {
        case 37: {
          if (currMapArray[currHeroX][currHeroY - 1].type === 'o') break;
          if (currMapArray[currHeroX][currHeroY - 1].type === 'b') { this.bossfight(); break; }
          newMapArray[currHeroX][currHeroY].type = prevTile;
          prevTile = newMapArray[currHeroX][currHeroY - 1].type;
          newMapArray[currHeroX][currHeroY - 1].type = 'h';
          var newMapArrayDiv = this.generateDivArray(currMapArray);

          this.setState({
            hero: { x: currHeroX, y: currHeroY - 1, life: currHeroLife },
            mapArray: newMapArray,
            mapArrayDivs: newMapArrayDiv,
            prevTile: prevTile
          });
          break;
        }
        case 38: {
          if (currMapArray[currHeroX - 1][currHeroY].type === 'o') break;
          if (currMapArray[currHeroX - 1][currHeroY].type === 'b') { this.bossfight(); break; }
          newMapArray[currHeroX][currHeroY].type = prevTile;
          prevTile = newMapArray[currHeroX - 1][currHeroY].type;
          newMapArray[currHeroX - 1][currHeroY].type = 'h';
          newMapArrayDiv = this.generateDivArray(currMapArray);

          this.setState({
            hero: { x: currHeroX - 1, y: currHeroY, life: currHeroLife },
            mapArray: newMapArray,
            mapArrayDivs: newMapArrayDiv,
            prevTile: prevTile
          });
          break;
        }
        case 39: {
          if (currMapArray[currHeroX][currHeroY + 1].type === 'o') break;
          if (currMapArray[currHeroX][currHeroY + 1].type === 'b') { this.bossfight(); break; }
          newMapArray[currHeroX][currHeroY].type = prevTile;
          prevTile = newMapArray[currHeroX][currHeroY + 1].type;
          newMapArray[currHeroX][currHeroY + 1].type = 'h';
          newMapArrayDiv = this.generateDivArray(currMapArray);
          this.setState({
            hero: { x: currHeroX, y: currHeroY + 1, life: currHeroLife },
            mapArray: newMapArray,
            mapArrayDivs: newMapArrayDiv,
            prevTile: prevTile
          });
          break;
        }
        case 40: {
          if (currMapArray[currHeroX + 1][currHeroY].type === 'o') break;
          if (currMapArray[currHeroX + 1][currHeroY].type === 'b') { this.bossfight(); break; }
          newMapArray[currHeroX][currHeroY].type = prevTile;
          prevTile = newMapArray[currHeroX + 1][currHeroY].type;
          newMapArray[currHeroX + 1][currHeroY].type = 'h';
          newMapArrayDiv = this.generateDivArray(currMapArray);

          this.setState({
            hero: { x: currHeroX + 1, y: currHeroY, life: currHeroLife },
            mapArray: newMapArray,
            mapArrayDivs: newMapArrayDiv,
            prevTile: prevTile
          });
          break;
        }
        default: break;
      }
    });
  }

  render() {
    return (
      <div className='board'>
        {this.state.mapArrayDivs}
      </div>
    );
  }
}

export default App;
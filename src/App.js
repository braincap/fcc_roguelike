import './App.css';
var g = require('./map');
import React, { Component } from 'react';
var _ = require('lodash');

//eslint-disable-next-line
var elements = {
  weapon: [
    { name: 'Brass knuckles', strength: 5 },
    { name: 'Knife', strength: 8 },
    { name: 'Sword', strength: 15 },
    { name: 'Mace', strength: 20 },
    { name: 'Axe', strength: 30 },
  ],
  enemies: [
    _.random(30, 60),
    _.random(30, 60),
    _.random(30, 60),
    _.random(30, 60),
    _.random(30, 60)
  ]
};

var heroX, heroY = null;

for (var i = 0; i < g.length; i++) {
  for (var j = 0; j < g[0].length; j++) {
    if (g[i][j].type === 'h') {
      heroX = i;
      heroY = j;
    }
  }
}

var Cell = (props) => <div className={props.className}></div>


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevTile: 'f',
      mapArray: g,
      heroX: heroX,
      heroY: heroY,
      heroLife: 100,
      heroXp: 0,
      heroLevel: 1,
      heroStrength: 10,
      heroWeapon: null,
      bossX: null,
      bossY: null,
      bossLife: 200,
      enemyLife: elements.enemies,
      enemyActive: null
    };
    this.mapArrayDivs = this.generateDivArray(this.state.mapArray);
  }

  heroTotalStrength() {
    return this.state.heroWeapon ? (this.state.heroLevel * this.state.heroStrength) + elements.weapon[this.state.heroWeapon].strength : (this.state.heroLevel * this.state.heroStrength);
  }

  generateDivArray(mapArray) {
    var mapArrayDivs = [];
    console.log(this.state.heroX, this.state.heroY);
    for (var i = 0; i < mapArray.length; i++) {
      for (var j = 0; j < mapArray[0].length; j++) {
        var visible = i > this.state.heroX - 2 && i < this.state.heroX + 2 && j > this.state.heroY - 2 && j < this.state.heroY + 2;
        mapArrayDivs.push(
          <Cell
            key={(i * mapArray.length) + j}
            className={'cell ' + mapArray[i][j].type + ' ' + ((visible) ? 'y' : 'n')}
            x={i} y={j}>
          </Cell >
        );
      }
    }
    return mapArrayDivs;
  }


  bossfight = () => {
    var newBossLife = this.state.bossLife - this.heroTotalStrength();
    var newHeroLife = this.state.heroLife - 50;

    if (newHeroLife <= 0) {
      alert("You Lost!");
      location.reload();
      return;
    }

    if (newBossLife <= 0) {
      alert("You Won!");
      location.reload();
      return;
    }
    this.setState({ bossLife: newBossLife, heroLife: newHeroLife });
  }

  pickWeapon = (weaponindex) => {
    this.setState({ heroWeapon: weaponindex });
  }

  pickHealth = (healthindex) => {
    this.setState({ heroLife: this.state.heroLife + 50 });
  }

  fightEnemy = (enemyindex, enemyX, enemyY) => {
    var newEnemyLife = this.state.enemyLife[enemyindex] - this.heroTotalStrength();
    var newEnemyLifeArr = this.state.enemyLife;
    newEnemyLifeArr[enemyindex] = newEnemyLife <= 0 ? 0 : newEnemyLife;
    var newHeroLife = this.state.heroLife - 20;

    if (newHeroLife <= 0) {
      alert("You Lost!");
      location.reload();
      return;
    }

    if (newEnemyLife <= 0) {
      console.log('Enemy defeated!');
      this.setState({ heroXp: this.state.heroXp + 50 });
      var newMapArray = this.state.mapArray;
      newMapArray[enemyX][enemyY].type = 'f';
      this.mapArrayDivs = this.generateDivArray(newMapArray);
    }

    if (this.state.heroXp >= 100) {
      this.setState({ heroLevel: this.state.heroLevel + 1, heroXp: 0 });
    }

    this.setState({ heroLife: newHeroLife, enemyLife: newEnemyLifeArr, enemyActive: newEnemyLife <= 0 ? null : enemyindex });
  }

  componentDidMount() {

    document.body.addEventListener('keydown', (e) => {

      var currHeroX = this.state.heroX;
      var currHeroY = this.state.heroY;
      var newMapArray = this.state.mapArray;
      var prevTile = this.state.prevTile;
      var targetType = 'f';

      switch (e.keyCode) {
        case 37: {
          targetType = newMapArray[currHeroX][currHeroY - 1].type;

          if (targetType === 'o') break;
          if (targetType.slice(0, 1) === 'e') { this.fightEnemy(targetType.slice(3, 4), currHeroX, currHeroY - 1); break; }
          if (targetType === 'b') { this.bossfight(); break; }

          newMapArray[currHeroX][currHeroY].type = prevTile;
          prevTile = (targetType === 'd') ? 'd' : 'f';
          newMapArray[currHeroX][currHeroY - 1].type = 'h';
          this.mapArrayDivs = this.generateDivArray(newMapArray);
          this.setState({
            heroY: currHeroY - 1,
            mapArray: newMapArray,
            prevTile: prevTile
          });
          if (targetType.slice(0, 1) === 'w') { this.pickWeapon(targetType.slice(3, 4)); break; }
          if (targetType.slice(0, 1) === 'l') { this.pickHealth(targetType.slice(3, 4)); break; }
          break;
        }
        case 38: {
          targetType = newMapArray[currHeroX - 1][currHeroY].type;

          if (targetType === 'o') break;
          if (targetType.slice(0, 1) === 'e') { this.fightEnemy(targetType.slice(3, 4), currHeroX - 1, currHeroY); break; }
          if (targetType === 'b') { this.bossfight(); break; }

          newMapArray[currHeroX][currHeroY].type = prevTile;
          prevTile = (targetType === 'd') ? 'd' : 'f';
          newMapArray[currHeroX - 1][currHeroY].type = 'h';
          this.mapArrayDivs = this.generateDivArray(newMapArray);
          this.setState({
            heroX: currHeroX - 1,
            mapArray: newMapArray,
            prevTile: prevTile
          });
          if (targetType.slice(0, 1) === 'w') { this.pickWeapon(targetType.slice(3, 4)); break; }
          if (targetType.slice(0, 1) === 'l') { this.pickHealth(targetType.slice(3, 4)); break; }
          break;
        }
        case 39: {
          targetType = newMapArray[currHeroX][currHeroY + 1].type;

          if (targetType === 'o') break;
          if (targetType.slice(0, 1) === 'e') { this.fightEnemy(targetType.slice(3, 4), currHeroX, currHeroY + 1); break; }
          if (targetType === 'b') { this.bossfight(); break; }

          newMapArray[currHeroX][currHeroY].type = prevTile;
          prevTile = (targetType === 'd') ? 'd' : 'f';
          newMapArray[currHeroX][currHeroY + 1].type = 'h';
          this.mapArrayDivs = this.generateDivArray(newMapArray);
          this.setState({
            heroY: currHeroY + 1,
            mapArray: newMapArray,
            prevTile: prevTile
          });
          if (targetType.slice(0, 1) === 'w') { this.pickWeapon(targetType.slice(3, 4)); break; }
          if (targetType.slice(0, 1) === 'l') { this.pickHealth(targetType.slice(3, 4)); break; }
          break;
        }
        case 40: {
          targetType = newMapArray[currHeroX + 1][currHeroY].type;

          if (targetType === 'o') break;
          if (targetType.slice(0, 1) === 'e') { this.fightEnemy(targetType.slice(3, 4), currHeroX + 1, currHeroY); break; }
          if (targetType === 'b') { this.bossfight(); break; }

          newMapArray[currHeroX][currHeroY].type = prevTile;
          prevTile = (targetType === 'd') ? 'd' : 'f';
          newMapArray[currHeroX + 1][currHeroY].type = 'h';
          this.mapArrayDivs = this.generateDivArray(newMapArray);
          this.setState({
            heroX: currHeroX + 1,
            mapArray: newMapArray,
            prevTile: prevTile
          });
          if (targetType.slice(0, 1) === 'w') { this.pickWeapon(targetType.slice(3, 4)); break; }
          if (targetType.slice(0, 1) === 'l') { this.pickHealth(targetType.slice(3, 4)); break; }
          break;
        }
        default: break;
      }
    });
  }

  render() {
    return (
      <div className='board'>
        {this.mapArrayDivs}
        <div className='stats'>
          <ul>
            <li className='cell h'></li>
            <li><h3>Player</h3></li>
            <li>Life: {this.state.heroLife}</li>
            <li>Weapon: {this.state.heroWeapon ? elements.weapon[this.state.heroWeapon].name : 'Bare hands'}</li>
            <li>Weapon strength: {this.state.heroWeapon ? elements.weapon[this.state.heroWeapon].strength : 0}</li>
            <li>Total strength: {this.heroTotalStrength()}</li>
          </ul>
          <ul>
            <li className='cell e'></li>
            <li><h3>Enemy</h3></li>
            <li>Life: {this.state.enemyActive ? elements.enemies[this.state.enemyActive] : 'Fight to see'}</li>
          </ul>
          <ul>
            <li className='cell b'></li>
            <li><h3>Boss</h3></li>
            <li>Life: {this.state.bossLife}</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
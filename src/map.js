var _ = require('lodash');

//settings
const GRID_HEIGHT = 40;
const GRID_WIDTH = 40;
const MAX_ROOMS = 15;
const ROOM_SIZE_RANGE = [7, 12];

const c = {
  GRID_HEIGHT,
  GRID_WIDTH,
  MAX_ROOMS,
  ROOM_SIZE_RANGE
};

const roomdata = [];

const createDungeon = () => {

  //1 : Grid of empty cells
  var grid = [];
  for (var i = 0; i < c.GRID_WIDTH; i++) {
    grid.push([]);
    for (var j = 0; j < c.GRID_HEIGHT; j++) {
      grid[i].push({ type: 'o' });
    }
  }

  //2 : Random values for the first room

  const [min, max] = c.ROOM_SIZE_RANGE
  const firstRoom = {
    x: _.random(1, c.GRID_WIDTH - max - 15),
    y: _.random(1, c.GRID_HEIGHT - max - 15),
    width: _.random(min, max),
    height: _.random(min, max)
  };

  //3 : Place the first room on to grid

  const placeCells = (grid, { x, y, width = 1, height = 1 }, type = 'f') => {
    for (var i = x; i < x + width; i++) {
      for (var j = y; j < y + height; j++) {
        grid[i][j] = {
          type
        };
      }
    }
    return grid;
  }

  //Check for valid room placement

  const isValidRoomPlacement = (grid, { x, y, width = 1, height = 1 }) => {

    //check if room is on the edge of the grid or outside the world
    if (x < 1 || x + width > grid.length - 1) {
      return false;
    }
    if (y < 1 || y + height > grid[0].length - 1) {
      return false;
    }

    //go from y-1 to y+height+1 and check if they are already any floors
    for (var i = x - 1; i < x + width + 1; i++) {
      for (var j = y - 1; j < y + height + 1; j++) {
        if (grid[i][j].type === 'f') {
          return false;
        }
      }
    }
    return true;
  };

  const createRoomFromSeed = (grid, { x, y, width, height }, range = c.ROOM_SIZE_RANGE) => {

    //range for generating the random room heights and widths
    const [min, max] = range;

    //generate room values for each edge of the seed room
    var roomValues = [];

    const north = {
      height: _.random(min, max),
      width: _.random(min, max)
    };
    north.x = _.random(x, x + width - 1);
    north.y = y - north.height - 1;
    north.doorx = _.random(north.x, (Math.min(north.x + north.width, x + width)) - 1);
    north.doory = y - 1;
    roomValues.push(north);

    const east = {
      height: _.random(min, max),
      width: _.random(min, max)
    };
    east.x = x + width + 1;
    east.y = _.random(y, y + height - 1);
    east.doorx = east.x - 1;
    east.doory = _.random(east.y, Math.min(east.y + east.height, y + height) - 1);
    roomValues.push(east);

    const south = {
      height: _.random(min, max),
      width: _.random(min, max)
    };
    south.x = _.random(x, x + width - 1);
    south.y = y + height + 1;
    south.doorx = _.random(south.x, Math.min(south.x + south.width, x + width) - 1);
    south.doory = y + height;
    roomValues.push(south);

    const west = {
      height: _.random(min, max),
      width: _.random(min, max)
    };
    west.x = x - west.width - 1;
    west.y = _.random(y, y + height - 1);
    west.doorx = x - 1;
    west.doory = _.random(west.y, Math.min(west.y + west.height, y + height) - 1);
    roomValues.push(west);

    const placedRooms = [];
    roomValues.forEach(room => {
      if (isValidRoomPlacement(grid, room)) {
        //place room
        roomdata.push(room);
        grid = placeCells(grid, room);
        //place door
        grid = placeCells(grid, { x: room.doorx, y: room.doory }, 'd');
        placedRooms.push(room);
      }
    });
    return { grid, placedRooms };
  }

  //4: Using the first room, recursively add rooms to the grid

  const growMap = (grid, seedRooms, counter = 1, maxRooms = c.MAX_ROOMS) => {

    //exit condition
    if (counter + seedRooms.length > maxRooms || !seedRooms.length) {
      return grid;
    }

    //grid is an object that has a grid property and placedRooms property
    grid = createRoomFromSeed(grid, seedRooms.pop());

    seedRooms.push(...grid.placedRooms);
    counter += grid.placedRooms.length;
    return growMap(grid.grid, seedRooms, counter);

  }

  roomdata.push(firstRoom);
  grid = placeCells(grid, firstRoom);
  return growMap(grid, [firstRoom]);
}

var g = createDungeon();
// roomdata = roomdata.filter((room, index, self) => (index ===
// self.indexOf(room) ));

const firstroomcell = _.min(roomdata.map(room => +((room.x * c.GRID_WIDTH) + room.y)));
const lastroomcell = _.max(roomdata.map(room => +((room.x * c.GRID_WIDTH) + room.y)));
const firstroom = roomdata.filter(room => (room.x * c.GRID_WIDTH) + room.y === firstroomcell)[0];
const lastroom = roomdata.filter(room => (room.x * c.GRID_WIDTH) + room.y === lastroomcell)[0];


const spawnElements = (g) => {
  var herox = _.random(firstroom.x + 1, firstroom.x + firstroom.width - 2);
  var heroy = _.random(firstroom.y + 1, firstroom.y + firstroom.height - 2);
  var bossx = _.random(lastroom.x + 1, lastroom.x + lastroom.width - 2);
  var bossy = _.random(lastroom.y + 1, lastroom.y + lastroom.height - 2);
  for (var i = 0; i < c.GRID_WIDTH; i++) {
    for (var j = 0; j < c.GRID_HEIGHT; j++) {
      if (i === herox && j === heroy) {
        g[i][j].type = 'h';
      }
      if (i === bossx && j === bossy) {
        g[i][j].type = 'b';
      }
    }
  }
  return g;
}

g = spawnElements(g);

module.exports = g;
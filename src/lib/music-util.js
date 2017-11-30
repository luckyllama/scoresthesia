import _ from 'lodash';
const $ = window.$;

const keys = {
  'Cb':  -7,
  'Gb':  -6,
  'Db':  -5,
  'Ab':  -4,
  'Eb':  -3,
  'Bb':  -2,
  'F' :  -1,
  'C' :   0,
  'G' :   1,
  'D' :   2,
  'A' :   3,
  'E' :   4,
  'B' :   5,
  'F#':   6,
  'C#':   7
};

let Util = {
  keyToNum: (keyString) => {
    return keys[keyString];
  },
  numToKey: (keyNum) => {
    return _.invert(keys)[keyNum];
  }
}

export default Util;

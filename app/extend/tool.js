'use strict';
function randCode(length = 6) {
  let num = '';
  for (let i = 0; i < length; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

module.exports = { randCode };


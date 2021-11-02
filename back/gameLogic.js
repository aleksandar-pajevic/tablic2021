function filterCard(card) {
  switch (card.value) {
    case 'ACE':
      return 11;
      break;
    case 'JACK':
      return 12;
      break;
    case 'QUEEN':
      return 13;
      break;
    case 'KING':
      return 14;
      break;
    default:
      return parseInt(card.value);
      break;
  }
}
function getAllIndexes(arr, val) {
  var indexes = [],
    i;
  for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
  return indexes;
}
function arrFilter(mainArr, sampleArr) {
  for (let k = 0; k < sampleArr.length; k++) {
    mainArr.splice(mainArr.indexOf(sampleArr[k]), 1);
  }
  return mainArr;
}
function takeCards(cards, card) {
  let values = [];
  let cardValue = filterCard(card);
  for (let i = 0; i < cards.length; i++) {
    values.push(filterCard(cards[i]));
  }
  valuesArr = [];
  values.sort((a, b) => a - b);

  valuesArr.push(values);
  let change = true;
  let indexes = getAllIndexes(values, 11);
  if (indexes.length > 0 && change) {
    for (let n = 1; n < indexes.length + 1; n++) {
      valuesArr.push([...valuesArr[n - 1]]);
      valuesArr[n][indexes[n - 1]] = 1;
      valuesArr[n].sort((a, b) => a - b);
      change = false;
    }
  }

  if (values.length === 0) {
    return false;
  }
  // console.log('values array:', valuesArr);
  for (niz of valuesArr) {
    let sum = 0;
    let addedNums = [];
    //first loop
    for (let x = niz.length - 1; x >= 0; x--) {
      // console.log('1st loop niz:', niz);
      // console.log('1st number:', niz[x]);
      // console.log('card value:', cardValue);
      addedNums.push(niz[x]);
      sum += niz[x];
      // console.log('1st loop sum:', sum);
      if (sum === cardValue) {
        niz = arrFilter(niz, addedNums);
        sum = 0;
        // console.log('removed numbers:', addedNums);
        // console.log('1nd loop niz reduced:', niz);
        addedNums = [];

        x = niz.length;
      } else if (sum > cardValue) {
      } else {
        //second loop
        for (let y = 0; y < x; y++) {
          // console.log('2nd loop niz:', niz);
          // console.log('2nd loop number:', niz[y]);
          sum += niz[y];
          addedNums.push(niz[y]);
          // console.log('2nd loop sum:', sum);

          if (sum > cardValue) {
            sum = 0;
            addedNums = [];
            break;
          } else if (sum === cardValue) {
            niz = arrFilter(niz, addedNums);
            sum = 0;
            // console.log('removed numbers:', addedNums);
            // console.log('2nd loop niz reduced:', niz);
            addedNums = [];
            x = niz.length;

            break;
          }
        }
      }
    }
  }
  console.log(valuesArr);
  let lengths = [];
  for (let m = 0; m < valuesArr.length; m++) {
    lengths.push(valuesArr[m].length);
  }

  if (lengths.indexOf(0) >= 0) {
    return true;
  } else {
    return false;
  }
}
const filterTable = (table, selected) => {
  return table.filter((item) => !selected.find((el) => item.code === el.code));
};
const filterPairs = (pairs, socket) => {
  return pairs.filter((pair) => pair.room === socket.room);
};

let findPlayer = (pair, playerSocketId) => {
  if (pair.blue.socket.id === playerSocketId) {
    return pair.blue;
  } else {
    return pair.red;
  }
};

function findWinner(pair) {
  function valuateCards(cards) {
    let score = 0;
    for (let i = 0; i < cards.length; i++) {
      if (
        cards[i].value === 'KING' ||
        cards[i].value === 'QUEEN' ||
        cards[i].value === 'JACK' ||
        cards[i].value === 'ACE'
      ) {
        score++;
      } else if (
        cards[i].code === '0H' ||
        cards[i].code === '0C' ||
        cards[i].code === '0S'
      ) {
        score++;
      } else if (cards[i].code === '0D') {
        score = score + 2;
      } else if (cards[i].code === '2C') {
        score++;
      }
    }
    return score;
  }
  blueScore = valuateCards(pair.blue.cards.taken);
  redScore = valuateCards(pair.red.cards.taken);
  console.log('blue cards value:', blueScore);
  console.log('red cards value:', redScore);

  //table
  blueScore = blueScore + pair.blue.tabla;
  redScore = redScore + pair.red.tabla;
  console.log('blue cards value + tabla:', blueScore);
  console.log('red cards value + tabla:', redScore);

  // 3 na karte
  console.log('blue took: ' + pair.blue.cards.taken.length + ' cards.');
  console.log('red took: ' + pair.red.cards.taken.length + ' cards.');

  if (pair.blue.cards.taken.length > pair.red.cards.taken.length) {
    console.log('blue got 3 na karte');
    blueScore = blueScore + 3;
  } else if (pair.blue.cards.taken.length < pair.red.cards.taken.length) {
    console.log('red got 3 na karte');
    redScore = redScore + 3;
  }
  if (blueScore > redScore) {
    console.log('blue - ' + pair.blue.name + ' won game!');
    return pair.blue.name;
  } else if (blueScore < redScore) {
    console.log('red - ' + pair.red.name + ' won game!');
    return pair.red.name;
  } else {
    console.log('It was even!');
    return 0;
  }
}

exports.takeCards = takeCards;
exports.filterTable = filterTable;
exports.filterPairs = filterPairs;
exports.findPlayer = findPlayer;
exports.findWinner = findWinner;

// let test = [
//   {
//     value: '2',
//   },
//   {
//     value: 'ACE',
//   },
//   {
//     value: '7',
//   },
//   {
//     value: '3',
//   },
//   {
//     value: '3',
//   },
// ];

// let test2 = {
//   value: '13',
// };
// console.log(takeCards(test, test2));

let pair = {
  room: 'bc32a8d6-35eb-4f7b-a17e-2af0e541ec4c',
  deckId: 'rfjch0po9f1b',
  moves: 1,
  lastTookId: 'UFhz54UmZLy_Zn23AAAH',
  blue: {
    name: 'Koja',
    tabla: 4,
    socket: {
      _eventsCount: 3,
      _maxListeners: undefined,
      id: 'kokoko1234',

      data: {},
    },
    cards: {
      taken: [
        {
          code: '',
          value: 'ACE',
        },
        {
          code: '',
          value: 'JACK',
        },
        {
          code: '',
          value: '8',
        },
        {
          code: '',
          value: '6',
        },
        {
          code: '',
          value: '10',
        },
        {
          code: '',
          value: 'QUEEN',
        },
        {
          code: '0D',
          value: '',
        },
        {
          code: '',
          value: 'ACE',
        },
        {
          code: '2H',
          value: '',
        },
      ],
    },
  },
  red: {
    name: 'Bule',
    tabla: 2,
    socket: {
      _eventsCount: 3,
      _maxListeners: undefined,
      id: 'kokoko12345',
      data: {},
    },
    cards: {
      taken: [
        {
          code: '2C',
          value: '',
        },
        {
          code: '',
          value: 'ACE',
        },
        {
          code: '',
          value: 'KING',
        },
        {
          code: '',
          value: '10',
        },
        {
          code: '',
          value: '6',
        },
        {
          code: '',
          value: '4',
        },
        {
          code: '',
          value: 'JACK',
        },
        {
          code: '',
          value: 'QUEEN',
        },
        {
          code: '',
          value: '5',
        },
        {
          code: '',
          value: 'JACK',
        },
      ],
    },
  },
};

findWinner(pair);
// let player1 = {
//   name: '',
//   onMove: null,
//   socket: {
//     room: 'ararafas',
//     id: 'kokoko1234',
//   },
//   tabla: 0,
//   cards: {
//     selected: [],

//     hand: null,
//     taken: [
//       {
//         code: '8S',
//         image: 'https://deckofcardsapi.com/static/img/8S.png',
//         images: [Object],
//         value: '8',
//         suit: 'SPADES',
//       },
//       {
//         code: '8H',
//         image: 'https://deckofcardsapi.com/static/img/8H.png',
//         images: [Object],
//         value: '8',
//         suit: 'HEARTS',
//       },
//     ],
//     table: [],
//   },
//   opponent: {
//     name: null,
//     cards: {
//       hand: null,
//     },
//   },
// };

// console.log(findPlayer(pair, player1.socket));

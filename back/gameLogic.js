let arr = [
  {
    value: '10',
  },
  {
    value: '11',
  },
  {
    value: '11',
  },
];

let card = { value: '11' };

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
  // console.log('indexes', indexes);
  console.log('val arr', valuesArr);

  console.log('values:', values);
  console.log('card value:', cardValue);
  if (values[values.length - 1] > cardValue) {
    console.log("user can't take the cards");
  }

  for (niz of valuesArr) {
    let sum = 0;
    let addedNums = [];
    //first loop
    for (let x = niz.length - 1; x >= 0; x--) {
      console.log('niz from first loop', niz);
      // console.log('curent x is:', x);
      addedNums.push(niz[x]);
      sum += niz[x];
      // console.log('first loop sum:', sum);

      if (sum === cardValue) {
        console.log('we have a match(first loop)');
        niz = arrFilter(niz, addedNums);
        console.log('reduced  from first loop:', niz);
        sum = 0;
        addedNums = [];
        x = niz.length;
      } else if (sum > cardValue) {
        console.log('sum is grater then card value');
      } else {
        //second loop
        for (let y = 0; y < niz.length; y++) {
          // console.log('curent y is:', y);

          sum += niz[y];
          addedNums.push(niz[y]);
          // console.log('second loop sum:', sum);

          if (sum > cardValue) {
            sum = 0;
            addedNums = [];
            break;
          } else if (sum === cardValue) {
            console.log('we have match, added nums are:', addedNums);
            niz = arrFilter(niz, addedNums);
            console.log('reduced  from second loop:', niz);
            sum = 0;
            addedNums = [];
            x = niz.length;
            break;
          }
        }
      }
    }
  }
  console.log('niz:', valuesArr);
  let lengths = [];
  for (let m = 0; m < valuesArr.length; m++) {
    lengths.push(valuesArr[m].length);
    console.log('lengths from loop:', lengths);
  }
  console.log('lengths:', lengths);

  if (lengths.indexOf(0) >= 0) {
    return console.log('user can take cards');
  } else {
    return console.log("user can't take cards");
  }
}

takeCards(arr, card);

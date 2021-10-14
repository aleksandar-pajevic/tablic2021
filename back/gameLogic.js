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

  if (values[values.length - 1] > cardValue) {
  }

  for (niz of valuesArr) {
    let sum = 0;
    let addedNums = [];
    //first loop
    for (let x = niz.length - 1; x >= 0; x--) {
      addedNums.push(niz[x]);
      sum += niz[x];

      if (sum === cardValue) {
        niz = arrFilter(niz, addedNums);
        sum = 0;
        addedNums = [];
        x = niz.length;
      } else if (sum > cardValue) {
      } else {
        //second loop
        for (let y = 0; y < niz.length; y++) {
          sum += niz[y];
          addedNums.push(niz[y]);

          if (sum > cardValue) {
            sum = 0;
            addedNums = [];
            break;
          } else if (sum === cardValue) {
            niz = arrFilter(niz, addedNums);
            sum = 0;
            addedNums = [];
            x = niz.length;
            break;
          }
        }
      }
    }
  }
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

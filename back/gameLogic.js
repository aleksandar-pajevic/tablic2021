let arr = [
  {
    value: '3',
  },
  {
    value: '2',
  },
  {
    value: '2',
  },
  {
    value: '6',
  },
  {
    value: '7',
  },
  {
    value: '5',
  },
  {
    value: '6',
  },
  {
    value: '2',
  },
  {
    value: '10',
  },
  {
    value: '8',
  },
  // {code: "QS", image: "https://deckofcardsapi.com/static/img/QS.png",  value: "QUEEN", suit: "SPADES"}
];

let card = { value: '14' };

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

function takeCards(cards, card) {
  let values = [];
  let cardValue = filterCard(card);
  for (let i = 0; i < cards.length; i++) {
    values.push(filterCard(cards[i]));
  }
  values.sort((a, b) => a - b);
  console.log('values:', values);
  console.log('value:', cardValue);

  let sum = 0;
  let addedNums = [];
  if (values[values.length - 1] > cardValue) {
    console.log("user can't take the cards");
  }
  //first loop
  for (let x = 0; x < values.length; x++) {
    console.log('curent x is:', x);
    sum += values[x];
    console.log('first loop sum:', sum);

    if (sum === cardValue) {
      console.log('we have a match(first loop)');
      values.splice(x, addedNums.length + 1);
    } else if (sum > cardValue) {
      console.log('sum is grater then card value');
      break;
    } else {
      //second loop
      for (let y = x + 1; y < values.length; y++) {
        console.log('curent y is:', y);

        sum += values[y];
        addedNums.push(y);
        console.log('second loop sum:', sum);

        if (sum > cardValue) {
          sum = 0;
          addedNums = [];
          break;
        } else if (sum === cardValue) {
          console.log('we have match, added nums are:', x, addedNums);
          values.splice(x, addedNums.length + 1);
          console.log('new reduced values:', values);
          sum = 0;
          addedNums = [];
          x = -1;
          break;
        }
      }
    }
  }
  if (values.length === 0) {
    return console.log('player can take cards');
  } else {
    return console.log("player can't take cards");
  }
}

takeCards(arr, card);

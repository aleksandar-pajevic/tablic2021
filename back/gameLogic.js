export const takeCards = (selectedCards, playerCard) => {
  selectedCardsValue = 0;
  for (let i = 0; i < selectedCards.length; i++) {
    switch (selectedCards[i].value) {
      case 'ACE':
        selectedCardsValue = +11;
        break;
      case 'JACK':
        selectedCardsValue = +12;
        break;
      case 'QUEEN':
        selectedCardsValue = +13;
        break;
      case 'KING':
        selectedCardsValue = +14;
        break;

      default:
        selectedCardsValue = +parseInt(selectedCards[i].value);
        break;
    }
  }
  return selectedCardsValue;
};

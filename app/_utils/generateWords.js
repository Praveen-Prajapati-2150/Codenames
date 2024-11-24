// utils/generateWords.js

import wordList from '../_data/Words';

export const CardType = {
  BLUE: 'blue',
  RED: 'red',
  BLACK: 'black',
  GREY: 'grey',
};

export const generateRandomWords = ({count = 25, containerWidth = 134.05}) => {
  const shuffledWords = wordList.sort(() => 0.5 - Math.random());
  const randomWords = shuffledWords.slice(0, count);

  let blueCount = Math.round(Math.random() * (9 - 8) + 8);

  // Create array of card types
  const cardTypes = [
    ...Array(blueCount).fill(CardType.BLUE), // 9 or 8 blue cards
    ...Array(blueCount === 8 ? 9 : 8).fill(CardType.RED), // 8 or 9 red cards
    CardType.BLACK, // 1 black card
    ...Array(7).fill(CardType.GREY), // 7 grey cards
  ];

  const shuffledCardTypes = cardTypes.sort(() => 0.5 - Math.random());

  // Utility to adjust font size based on container width
  const adjustFontSize = (word, initialFontSize = 1) => {
    let fontSize = initialFontSize;

    // Dummy element to calculate text width
    const textElement = document.createElement('span');
    textElement.style.fontSize = `${fontSize}rem`;
    textElement.style.position = 'absolute';
    textElement.style.visibility = 'hidden';
    textElement.style.whiteSpace = 'nowrap';
    textElement.textContent = word;
    document.body.appendChild(textElement);

    // Adjust font size if it overflows
    // while (textElement.offsetWidth > containerWidth && fontSize > 0.5) {
    //   fontSize -= 0.1;
    //   textElement.style.fontSize = `${fontSize}rem`;
    // }
    if (word.length > 8 && word.length < 11) {
      fontSize -= 0.1;
      textElement.style.fontSize = `${fontSize}rem`;
    } else if (word.length > 12 && word.length < 15) {
      fontSize -= 0.2;
      textElement.style.fontSize = `${fontSize}rem`;
    }

    document.body.removeChild(textElement);
    return fontSize;
  };

  // Return words with dynamically adjusted font sizes

  // console.log({ blueCount });

  let words = randomWords.map((word, index) => ({
    id: index,
    word,
    fontSize: `${adjustFontSize(word)}rem`,
    cardType: shuffledCardTypes[index],
    team:
      shuffledCardTypes[index] === CardType.BLUE
        ? 'blue'
        : shuffledCardTypes[index] === CardType.RED
        ? 'red'
        : null,
    selectors: [],
    isRevealed: false,
  }));

  return { words, blueCount };
};

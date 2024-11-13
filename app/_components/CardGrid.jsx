import React, { forwardRef, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '../components/ui/card';
import { db } from '../configs';
import { RoomWordList } from '../configs/schema';
import { eq } from 'drizzle-orm';
import fetchWords from '../_utils/fetchWords';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { useSocket } from '../context/SocketContext';
import wordList from '../_data/Words';

const CardGrid = forwardRef((props, ref) => {
  const { gameStarted, roomId, user, nickName } = props;

  const socket = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '∞']);
  const [selectedOption, setSelectedOption] = useState(null);
  const [clue, setClue] = useState(false);
  const [clueText, setClueText] = useState('');
  const [clueOption, setClueOption] = useState(0);
  const [showClue, setShowClue] = useState(false);

  // const [words, setWords] = useState([]);
  const [words, setWords] = useState([]);
  const hasInitialized = useRef(false);
  const [openedCards, setOpenedCards] = useState(
    new Array(words.length).fill(false)
  );

  const handleOption = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setClueOption(option);
  };

  const handleClue = () => {
    console.log({ clueText });
    if (!clueText || clueOption == 0) {
      alert('Please provide clue and option');
    } else if (clueText) {
      setClue(true);
    }
  };

  const handleCardColor = (cardType) => {
    switch (cardType) {
      case 'black':
        return `-${0 * 86.49}px`;
        break;
      case 'blue':
        return `-${1 * 86.49}px`;
        break;
      case 'grey':
        return `-${2 * 86.49}px`;
        break;
      case 'red':
        return `-${4 * 86.49}px`;
        break;
      default:
        break;
    }
  };

  const handleCheckCardClue = (item) => {
    console.log(item);
    console.log('user', user);
    if (user.team === item.cardType) {
      console.log(clueOption + 1 === 0);
      if (clueOption === 0) {
        setClue(false);
        setClueText('');
        setShowClue(false);
        setClueOption(0);

        //TODO: write the code to change the turn to opposite team
      } else {
        if (clueOption === 1) {
          setClueOption(0);
        } else {
          setClueOption(clueOption - 1);
        }

        //TODO: to update the card if the right card opens
        console.log('Card Matched');
      }
    } else {
      setClue(false);
      setClueText('');
      setShowClue(false);
      setClueOption(0);

      //TODO: write the code to change the turn to opposite team
      console.log('Card not matched');
    }
  };

  const handleCardClick = (index) => {
    setOpenedCards((prevState) => {
      const newOpenedCards = [...prevState];
      newOpenedCards[index] = !newOpenedCards[index];
      return newOpenedCards;
    });
  };

  const handleSelectors = (cardId) => {
    if (clue && clueText) {
      const updatedWords = words.map((item) => {
        if (item.id === cardId) {
          return {
            ...item,
            selectors: item.selectors.includes(nickName)
              ? item.selectors.filter((name) => name !== nickName)
              : [...item.selectors, nickName],
          };
        }
        return item;
      });

      setWords(updatedWords);

      socket.emit('update-word-state', { roomId, cardId, nickName });
    }
  };

  useEffect(() => {
    if (clue && clueText && clueOption) {
      socket.emit('initialize-clue-name', {
        roomId,
        clueText,
        clueOption,
      });
    }

    const handleInitialClueState = (data) => {
      console.log(data);

      setClueText(data.clueText);
      setClueOption(data.clueOption);
      setShowClue(true);
      setClue(true);
    };

    socket.on('initial-clue-word', handleInitialClueState);

    return () => {
      socket.off('initial-clue-word', handleInitialClueState);
    };
  }, [clue, clueOption]);

  console.log({ showClue });

  useEffect(() => {
    if (!socket || !roomId || !nickName) return;

    const fetchWords_ = async () => {
      fetchWords(roomId)
        .then((roomData) => {
          const initialWords = roomData.wordList;
          console.log('initialWords', initialWords);
          socket.emit('initialize-word-list', {
            roomId,
            wordList: initialWords,
          });
          setWords(initialWords);
        })
        .catch((error) => {
          console.error('Error fetching words:', error);
        });
    };

    fetchWords_();

    const handleInitialWordState = ({ wordList }) => {
      console.log(wordList);
    };

    const handleUpdateWordState = ({ wordList }) => {
      // console.log('boomer');
      setWords(wordList);
      console.log('update list', wordList);
    };

    socket.on('initial-word-list', handleInitialWordState);
    socket.on('update-word-list', handleUpdateWordState);
    // socket.on('new-user', handleNewUser);

    return () => {
      socket.off('initial-word-list', handleInitialWordState);
      socket.off('update-word-list', handleUpdateWordState);
      // socket.off('new-user', handleNewUser);
    };
  }, [socket, roomId, nickName]);

  return (
    <div className="h-[550px] w-full bg-slate-900 px-10 flex flex-col items-start justify-start">
      <div className="grid grid-cols-5 gap-1 sm:gap-1 max-w-5xl w-full">
        {words?.map((item, index) => (
          <Card
            key={index}
            className="relative w-[134.05px] h-[86.49px] aspect-[4/3] overflow-hidden"
            // onClick={() => handleCardClick(index)}
          >
            {user.type === 'spymaster' ? (
              <div
                className="w-full h-[86.49px] bg-no-repeat bg-cover z-0"
                style={{
                  backgroundImage: `url('https://cdn2.codenames.game/cno/2023-12-19/theme/classic/card/fronts.png')`,
                  backgroundPositionY: `${handleCardColor(item.cardType)}`,
                }}
              ></div>
            ) : (
              <div
                className="w-full h-[86.49px] bg-no-repeat bg-cover z-0"
                style={{
                  backgroundImage: `url('https://cdn2.codenames.game/cno/2023-12-19/theme/classic/card/fronts.png')`,
                  backgroundPositionY: `-${2 * 86.49}px`,
                }}
              ></div>
            )}

            <CardContent className="absolute inset-0  bg-opacity-50 flex items-center justify-center z-10">
              <p
                className="text-black w-[134.05px] px-4 pt-16 text-center text-nowrap font-bold shadow-sm"
                style={{ fontSize: item.fontSize }}
              >
                {item.word.toUpperCase()}
              </p>
            </CardContent>

            {/* Cover Layer */}
            {/* <div
              className={`absolute inset-0 w-full h-full bg-cover transition-all duration-500 cursor-pointer z-20 ${
                openedCards[index] ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                // backgroundImage: `url('https://cdn2.codenames.game/cno/2023-12-19/theme/classic/card/backs.png')`,
                // backgroundPositionY: `-${3 * 86.49}px`,
                backgroundImage: `url('https://cdn2.codenames.game/cno/2023-12-19/theme/classic/card/backs.png')`,
                backgroundPositionY: `-${0 * 86.49}px`,
              }}
            ></div> */}

            {/* Cover Layer */}
            {/* <div className="w-full flex items-center justify-center">
              <div
                className={`absolute left-1/2 top-1/2
                inset-0 
                w-[85px]
                h-[77px]
                bg-cover transition-all duration-500 cursor-pointer z-40
                text-center flex items-center justify-center        
                mt-1    
                ${openedCards[index] ? 'opacity-0' : 'opacity-100'}
                `}
                style={{
                  transform: 'translate(-50%, -50%)',
                  // backgroundImage: `url('https://cdn2.codenames.game/cno/2023-12-19/theme/classic/card/red.png')`,
                  backgroundImage: `url('https://cdn2.codenames.game/cno/2023-12-19/theme/classic/card/blue.png')`,
                  backgroundPositionY: `-${2 * 76.9}px`,
                }}
              ></div>
            </div> */}

            <div className="w-full flex items-center justify-center">
              <div
                onClick={() => handleSelectors(item.id)}
                className={`absolute pt-2 pl-2 pb-2 pr-4 
                flex flex-wrap 
                inset-0 
                w-full 
                bg-cover transition-all duration-500 cursor-pointer z-50 
                ${openedCards[index] ? 'opacity-0' : 'opacity-100'} 
                `}
              >
                {item.selectors?.map((item, index) => {
                  return (
                    <p
                      key={index}
                      className="bg-yellow-500 text-white text-[13px] p-1 h-5 
                      flex items-center text-center mr-[0.8px] rounded-sm"
                    >
                      {item}
                    </p>
                  );
                })}
              </div>
            </div>

            {clue && user.type === 'operative' && (
              <div className="w-full flex items-center justify-center">
                <div
                  onClick={() => handleCheckCardClue(item)}
                  className={`absolute left-1/2 top-1/2 inset-0 w-[30px] h-[30px] bg-cover transition-all duration-500 cursor-pointer z-50
                              text-center flex items-center justify-center mt-1`}
                  style={{
                    transform: 'translate(125%, -155%)',
                    backgroundImage: `url('https://cdn2.codenames.game/cno/2023-12-19/img/icon/icon_tap_card.png')`,
                  }}
                ></div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="w-full pt-10 flex items-center justify-center ">
        {user?.type === 'spymaster' && !clue && (
          <>
            <input
              className="bg-white outline-none px-3 mr-2 rounded-full w-auto py-2"
              type="text"
              placeholder="TYPE YOUR CLUE HERE"
              onChange={(e) => setClueText(e.target.value)}
            />
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger className="outline-none rounded-full">
                <Button className="mr-2 bg-white text-black">
                  {selectedOption ? selectedOption : '-'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-[#222222] rounded-xl outline-none">
                <div className="pt-3 mb-2 flex items-center justify-center">
                  {options?.map((item) => (
                    <Button
                      key={item}
                      onClick={() => handleOption(item)}
                      size={'sm'}
                      className="bg-white text-black rounded-full h-10 w-10 mr-1 ml-1"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleClue} className="bg-green-500">
              Give Clue
            </Button>
          </>
        )}
        {showClue && (
          <div className="flex items-center">
            <Button>{clueText}</Button>
            <Button>{clueOption}</Button>
          </div>
        )}
      </div>
    </div>
  );
});

export default CardGrid;

import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function TeamCard(props) {
  const {
    img,
    flex,
    color,
    players,
    spyMaster,
    team,
    handleOperative,
    nickName,
    gameStarted,
  } = props;

  const [hideOperativeButton, setHideOperativeButton] = useState(false);
  const [hideSpyMasterButton, setHideSpyMasterButton] = useState(false);

  const handleButtonStatus = () => {
    let user = JSON.parse(localStorage.getItem('user'));

    if (players.includes(nickName)) {
      setHideOperativeButton(true);
    } else {
      setHideOperativeButton(false);
    }
    if (spyMaster.includes(nickName)) {
      setHideSpyMasterButton(true);
    } else {
      setHideSpyMasterButton(false);
    }
  };

  useEffect(() => {
    handleButtonStatus();
  }, [gameStarted]);

  useEffect(() => {
    handleButtonStatus();
  }, [players, spyMaster]);

  return (
    <Card
      className={`w-64 text-[#d4a57f] rounded-lg overflow-hidden`}
      style={{ backgroundColor: color }}
    >
      <CardContent className="p-4 space-y-3">
        <div className={`flex ${flex} justify-between items-center`}>
          <div className="relative w-28 h-24 rounded overflow-hidden">
            <img
              //   src="https://cdn2.codenames.game/cno/2023-12-19/theme/halloween/card/red.png"
              src={img}
              alt="Character portrait"
              width={130}
              height={110}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-4xl font-bold">8</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm">Operative(s)</p>
          {players.length > 0
            ? players?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-[#3a1717] text-[#d4a57f] px-2 py-1 mr-1 rounded text-sm inline-block"
                  >
                    {item}
                  </div>
                );
              })
            : '-'}
        </div>
        <div>
          {!hideOperativeButton && (
            <Button
              size={'sm'}
              className=" bg-[#7d5e3f] hover:bg-[#8d6e4f] text-[#d4a57f]"
              onClick={() => handleOperative({ team, type: 'operative' })}
            >
              Join as Operative
            </Button>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm">Spymaster(s)</p>
          <div className="text-sm">
            {spyMaster.length > 0
              ? spyMaster?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-[#3a1717] text-[#d4a57f] px-2 py-1 mr-1 rounded text-sm inline-block"
                    >
                      {item}
                    </div>
                  );
                })
              : '-'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {!hideSpyMasterButton && (
          <Button
            size={'sm'}
            className=" bg-[#7d5e3f] hover:bg-[#8d6e4f] text-[#d4a57f]"
            onClick={() => handleOperative({ team, type: 'spymaster' })}
          >
            Join as Spymaster
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

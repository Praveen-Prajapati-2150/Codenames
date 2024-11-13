import { useState } from 'react';
import { ChevronDown, Flag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export default function SetUpGame(props) {
  const { handleStartGame } = props;

  const [selectedPacks, setSelectedPacks] = useState([
    'Codenames',
    'Codenames: Duet',
  ]);

  const togglePack = (pack) => {
    setSelectedPacks((prev) =>
      prev.includes(pack) ? prev.filter((p) => p !== pack) : [...prev, pack]
    );
  };

  return (
    <div>
      <Card className="w-full max-w-md mx-auto h-[575px] overflow-auto bg-zinc-800 text-white custom-scrollbar">
        <CardHeader>
          <CardTitle className="text-sm text-center">
            Select the game variant:
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center">
              <img
                height={200}
                width={100}
                src="https://cdn2.codenames.game/cno/2023-12-19/img/box_cn.png"
                alt=""
              />
              <p className="text-red-500 text-sm">Team Vs Team</p>
              <span className="text-gray-400 text-sm">4+ players</span>
            </div>

            <div className="flex flex-col items-center">
              <img
                height={200}
                width={100}
                src="https://cdn2.codenames.game/cno/2023-12-19/img/box_cnd.png"
                alt=""
              />
              <p className="text-green-500">Cooperative</p>
              <span className="text-gray-400 text-sm">2+ players</span>
            </div>
          </div>

          <div className="flex items-center space-x-2  p-2 rounded">
            <Select>
              <SelectTrigger className=" h-[35px] w-[100%] text-sm text-black outline-none">
                <SelectValue placeholder="Select language of words: English" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">English</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p>Select which word packs to use:</p>
            {['Codenames', 'Codenames: Duet'].map((pack) => (
              <div key={pack} className="flex items-center">
                <Checkbox
                  id={pack}
                  checked={selectedPacks.includes(pack)}
                  onCheckedChange={() => togglePack(pack)}
                />
                <label
                  htmlFor={pack}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {pack}
                </label>
              </div>
            ))}

            <div key={'boom'} className="flex flex-col">
              <div className="flex items-center">
                <Checkbox
                  // id={pack}
                  checked={selectedPacks.includes('Custom word pack')}
                  onCheckedChange={() => togglePack('Custom word pack')}
                />
                <label
                  htmlFor={'boom'}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Custom word pack
                </label>
              </div>
              {selectedPacks.includes('Custom word pack') && (
                <div className="flex items-center pt-1">
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                  <Select>
                    <SelectTrigger className="ml-2 h-[30px] w-[100%] bg-gray-700 text-sm outline-none">
                      <SelectValue placeholder="Make sure some of them appear" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">Just add them to Deck</SelectItem>
                        <SelectItem value="2">
                          Make sure some of them appear
                        </SelectItem>
                        <SelectItem value="3">
                          Make sure lots of them appear
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {[
              'Halloween',
              'Holidays',
              'Boardgames',
              'CGE Games',
              'Through the Ages',
              'Galaxy Trucker',
            ].map((pack) => (
              <div key={pack} className="flex flex-col">
                <div className="flex items-center">
                  <Checkbox
                    id={pack}
                    checked={selectedPacks.includes(pack)}
                    onCheckedChange={() => togglePack(pack)}
                  />
                  <label
                    htmlFor={pack}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Bonus Pack: {pack} (words: 20)
                  </label>
                </div>
                {selectedPacks.includes(pack) && (
                  <div className="flex pt-1">
                    {/* <Button className="ml-2 ml-6" variant="secondary" size="sm">
                      Make sure lots of them appear
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button> */}
                    <Select>
                      <SelectTrigger className="ml-2 ml-6 h-[30px] w-[100%] bg-gray-700 text-sm outline-none">
                        <SelectValue placeholder="Make sure some of them appear" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">
                            Just add them to Deck
                          </SelectItem>
                          <SelectItem value="2">
                            Make sure some of them appear
                          </SelectItem>
                          <SelectItem value="3">
                            Make sure lots of them appear
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between space-x-2">
          <Button variant="secondary">Randomize Teams</Button>
          <Button variant="secondary">Reset Teams</Button>
        </CardFooter>
        <div className="px-6 pb-6">
          <Button
            onClick={handleStartGame}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Start New Game
          </Button>
        </div>
      </Card>
    </div>
  );
}

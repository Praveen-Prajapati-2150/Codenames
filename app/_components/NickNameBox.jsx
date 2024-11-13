import React, { useEffect, useState } from 'react';
import { Skeleton } from '../components/ui/skeleton';
// import { Card } from '../components/ui/card';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';

const NickNameBox = (props) => {
  const { roomId, nickName, handleNickNameStorage } = props;

  const [name, setName] = useState('');

  useEffect(() => {
    if (nickName) {
      setName(nickName);
    }
  }, [nickName]);

  return (
    <Card className="w-[450px] p-6 text-center bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg border border-white border-opacity-20 z-10">
      <CardHeader>
        <CardTitle>Welcome to Codenames</CardTitle>
        {/* <CardDescription>
        Deploy your new project in one-click.
      </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">
                To enter the room, choose a nickname.
              </Label>
              <Input
                className="text-center mt-2"
                id="name"
                placeholder="Enter your nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {/* <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">Framework</Label>
            <Select>
              <SelectTrigger id="framework">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="sveltekit">SvelteKit</SelectItem>
                <SelectItem value="astro">Astro</SelectItem>
                <SelectItem value="nuxt">Nuxt.js</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <Button variant="outline">Cancel</Button>
        <Link href={`/room/${roomId}`}>
          <Button onClick={() => handleNickNameStorage(name)} className="ml-2">
            Create Room
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default NickNameBox;

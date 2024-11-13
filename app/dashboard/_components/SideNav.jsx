import { LibraryBig, LineChart, MessageSquare, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import { db } from '../../configs';
import { JsonForms } from '../../configs/schema';

const SideNav = () => {
  const MenuList = [
    {
      id: 1,
      name: 'My Forms',
      icon: LibraryBig,
      path: '/dashboard',
    },
    {
      id: 2,
      name: 'Responses',
      icon: MessageSquare,
      path: '/dashboard/responses',
    },
    {
      id: 3,
      name: 'Analytics',
      icon: LineChart,
      path: '/dashboard/analytics',
    },
    {
      id: 4,
      name: 'Upgrade',
      icon: Shield,
      path: '/dashboard/upgrade',
    },
  ];

  const path = usePathname();
  const { user } = useUser();
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    user && getFormList();
  }, [user]);

  const getFormList = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(JsonForms.id));

    setFormList(result);
  };

  return (
    <div className="h-screen shadow-md border bg-white">
      <div className="p-5">
        {MenuList?.map((item, index) => {
          return (
            <Link key={item.id} href={item.path}>
              <h2
                className={`flex align-center gap-3 p-4 mb-3
                hover:bg-primary hover:text-white cursor-pointer rounded-lg
                ${path === item.path && 'bg-primary text-white'}
                `}
              >
                <item.icon />
                {item.name}
              </h2>
            </Link>
          );
        })}
      </div>
      <div className="fixed bottom-7 p-6 w-64">
        <Button className="w-full">+ Create Form</Button>
        <div className="my-7">
          <Progress value={(formList?.length / 3) * 100} />
          <h1 className="text-sm mt-2 text-gray-600">
            <strong>{formList?.length}</strong> out of <strong>3</strong> File
            Created
          </h1>
          <h1 className="text-xs mt-3 text-gray-600">
            Upgrade your plan fro unlimited AI form build
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SideNav;

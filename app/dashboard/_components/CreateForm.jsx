// 'use client';
import React, { useState } from 'react';
import { Button } from '../../components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // } from '@/components/ui/dialog';
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { AiChatSession } from '../../configs/AiModal';
import { db } from '../../configs/index';
import { useUser } from '@clerk/nextjs';
import { JsonForms } from '../../configs/schema';
import { Loader2, Route } from 'lucide-react';
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';
import generateUniqueId from '../../_utils/generateUniqueId';

const CreateForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter(); // Import the useRouter hook
  const Prompt = `On the basis of description please give form in Json 
  format with form form_title, form form_subheading, form form_fields, 
  field_type, field_name, field_placeholder, field_name, and field_label, 
  in Json format. and keep the key name same everytime. If field have field_options 
  then it should have field_options with object of {value: 'one-time', label: 'One-time'} this type.  
  field_type should be one of text, email, tel, url, date, number, password, textarea, select, radio, checkbox, dropdown.
  `;

  const onCreateForm = async () => {
    // setOpenDialog(false)

    setLoading(true);
    const result = await AiChatSession.sendMessage(
      `Description: ${userInput}, ${Prompt}`
    );

    const uniqueId = generateUniqueId();

    if (result.response.text()) {
      const resp = await db
        .insert(JsonForms)
        .values({
          uniqueId,
          jsonform: result.response.text(),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: new Date().toISOString(),
        })
        .returning({ id: JsonForms.id });

      if (resp[0].id) {
        router.push('/edit-form/' + resp[0].id);
      }

      // console.log(resp);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              <Textarea
                className="my-2"
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Write description of your form"
              />
              <div className="flex gap-2 my-3 justify-end">
                <Button
                  onClick={() => setOpenDialog(false)}
                  variant="destructive"
                >
                  Cancel
                </Button>
                <Button disabled={loading} onClick={() => onCreateForm()}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Create'}
                  Create
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForm;

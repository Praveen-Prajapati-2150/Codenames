import { Edit, Share2, Trash } from 'lucide-react';
import React from 'react';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { useUser } from '@clerk/nextjs';
import { db } from '../../configs';
import { and, eq } from 'drizzle-orm';
import { toast } from 'sonner';
import { JsonForms, userResponses } from '../../configs/schema';
import { RWebShare } from 'react-web-share';

const FormListItem = ({ jsonForm, formRecord, refreshData }) => {
  console.log(jsonForm);

  const { user } = useUser();

  const onDeleteForm = async () => {
    if (!formRecord?.id) {
      toast('Form not found');
      return;
    }

    if (!user?.primaryEmailAddress?.emailAddress) {
      toast('User not authenticated');
      return;
    }

    try {
      await db
        .delete(userResponses)
        .where(eq(userResponses.formRef, formRecord?.id));

      const result = await db
        .delete(JsonForms)
        // .set({ deleted: true }) // Mark the form as deleted
        .where(
          and(
            eq(JsonForms.id, formRecord?.id),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );

      console.log(result);

      if (result.rowCount > 0) {
        // Assuming Drizzle ORM returns the number of affected rows
        toast('Form Deleted Successfully');
        refreshData();
      } else {
        toast('Error Deleting Form: Form not found or not authorized');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      toast('Error Deleting Form');
    }
  };

  return (
    <div className="border shadow-sm rounded-lg p-4">
      <div className="flex justify-between ">
        <h2></h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash className="h-5 w-5 text-red-600 cursor-pointer hover:scale-105 transition-all" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                form and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteForm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <h2 className="text-lg text-black">{jsonForm.form_title}</h2>
      <h2 className="text-sm text-gray-500">{jsonForm.form_subheading}</h2>
      <hr className="my-4" />
      <div className="flex justify-between">
        <RWebShare
          data={{
            text: jsonForm.form_subheading,
            //   url:
            //     process.env.NEXT_PUBLIC_BASE_URL + '/aiform/' + formRecord?.id,
            title: jsonForm.form_title,
          }}
          onClick={() => console.log('shared successfully!')}
        >
          <Button variant="outline" size="sm" className="flex gap-2">
            <Share2 className="h-5 w-5" /> Share
          </Button>
        </RWebShare>
        <Link href={'/edit-form/' + formRecord?.id}>
          <Button size="sm" className="flex gap-2">
            <Edit className="h-5 w-5" /> Edit
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FormListItem;

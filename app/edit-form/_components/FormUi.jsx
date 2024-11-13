import { Input } from '../../components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Textarea } from '../../components/ui/textarea';
import FieldEdit from './FieldEdit';
import { userResponses } from '../../configs/schema';
import { db } from '../../configs/index';
import { toast } from 'sonner';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';

const renderField = (
  field,
  handleInputChange,
  formData,
  handleCheckboxChange
) => {
  switch (field.field_type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'url':
    case 'file':
    case 'date':
    case 'number':
    case 'password':
      return (
        <Input
          type={field.field_type}
          name={field.field_name}
          placeholder={field.field_placeholder}
          className="border w-full p-2 rounded-md"
          onChange={(e) => handleInputChange(e, field.field_label)}
        />
      );
    case 'textarea':
      return (
        <Textarea
          name={field.field_name}
          placeholder={field.field_placeholder}
          className="border w-full p-2 rounded-md"
          onChange={(e) => handleInputChange(e, field.field_label)}
        />
      );
    case 'select':
    case 'dropdown':
      return (
        <Select
          className="w-full text-xs text-gray-500"
          onValueChange={(e) => handleInputChange(e, field.field_label)}
          defaultValue={field.value}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={field.field_placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field?.field_options?.map((option, index) => (
              <SelectItem
                key={option + index}
                value={option.value ? option.value : option}
              >
                {option.value ? option.value : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'radio':
      return (
        <RadioGroup
          onValueChange={(e) => handleInputChange(e, field.field_label)}
          defaultValue={field.value}
          name={field.field_name}
          className="flex flex-col gap-2"
        >
          {field.field_options?.map((option, index) => (
            <div key={option + index} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={option + index} />
              <Label htmlFor={option + index}>{option.value}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    case 'checkbox':
      return (
        <div className="flex flex-col gap-2">
          {field.field_options?.map((option, index) => (
            <div key={option + index} className="flex items-center gap-2">
              <Checkbox
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked, option.value, field.field_label)
                }
                name={field.field_name}
                id={option + index}
              />
              <Label htmlFor={option + index}>{option.value}</Label>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const FormUi = ({
  jsonForm,
  onFieldUpdate,
  deleteField,
  selectedTheme,
  jsonFormId,
  enableSignIn = false,
}) => {
  const path = usePathname();
  const { user, isSignedIn } = useUser();

  const [formData, setFormData] = useState({});
  let formRef = useRef();

  const handleInputChange = (event, field_label) => {
    const value = event.target ? event.target.value : event;
    setFormData((prevData) => ({ ...prevData, [field_label]: value }));
  };

  const handleCheckboxChange = (checked, value, field_label) => {
    if (checked) {
      if (!formData.field_label) {
        formData.field_label = [value];
      } else {
        formData.field_label = [...formData.field_label, value];
      }
    } else {
      if (formData.field_label?.length > 0) {
        formData.field_label = formData.field_label.filter(
          (item) => item !== value
        );
      }
    }

    setFormData(formData);
  };

  console.log(formData);

  // useEffect(() => {
  //   document.documentElement.setAttribute('data-theme', selectedTheme);
  // }, [selectedTheme]);

  const handleSubmit = async (e) => {
    // console.log(formData);
    e.preventDefault();

    // console.log({jsonFormId})

    const result = await db.insert(userResponses).values({
      jsonResponse: formData,
      createdBy: 'anonymous',
      createdAt: new Date().toISOString(),
      formRef: jsonFormId,
    });

    if (result) {
      formRef.reset();
      setFormData({});
      toast('Response Submitted Successfully !');
    } else {
      toast('Internal Server Error !');
    }
  };

  console.log(jsonForm);

  return (
    <form
      ref={(e) => (formRef = e)}
      onSubmit={handleSubmit}
      className="border p-5 md:w-[600px] rounded-lg"
      data-theme={selectedTheme}
    >
      <h2 className="font-bold text-center text-2xl">
        {jsonForm?.form_title ? (
          jsonForm?.form_title
        ) : (
          <div className="flex items-center justify-center w-full">
            <Skeleton className="w-[60%] h-[40px] rounded-lg " />
          </div>
        )}
      </h2>
      <h2 className="text-sm text-gray-400 text-center">
        {jsonForm?.form_subheading ? (
          jsonForm?.form_subheading
        ) : (
          <Skeleton className="w-full mt-2 mb-4 h-[20px] rounded-lg" />
        )}
      </h2>

      {/* {jsonForm?.form_fields.length > 0 */}
      {!jsonForm?.form_fields
        ? Array.from({ length: 6 }).map((_, index) => (
            <div className="flex flex-col">
              <Skeleton
                key={index}
                className=" w-[100px] h-[15px] rounded-lg"
              />
              <Skeleton
                key={index}
                className="mt-1 mb-4 w-full h-[38px] rounded-lg"
              />
            </div>
          ))
        : jsonForm?.form_fields?.map((field, index) => {
            return (
              <div key={index} className="my-3 flex gap-2">
                <div className="w-full">
                  {field.field_type === 'checkbox' && !field.field_options ? (
                    <>
                      <div key={index} className="flex items-center gap-2">
                        <Checkbox
                          // onCheckedChange={(checked) =>
                          //   handleCheckboxChange(
                          // checked,
                          // option.value,
                          // field.field_label
                          //   )
                          // }
                          // checked={field.value}
                          onCheckedChange={(checked) =>
                            // handleCheckboxChange(
                            //   checked,
                            //   option.value,
                            //   field.field_label
                            // )
                            handleInputChange(checked, field.field_label)
                          }
                          name={field.field_name}
                          id={field.field_name}
                        />
                        <Label
                          className="text-xs text-gray-500"
                          htmlFor={field.field_name}
                        >
                          {field.field_label}
                        </Label>
                      </div>
                    </>
                  ) : (
                    <>
                      <Label className="text-xs text-gray-500">
                        {field.field_label}
                      </Label>
                      {renderField(
                        field,
                        handleInputChange,
                        formData,
                        handleCheckboxChange
                      )}
                    </>
                  )}
                </div>
                {!path.includes('aiform') && (
                  <FieldEdit
                    defaultValue={field}
                    onUpdate={(value) => onFieldUpdate(value, index)}
                    deleteField={() => deleteField(index)}
                  />
                )}
              </div>
            );
          })}

      {/* {!enableSignIn ? (
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      ) : isSignedIn ? (
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      ) : (
        <Button>
          <SignInButton mode="modal">Sign In Before Submit</SignInButton>
        </Button>
      )} */}
    </form>
  );
};

export default FormUi;

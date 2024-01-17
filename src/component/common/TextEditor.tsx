import { HTMLAttributes } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface TextEditorProps<T extends FieldValues>
  extends HTMLAttributes<HTMLDivElement> {
  name: Path<T>;
  control: Control<T>;
}

export default function TextEditor<T extends FieldValues>({
  name,
  control,
  className,
}: TextEditorProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref } }) => (
        <ReactQuill
          id="post-description"
          theme="snow"
          value={value}
          modules={{
            toolbar: {
              container: [['bold', 'italic', 'underline', 'strike'], ['link']],
            },
          }}
          onChange={onChange}
          className={cn('quill-style', className)}
          ref={ref}
        />
      )}
    />
  );
}

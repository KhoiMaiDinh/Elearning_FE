import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Import CSS của react-quill-new
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

type TextAreaRegisterLectureProps = {
  labelText?: string;
  labelClassName?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

const TextAreaRegisterLecture: React.FC<TextAreaRegisterLectureProps> = ({
  labelText,
  name,
  placeholder,
  value,
  className,
  onChange,
  error,
  disabled,
}) => {
  return (
    <div
      className={`flex flex-col h-auto w-full gap-1.5 font-sans font-normal text-black70 dark:text-AntiFlashWhite ${className}`}
    >
      <Label htmlFor={name}>{labelText}</Label>
      <ReactQuill
        // theme="snow"
        preserveWhitespace
        className="max-h-[500px] overflow-auto rounded-sm [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:rounded-b-md [&_.ql-editor]:whitespace-normal"
        value={value}
        onChange={(content: any) => onChange?.(content)}
        placeholder={placeholder}
        readOnly={disabled}
        modules={{
          toolbar: [
            // Headings
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            // Font family & size
            [{ font: [] }],
            // [{ size: ['small', false, 'large', 'huge'] }],

            // Text styling
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],

            // Text color & background
            [{ color: [] }, { background: [] }],

            // Text alignment
            [{ align: ['', 'center', 'right', 'justify'] }],

            // Lists & Indentation
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],

            // Links & Media
            ['link'],

            // Code & Formula
            ['code-block'],

            // Subscript & Superscript
            [{ script: 'sub' }, { script: 'super' }],

            // Clean formatting
            ['clean'],
          ],
          keyboard: {
            bindings: {
              enter: {
                key: 13,
                shiftKey: true,
                handler: (range: any, context: any) => {
                  console.log('shift+enter', range, context);
                  return true;
                },
              },
            },
          },
        }}
        formats={[
          // Headings
          'header',

          // Font styles
          'font',
          'size',
          'bold',
          'italic',
          'underline',
          'strike',

          // Text alignment & color
          'align',
          'color',
          'background',

          // Paragraphs & Lists
          'blockquote',
          'list',
          'bullet',
          'indent',

          // Links & Media
          'link',
          'image',
          'video',

          // Advanced formatting
          'code-block',
          'formula',
          'script',

          // Clean
          'clean',
          // 'paragraph',
        ]}
      />
      {error && (
        <span className="mb-1 font-medium text-[9px] text-redPigment h-[9px]">
          {error && !disabled ? error : ''}
        </span>
      )}
    </div>
  );
};

export default TextAreaRegisterLecture;

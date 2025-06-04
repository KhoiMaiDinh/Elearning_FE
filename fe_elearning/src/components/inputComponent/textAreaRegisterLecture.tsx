import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Import CSS của react-quill-new
import Asterisk from '../asterisk/asterisk';
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
  isRequired?: boolean;
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
  isRequired,
}) => {
  return (
    <div
      className={`flex flex-col w-full gap-1.5 font-sans font-normal text-black70 dark:text-AntiFlashWhite ${className}`}
    >
      <Label htmlFor={name} className={disabled ? 'opacity-50' : ''}>
        {labelText} {isRequired && <Asterisk />}
      </Label>
      <div className={`relative ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <ReactQuill
          preserveWhitespace
          className={`max-h-[500px] overflow-auto rounded-sm [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:rounded-b-md [&_.ql-editor]:whitespace-normal ${
            disabled ? '[&_.ql-editor]:bg-gray-100 dark:[&_.ql-editor]:bg-gray-800' : ''
          }`}
          value={value}
          onChange={(content: any) => onChange?.(content)}
          placeholder={placeholder}
          readOnly={disabled}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ font: [] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ color: [] }, { background: [] }],
              [{ align: ['', 'center', 'right', 'justify'] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              ['link'],
              ['code-block'],
              [{ script: 'sub' }, { script: 'super' }],
              ['clean'],
            ],
            keyboard: {
              bindings: {
                enter: {
                  key: 13,
                  shiftKey: true,
                  handler: (range: any, context: any) => {
                    return true;
                  },
                },
              },
            },
          }}
          formats={[
            'header',
            'font',
            'size',
            'bold',
            'italic',
            'underline',
            'strike',
            'align',
            'color',
            'background',
            'blockquote',
            'list',
            'bullet',
            'indent',
            'link',
            'image',
            'video',
            'code-block',
            'formula',
            'script',
            'clean',
          ]}
        />
        {disabled && <div className="absolute inset-0 bg-transparent" />}
      </div>
      {error && (
        <span className="mb-1 font-medium text-[9px] text-redPigment h-[9px]">
          {error && !disabled ? error : ''}
        </span>
      )}
    </div>
  );
};

export default TextAreaRegisterLecture;

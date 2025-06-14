'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import Asterisk from '../asterisk/asterisk';

import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ color: [] }, { background: [] }],
    [{ align: ['', 'center', 'right', 'justify'] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['code-block'],
    [{ script: 'sub' }, { script: 'super' }],
    ['clean'],
  ],
  clipboard: { matchVisual: true },
  keyboard: {
    bindings: {
      enter: {
        key: 13,
        shiftKey: true,
        handler: () => true,
      },
    },
  },
};

const formats = [
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
];

type RichTextEditorProps = {
  label?: string;
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

const TextAreaRegisterLecture: React.FC<RichTextEditorProps> = ({
  label,
  labelClassName,
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
      {label && (
        <Label htmlFor={name} className={`${labelClassName} ${disabled ? 'opacity-50' : ''}`}>
          {label} {isRequired && <Asterisk />}
        </Label>
      )}

      <style jsx global>{`
        .ql-editor {
          min-height: 200px;
          max-height: 500px;
          overflow: auto;
        }

        .ql-editor td,
        .ql-editor th {
          border: 1px solid #ddd;
          padding: 8px;
          min-width: 50px;
        }
        .ql-editor th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .ql-editor tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .ql-editor tr:hover {
          background-color: #f1f1f1;
        }
      `}</style>

      <div className={`relative ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <ReactQuill
          preserveWhitespace
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={disabled}
          modules={modules}
          formats={formats}
          className={`max-h-[500px] overflow-auto rounded-sm [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:rounded-b-md [&_.ql-editor]:whitespace-normal ${
            disabled ? '[&_.ql-editor]:bg-gray-100 dark:[&_.ql-editor]:bg-gray-800' : ''
          }`}
        />
        {disabled && <div className="absolute inset-0 bg-transparent" />}
      </div>

      {error && !disabled && (
        <span className="mb-1 font-medium text-[9px] text-redPigment h-[9px]">{error}</span>
      )}
    </div>
  );
};

export default TextAreaRegisterLecture;

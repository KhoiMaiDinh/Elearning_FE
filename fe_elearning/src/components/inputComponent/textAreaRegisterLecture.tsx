import React from "react";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css"; // Import CSS của react-quill-new
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

type TextAreaRegisterLectureProps = {
  labelText: string;
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
      className={`flex flex-col h-auto  w-full gap-1.5 ${className} font-sans font-normal text-black70 dark:text-AntiFlashWhite`}
    >
      <Label htmlFor={name}>{labelText}</Label>
      <ReactQuill
        // theme="snow"
        className="max-h-[500px] overflow-auto"
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
            [{ size: ["small", false, "large", "huge"] }],

            // Text styling
            ["bold", "italic", "underline", "strike", "blockquote"],

            // Text color & background
            [{ color: [] }, { background: [] }],

            // Text alignment
            [{ align: ["", "center", "right", "justify"] }],

            // Lists & Indentation
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],

            // Links & Media
            ["link", "image", "video"],

            // Code & Formula
            ["code-block", "formula"],

            // Subscript & Superscript
            [{ script: "sub" }, { script: "super" }],

            // Clean formatting
            ["clean"],
          ],
        }}
        formats={[
          // Headings
          "header",

          // Font styles
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",

          // Text alignment & color
          "align",
          "color",
          "background",

          // Paragraphs & Lists
          "blockquote",
          "list",
          "bullet",
          "indent",

          // Links & Media
          "link",
          "image",
          "video",

          // Advanced formatting
          "code-block",
          "formula",
          "script",

          // Clean
          "clean",
        ]}
      />
      {error && (
        <div className="mt-10 text-[12px] font-sans font-normal text-redPigment">
          {error}
        </div>
      )}
    </div>
  );
};

export default TextAreaRegisterLecture;

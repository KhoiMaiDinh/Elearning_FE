import React from "react";
import { Label } from "@/components/ui/label";
import ReactQuill from "react-quill-new"; // Sử dụng react-quill-new thay vì react-quill
import "react-quill-new/dist/quill.snow.css"; // Import CSS của react-quill-new
import { Delta } from "quill";

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
        value={value}
        onChange={(content) => onChange?.(content)}
        placeholder={placeholder}
        readOnly={disabled}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "link",
          "image",
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

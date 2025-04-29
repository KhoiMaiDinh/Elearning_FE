"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

type InputWithSendButtonProps = {
  labelText: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  disabled?: boolean;
  error?: string;
  name?: string;
};

const InputWithSendButton: React.FC<InputWithSendButtonProps> = ({
  labelText,
  placeholder = "",
  value,
  onChange,
  onSubmit,
  disabled = false,
  error,
  name,
}) => {
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendButtonRef.current?.click();
    }
  };

  const handleClick = () => {
    if (value.trim() === "") return;
    onSubmit();
  };

  return (
    <div className="w-full  flex flex-col gap-1.5 font-sans font-normal text-black70 dark:text-lightSilver">
      <Label htmlFor={name}>{labelText}</Label>

      <div className="flex items-center gap-2">
        <Input
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          ref={sendButtonRef}
          onClick={handleClick}
          disabled={disabled}
          type="button"
          size="sm"
          className="flex items-center text-white justify-center gap-1 px-3 py-2 bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125"
        >
          <Send size={16} />
          Gửi
        </Button>
      </div>

      {error && <div className="text-xs text-red-500">{error}</div>}
    </div>
  );
};

export default InputWithSendButton;

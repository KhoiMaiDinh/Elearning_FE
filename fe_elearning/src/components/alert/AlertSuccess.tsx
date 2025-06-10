import { RocketIcon } from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React from 'react';

type AlertType = {
  description?: string;
};
const AlertSuccess: React.FC<AlertType> = ({ description }) => {
  return (
    <div className="fixed right-4 top-4 z-50 rounded-md border-[2px] bg-white shadow-xl">
      <Alert>
        <RocketIcon color="#7152f3" className="h-4 w-4" />
        <AlertTitle className="font-bold text-PalatinateBlue">Thông báo!</AlertTitle>
        <AlertDescription className="font-medium text-MajorelleBlue">
          {description}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AlertSuccess;

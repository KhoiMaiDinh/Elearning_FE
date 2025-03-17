import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";

type AlertType = {
  description?: string;
};
const AlertSuccess: React.FC<AlertType> = ({ description }) => {
  return (
    <div className="fixed right-4 top-4 z-50 rounded-md bg-white font-sans shadow-xl">
      <Alert>
        <RocketIcon color="#2a435d" className="h-4 w-4" />
        <AlertTitle className="font-bold text-majorelleBlue dark:text-white/80">
          Thông báo!
        </AlertTitle>
        <AlertDescription className="font-medium text-majorelleBlue dark:text-white/80">
          {description}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AlertSuccess;

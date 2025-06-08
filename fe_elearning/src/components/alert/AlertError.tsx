import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AlertType = {
  description?: string;
};
const AlertError: React.FC<AlertType> = ({ description }) => {
  return (
    <div className="fixed right-4 top-4 z-50 rounded-md border-[2px] bg-white shadow-xl">
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle className="font-bold">Lỗi</AlertTitle>
        <AlertDescription className="font-medium">{description}</AlertDescription>
      </Alert>
    </div>
  );
};

export default AlertError;

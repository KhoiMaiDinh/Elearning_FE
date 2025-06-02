import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import React from 'react';

type ProgressBarProps = {
  steps: {
    id: number;
    title: string;
    description: string;
  }[];
  completedSteps: number[];
  currentStep: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, completedSteps, currentStep }) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Steps */}
        <div className="flex justify-center">
          <div className="flex flex-row justify-start w-fit">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-start justify-start w-fit">
                <div className="flex items-center justify-start ">
                  <div className="flex flex-col items-center ">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        completedSteps.includes(step.id)
                          ? 'bg-vividMalachite border-vividMalachite text-white'
                          : currentStep === step.id
                            ? 'border-majorelleBlue text-majorelleBlue'
                            : 'border-gray-300 text-gray-300'
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-semibold">{step.id}</span>
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <div
                        className={`font-medium text-sm ${
                          currentStep === step.id ? 'text-majorelleBlue' : 'text-gray'
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 w-20 mx-4 ${
                        completedSteps.includes(step.id) ? 'bg-vividMalachite' : 'bg-gray'
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressBar;

import {
  Dispatch,
  useCallback,
  useMemo,
  useState,
} from 'react';

interface Helpers {
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  isLastStep: boolean
  isFirstStep: boolean
  setStep: Dispatch<number>,
}

type setStepCallbackType = (step: number | ((step: number) => number)) => void


const useStep = (maxStep: number): [number, Helpers] => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const isLastStep = useMemo(() => currentStep === maxStep, [currentStep, maxStep]);
  const isFirstStep = useMemo(() => currentStep === 1, [currentStep]);

  const nextStep = useCallback(() => {
    if (!isLastStep) {
      setCurrentStep(step => step + 1);
    }
  }, [isLastStep]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(step => step - 1);
    }
  }, [isFirstStep]);

  const reset = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const setStep = useCallback<setStepCallbackType>(
    step => {
      const newStep = step instanceof Function ? step(currentStep) : step;

      if (newStep >= 1 && newStep <= maxStep) {
        setCurrentStep(newStep);
        return;
      }

      throw new Error('步骤无效');
    },
    [maxStep, currentStep],
  );

  return [
    currentStep,
    {
      nextStep,
      prevStep,
      reset,
      setStep,
      isLastStep,
      isFirstStep,
    },
  ];
};
export default useStep;

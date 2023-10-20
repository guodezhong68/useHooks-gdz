import {useEffect, useState} from "react";

// let timeId: NodeJS.Timer | undefined;
const timeIdObject = {
  'timeId': undefined,
};
type useCountDownProps = {
  Max_TIME?: number | false,
  timeOut?: number,
  defaultStart?: boolean,
  defaultEveryChange?: boolean,
  onChange?: () => void,
  onEveryChange?: (time?: number) => void,
  onStartChange?: (time?: number) => void,
  timeId?: string,
}

const useCountDown = (
  {
    Max_TIME = false,
    timeOut = 1000,
    defaultStart = false,
    onChange,
    onEveryChange,
    onStartChange,
    timeId = "timeId",
  }: useCountDownProps) => {
  const [time, setTime] = useState<number>(0);

  const countDown = () => {
    if (onStartChange) {
      onStartChange();
    }
    timeIdObject[timeId] = setInterval(() => {
      setTime(value => value + 1)
    }, timeOut)
  }

  const startTime = (time?: number) => {
    if (time !== undefined) {
      setTime(time);
    }
    if (!timeIdObject[timeId]) {
      countDown();
    }
  }

  const stopTime = () => {
    setTime(0);
    if (timeIdObject[timeId]) {
      clearInterval(timeIdObject[timeId]);
      timeIdObject[timeId] = undefined;
    }
  }

  const pauseTime = () => {
    if (timeIdObject[timeId]) {
      clearInterval(timeIdObject[timeId]);
      timeIdObject[timeId] = undefined;
    }
  }

  useEffect(() => {
    if (defaultStart && !timeIdObject[timeId]) {
      countDown();
    }
    return () => {
      if (timeId) {
        clearInterval(timeIdObject[timeId]);
        timeIdObject[timeId] = undefined;
      }
    };
  }, []);

  useEffect(() => {
    if (time> 0 && onEveryChange) {
      onEveryChange(time);
    }
    if (Max_TIME && time >= Max_TIME) {
      if (onChange) {
        onChange();
      }
      if (timeId) {
        clearInterval(timeIdObject[timeId]);
        timeIdObject[timeId] = undefined;
      }
      setTime(0)
    }
  }, [time])

  return {time, startTime, stopTime, pauseTime};
}
export default useCountDown;

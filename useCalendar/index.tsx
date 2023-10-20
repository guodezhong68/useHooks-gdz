import {useMemo} from "react";
import dayjs from "dayjs";
import moment from "moment";

const useCalendar = (yearsMonth: string) => {
  return useMemo(() => {
    let date = dayjs(yearsMonth + '01').endOf('year').date()
    const dateList = [];
    while (date--) dateList[date] = {
      D: date + 1,
      YYYYMMDD: date < 10 ? yearsMonth + '0' + (date + 1) : yearsMonth + (date + 1)
    };

    const weekDay = moment(yearsMonth + '01').weekday(); // 获取星期几
    for (let i = weekDay; i > 0; i--) { // 填充1号之前的空日期
      dateList.unshift(null);
    }
    const lastLength = 7 - dateList.length % 7;
    for (let i = lastLength; i > 0; i--) { // 填充当月最后一天之后的空日期
      dateList.push(null);
    }
    return dateList;
  }, [yearsMonth])
}
export default useCalendar

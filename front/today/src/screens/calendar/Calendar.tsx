import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AddButton from '../../common/AddButton';

import CalendarBody from '../../components/calendar/CalendarBody';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import { CalendarProp } from '../../types/stack';

function Calendar({ navigation }: CalendarProp) {
  // 일기 생성 페이지로 이동
  function navigateToWrite() {
    navigation.push('SelectEmotion');
  }

  const DATE = new Date();
  const YEAR = DATE.getFullYear();
  const MONTH = DATE.getMonth() + 1;
  const DAY = DATE.getDate();
  const today = { year: YEAR, month: MONTH, date: DAY };

  const [month, setMonth] = useState(MONTH);
  const [year, setYear] = useState(YEAR);
  const [date] = useState(DAY);

  const moveToNextMonth = (month: number) => {
    if (month === 12) {
      setYear(previousYear => previousYear + 1);
      setMonth(1);
    } else {
      setMonth(previouMonth => previouMonth + 1);
    }
  };

  const moveToPreviousMonth = (month: number) => {
    if (month === 1) {
      setYear(previousYear => previousYear - 1);
      setMonth(12);
    } else {
      setMonth(previousMonth => previousMonth - 1);
    }
  };

  const moveToSpecificYearAndMonth = (year: number, month: number) => {
    setYear(year);
    setMonth(month);
  };

  return (
    <View style={styles.calendarContainer}>
      <AddButton onPress={navigateToWrite} />
      <CalendarHeader
        month={month}
        year={year}
        date={date}
        today={{ month: new Date().getMonth() + 1, year: new Date().getFullYear(), date: new Date().getDate() }}
        moveToNextMonth={moveToNextMonth}
        moveToPreviousMonth={moveToPreviousMonth}
        moveToSpecificYearAndMonth={moveToSpecificYearAndMonth}
      />
      <CalendarBody
        month={month}
        year={year}
        date={date}
        today={today}
        moveToNextMonth={moveToNextMonth}
        moveToPreviousMonth={moveToPreviousMonth}
        moveToSpecificYearAndMonth={moveToSpecificYearAndMonth}
      />
    </View>
  );
}

export default Calendar;

const styles = StyleSheet.create({
  calendarContainer: {
    margin: 10,
    // backgroundColor: 'white',
  },
});

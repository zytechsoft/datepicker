import * as React from 'react'
import { Grid, useMultiStyleConfig } from '@chakra-ui/react'
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWeekend,
  startOfMonth,
} from './dayjs-fns'
import type { CalendarMonthStyles } from './types'
import { CalendarContext } from './context'
import { Day } from './day'
import { MonthContext } from './month'

export function CalendarDays() {
  const styles = useMultiStyleConfig('CalendarMonth', {}) as CalendarMonthStyles
  const {
    dates,
    onSelectDates,
    startSelectedDate,
    endSelectedDate,
    disableDates,
    disableDatesBeforeDate,
    disableDatesAfterDate,
    disableFutureDates,
    disablePastDates,
    disableWeekends,
    highlightToday,
  } = React.useContext(CalendarContext)
  const { month } = React.useContext(MonthContext)

  return (
    <Grid sx={styles.days}>
      {dates[Number(month)].days.map((day, index) => {
        if (!day) {
          return <span key={`not-a-day-${index}`} />
        }

        let variant: 'selected' | 'range' | 'outside' | 'today' | undefined

        const isSelected =
          (startSelectedDate && isSameDay(day, startSelectedDate)) ||
          (endSelectedDate && isSameDay(day, endSelectedDate))

        if (isSelected) {
          variant = 'selected'
        }

        if (
          (isBefore(day, startOfMonth(dates[Number(month)].startDateOfMonth)) ||
            isAfter(day, endOfMonth(dates[Number(month)].startDateOfMonth))) &&
          !isSelected
        ) {
          variant = 'outside'
        }

        if (highlightToday && isSameDay(new Date(), day)) {
          variant = 'today'
        }

        const interval =
          startSelectedDate &&
          endSelectedDate &&
          eachDayOfInterval({
            start: startSelectedDate,
            end: endSelectedDate,
          })

        const isInRange = interval
          ? interval.some(date => isSameDay(day, date))
          : false

        if (isInRange && !isSelected) {
          variant = 'range'
        }

        const isDisabled =
          (disableDatesBeforeDate && isBefore(day, disableDatesBeforeDate)) ||
          (disableDatesAfterDate && isAfter(day, disableDatesAfterDate)) ||
          (disablePastDates && isBefore(day, new Date())) ||
          (disableFutureDates && isAfter(day, new Date())) ||
          (disableWeekends && isWeekend(day)) ||
          (disableDates && disableDates.some(date => isSameDay(day, date)))

        if (isDisabled) {
          variant = undefined;
        }

        return (
          <Day
            variant={variant}
            day={day}
            key={format(day, 'd-M')}
            disabled={isDisabled}
            onSelectDate={onSelectDates}
          />
        )
      })}
    </Grid>
  )
}

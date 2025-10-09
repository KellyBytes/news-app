import { useState } from 'react';

const Calendar = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsOfYear = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const currentDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? prevYear + 1 : prevYear
    );
  };

  return (
    <div className="calendar w-full lg:w-60 xl:w-72 2xl:w-94 h-full lg:h-[calc(55%-1rem)] p-4 flex flex-col justify-center xl:gap-y-2 2xl:gap-y-4 bg-zinc-900 rounded-xl">
      <div className="navigate-date w-full flex items-center justify-between gap-x-1">
        <h2 className="month text-sm xl:text-base 2xl:text-lg font-light text-neutral-300">
          {monthsOfYear[currentMonth]},
        </h2>
        <h2 className="year text-sm xl:text-base 2xl:text-lg font-light text-neutral-300">
          {currentYear}
        </h2>
        <div className="buttons flex gap-x-2 ml-auto">
          <div
            className="w-8 h-8 flex justify-center items-center bg-gray-800 rounded-[50%]"
            onClick={prevMonth}
          >
            <i className="bx bx-chevron-left text-base xl:text-lg 2xl:text-xl text-purple-400 cursor-pointer"></i>
          </div>
          <div
            className="w-8 h-8 flex justify-center items-center bg-gray-800 rounded-[50%]"
            onClick={nextMonth}
          >
            <i className="bx bx-chevron-right text-base xl:text-lg 2xl:text-xl text-purple-400 cursor-pointer"></i>
          </div>
        </div>
      </div>
      <div className="weekdays w-full flex mx-0 mt-2 mb-1">
        {daysOfWeek.map((day) => (
          <span
            key={day}
            className="w-[calc(100%/7)] flex justify-center font-light uppercase text-xs xl:text-base 2xl:text-lg text-gray-500"
          >
            {day}
          </span>
        ))}
      </div>
      <div className="days flex flex-wrap w-full">
        {[...Array(firstDayOfMonth).keys()].map((_, index) => (
          <span
            key={`empty-${index}`}
            className="w-[calc(100%/7)] aspect-square text-neutral-200 flex justify-center items-center cursor-pointer"
          ></span>
        ))}
        {[...Array(daysInMonth).keys()].map((day) => (
          <span
            key={day + 1}
            className={`w-[calc(100%/7)] aspect-square flex justify-center items-center cursor-pointer ${
              day + 1 === currentDate.getDate() &&
              currentMonth === currentDate.getMonth() &&
              currentYear === currentDate.getFullYear()
                ? 'text-xs xl:text-sm 2xl:text-base text-neutral-50 bg-linear-to-r from-purple-400 to-indigo-500 rounded-[50%]'
                : 'text-xs xl:text-sm 2xl:text-base text-neutral-200'
            }`}
          >
            {day + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

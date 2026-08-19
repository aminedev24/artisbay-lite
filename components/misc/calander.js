import React, { useState, useEffect, useCallback } from "react";

export default function Calander() {
  const [dayNames] = useState(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const [calendarDays, setCalendarDays] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth()); // Current month (0-11)
  const [year, setYear] = useState(new Date().getFullYear()); // Current year
  const today = new Date(); // Today's date

   const generateCalendar =useCallback( () => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun, 6 = Sat
    const totalDays = new Date(year, month + 1, 0).getDate(); // Get last day of month

    let daysArray = Array(firstDay).fill(null); // Empty slots before first day
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(i);
    }

    setCalendarDays(daysArray);
  },[]);

  useEffect(() => {
    generateCalendar();
  }, [month, year, generateCalendar]); // Update when month or year changes

 

  // Handle Previous & Next Month Navigation
  const changeMonth = (step) => {
    let newMonth = month + step;
    let newYear = year;

    if (newMonth < 0) {
      newMonth = 11; // December of previous year
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0; // January of next year
      newYear += 1;
    }

    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div className="calendar">
      <h2>
        {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
      </h2>
      <div className="controls">
        <button onClick={() => changeMonth(-1)}>⬅ Previous</button>
        <button onClick={() => changeMonth(1)}>Next ➡</button>
      </div>
      <table border="1">
        <thead>
          <tr>
            {dayNames.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {dayNames.map((_, colIndex) => {
                const dayIndex = rowIndex * 7 + colIndex;
                const day = calendarDays[dayIndex];

                return (
                  <td
                    key={colIndex}
                    className={
                      day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear()
                        ? "highlight"
                        : day === 1 && month === 5 // March is index 2 (0 = Jan)
                        ? "red"
                        : ""
                    }
                  >
                    {day || ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/*<p className="public-holiday">Golden Week Holidays 2025 1 to 8 May</p>*/}
    </div>
  );
}

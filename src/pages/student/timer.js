
import React, { useState, useEffect } from 'react';

function Timer({ time }) {
  const [hours, setHours] = useState(Math.floor(time / 60));
  const [minutes, setMinutes] = useState(time % 60);
  const [seconds, setSeconds] = useState(0);


  useEffect(() => {
    console.log("time from timer", time)
    console.log("hours", Math.floor(time / 60))
    console.log("minutes", Math.floor(time % 60))
    console.log("seconds", 0)
    const timer = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0 && hours === 0) {
          clearInterval(timer);
          // Timer has reached 0
        } else if (minutes === 0) {
          setHours(prevHours => prevHours - 1);
          setMinutes(59);
          setSeconds(59);
        } else {
          setMinutes(prevMinutes => prevMinutes - 1);
          setSeconds(59);
        }
      } else {
        setSeconds(prevSeconds => prevSeconds - 1);
      }
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [hours, minutes, seconds]);

  // Format the timer to display HH:MM:SS
  const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  return (
    <div className='fw-bolder p-1 text-success'>
      {formattedTime}
    </div>
  );
}

export default Timer;

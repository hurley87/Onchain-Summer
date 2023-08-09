import { useEffect, useState } from 'react';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState('');

  const calculateTimeLeft = () => {
    const targetDate: any = new Date('August 31, 2023 15:00:00 EST').getTime();
    const now: any = new Date().getTime();
    const difference = targetDate - now;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${days.toString().padStart(2, '0')}D ${hours
      .toString()
      .padStart(2, '0')}H : ${minutes.toString().padStart(2, '0')}M : ${seconds
      .toString()
      .padStart(2, '0')}S`;
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center flex-row text-[#0052ff] text-[14px]">
      {timeLeft}
    </div>
  );
};

export default Countdown;

import { useEffect, useState } from 'react';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <header className='bg-primary text-primary-foreground shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-4'>
            <div className='w-8 h-8 bg-accent rounded-lg flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                ></path>
              </svg>
            </div>
            <h1 className='font-space-grotesk font-bold text-xl'>Hệ thống Quản lý Xếp hàng</h1>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='text-sm'>
              <span className='text-gray-300'>Thời gian:</span>
              <span className='font-semibold ml-1'>{currentTime.toLocaleTimeString('vi-VN')}</span>
            </div>
            <div className='w-3 h-3 bg-green-400 rounded-full pulse-animation'></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

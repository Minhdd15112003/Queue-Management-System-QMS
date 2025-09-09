interface StatisticsProps {
  statistics: {
    totalWaiting: number;
    averageWaitTime: string;
    servedToday: number;
    activeCounters: string;
  };
}

const Statistics = ({ statistics }: StatisticsProps) => {
  const stats = [
    {
      label: 'Tổng số chờ',
      value: statistics.totalWaiting,
      icon: (
        <svg
          className='w-6 h-6 text-blue-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
          ></path>
        </svg>
      ),
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Thời gian chờ TB',
      value: statistics.averageWaitTime,
      icon: (
        <svg
          className='w-6 h-6 text-yellow-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
          ></path>
        </svg>
      ),
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Đã phục vụ hôm nay',
      value: statistics.servedToday,
      icon: (
        <svg
          className='w-6 h-6 text-green-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
          ></path>
        </svg>
      ),
      bgColor: 'bg-green-100',
    },
    {
      label: 'Quầy hoạt động',
      value: statistics.activeCounters,
      icon: (
        <svg
          className='w-6 h-6 text-purple-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
          ></path>
        </svg>
      ),
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      {stats.map((stat, index) => (
        <div key={index} className='bg-card rounded-xl shadow-md p-6 border border-border'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>{stat.label}</p>
              <p className='text-3xl font-space-grotesk font-bold text-card-foreground'>
                {stat.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;

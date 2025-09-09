import { QueueStatus } from '../shared';

interface CurrentNumberProps {
  currentNumber: number;
  queueStatus: QueueStatus;
}

const CurrentNumber = ({ currentNumber, queueStatus }: CurrentNumberProps) => {
  const getStatusDisplay = () => {
    switch (queueStatus) {
      case QueueStatus.SERVING:
        return { text: 'Đang phục vụ', className: 'status-active' };
      case QueueStatus.SKIP:
        return { text: 'Bỏ qua', className: 'status-skip' };
      case QueueStatus.WAITING:
        return { text: 'Chờ đợi', className: 'status-waiting' };
      default:
        return { text: 'Đang phục vụ', className: 'status-active' };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className='mb-8'>
      <div className='bg-card rounded-2xl shadow-lg p-8 text-center border border-border'>
        <h2 className='font-space-grotesk font-semibold text-lg text-muted-foreground mb-4'>
          Số thứ tự hiện tại
        </h2>
        <div className='text-8xl font-space-grotesk font-bold text-accent mb-4'>
          {currentNumber}
        </div>
        <div className='flex items-center justify-center space-x-4'>
          <span
            className={`px-4 py-2 text-white rounded-full text-sm font-medium ${status.className}`}
          >
            {status.text}
          </span>
          <span className='text-muted-foreground'>Quầy số 1</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentNumber;

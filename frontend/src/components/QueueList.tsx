import { QueueStatus } from '../shared';

interface QueueListProps {
  queueList: any[];
  message?: string;
  loading?: boolean;
}

const QueueList = ({ queueList, message, loading }: QueueListProps) => {
  const getHeaders = () => {
    if (queueList.length === 0) return [];
    return Object.keys(queueList[0]).filter(
      (key) => !['id', 'time', 'counter', 'status'].includes(key),
    );
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Có' : 'Không';
    if (typeof value === 'number') return value.toLocaleString('vi-VN');
    if (typeof value === 'object') return JSON.stringify(value);

    const stringValue = String(value);
    // Truncate nếu quá dài
    return stringValue.length > 50 ? `${stringValue.substring(0, 47)}...` : stringValue;
  };

  const getDisplayName = (header: string): string => {
    return header
      .replace(/([A-Z])/g, ' $1') // Thêm space trước chữ hoa
      .replace(/^./, (str) => str.toUpperCase()) // Viết hoa chữ cái đầu
      .trim();
  };

  const getQueueItemStyle = (status: QueueStatus) => {
    switch (status) {
      case QueueStatus.SERVING:
        return {
          containerClass: 'bg-green-50 border-green-200',
          numberClass: 'bg-green-500',
          statusText: 'Đang phục vụ',
          statusClass: 'bg-green-100 text-green-800',
        };
      case QueueStatus.SKIP:
        return {
          containerClass: 'bg-red-50 border-red-200',
          numberClass: 'bg-red-500',
          statusText: 'Bỏ qua',
          statusClass: 'bg-red-100 text-red-800',
        };
      case QueueStatus.COMPLETED:
        return {
          containerClass: 'bg-blue-50 border-blue-200',
          numberClass: 'bg-blue-500',
          statusText: 'Đã hoàn thành',
          statusClass: 'bg-blue-100 text-blue-800',
        };

      default:
        return {
          containerClass: 'bg-gray-50 border-gray-200',
          numberClass: 'bg-gray-500',
          statusText: 'Chờ đợi',
          statusClass: 'bg-gray-100 text-gray-800',
        };
    }
  };

  return (
    <div className='lg:col-span-2'>
      <div className='bg-card rounded-xl shadow-md border border-border'>
        <div className='p-6 border-b border-border'>
          <div className='flex items-center justify-between'>
            <h3 className='font-space-grotesk font-semibold text-lg text-card-foreground'>
              Danh sách hàng đợi
            </h3>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-muted-foreground'>Tự động cập nhật</span>
              <div className='w-2 h-2 bg-green-400 rounded-full pulse-animation'></div>
            </div>
          </div>
        </div>

        <div className='p-6'>
          {/* Message */}
          {message && (
            <div
              className={`
              mt-4 p-3 rounded-lg text-sm
              ${
                message.includes('thành công')
                  ? 'bg-green-100 text-green-700'
                  : message.includes('Lỗi')
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              }
            `}
            >
              {message}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className='mt-4 flex items-center text-blue-600'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2'></div>
              Đang xử lý...
            </div>
          )}

          {/* Queue Items */}
          <div className='space-y-3 max-h-96 overflow-y-auto'>
            {queueList.map((item) => {
              const style = getQueueItemStyle(item.status);
              const headers = getHeaders();

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${style.containerClass}`}
                >
                  <div className='flex items-center space-x-4'>
                    <div
                      className={`w-12 h-12 ${style.numberClass} text-white rounded-lg flex items-center justify-center font-space-grotesk font-bold`}
                    >
                      {item.id}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='mb-1'>
                        <span className='text-gray-800 font-medium text-sm'>
                          {style.statusText}
                        </span>
                      </div>

                      {headers.length > 0 && (
                        <div className='space-y-1'>
                          {headers.map((header, index) => (
                            <div key={header} className='flex items-start space-x-2 text-sm'>
                              <span className='text-gray-500 font-medium min-w-0 flex-shrink-0'>
                                {getDisplayName(header)}:
                              </span>
                              <span className='text-gray-800 font-bold  min-w-0 flex-1'>
                                {formatValue(item[header])}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className='text-sm text-gray-600 mt-2'>
                        {item.counter ? `Quầy ${item.counter}` : 'Chờ'} • {item.time}
                      </p>
                    </div>
                  </div>
                  <div className='flex-shrink-0 ml-4'>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${style.statusClass}`}
                    >
                      {style.statusText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueList;

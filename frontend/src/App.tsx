import './assets/css/App.css';
import { ImportExcel, GetCurrentData } from '../wailsjs/go/main/App';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import CurrentNumber from './components/CurrentNumber';
import Statistics from './components/Statistics';
import ControlPanel from './components/ControlPanel';
import QueueList from './components/QueueList';
import { QueueStatus } from './shared';

function App() {
  const [excelData, setExcelData] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [statistics, setStatistics] = useState({
    totalWaiting: 0,
    averageWaitTime: '10m',
    servedToday: 0,
    activeCounters: '0/0',
  });

  const [currentItem, setCurrentItem] = useState<{
    currentNumber: number;
    queueStatus: QueueStatus;
  }>({
    currentNumber: 0,
    queueStatus: QueueStatus.WAITING,
  });

  // Load data hiện tại khi app khởi động
  useEffect(() => {
    loadCurrentData();
  }, []);

  // Load dữ liệu hiện tại từ app
  const loadCurrentData = async () => {
    try {
      const result = await GetCurrentData();
      if (result && result.data && result.data.length > 0) {
        const currentNumberItem = result.data.find((item) => item.status === QueueStatus.SERVING);
        setCurrentItem({
          currentNumber: currentNumberItem ? currentNumberItem.id : 0,
          queueStatus: currentNumberItem ? currentNumberItem.status : QueueStatus.WAITING,
        });

        setStatistics({
          activeCounters: result.counter,
          servedToday: result.data.filter((item) => item.status === QueueStatus.COMPLETED).length,
          totalWaiting: result.data.filter((item) => item.status === QueueStatus.WAITING).length,
          averageWaitTime: '10m', // Tính toán thời gian chờ trung bình nếu cần
        });
        console.log(result.data);
        setExcelData(result.data);
      }
    } catch (error) {
      console.log('Error loading current data:', error);
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setMessage('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      return;
    }

    setLoading(true);
    setMessage('Đang import file...');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          const uint8Array = new Uint8Array(arrayBuffer);
          const base64String = btoa(String.fromCharCode(...uint8Array));

          // Gọi hàm Go để import
          const result = await ImportExcel(base64String, file.name);
          console.log(result);
          if (result.success) {
            setExcelData(result.data || []);
            setMessage(`Import thành công! ${result.data?.length} dòng dữ liệu.`);
          } else {
            setMessage('Import thất bại: ' + result.error);
          }
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      setMessage('Lỗi khi import file: ' + error);
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 10000);
    }
  };

  // const handleNextNumber = () => {
  //   const nextIndex = excelData.findIndex((item: any) => item.status === 'next');
  //   if (nextIndex !== -1) {
  //     const newQueueList = [...excelData];
  //     const currentIndex = excelData.findIndex((item: any) => item.status === 'serving');

  //     // Mark current as completed and remove
  //     if (currentIndex !== -1) {
  //       newQueueList.splice(currentIndex, 1);
  //     }

  //     // Move next to serving
  //     const adjustedNextIndex =
  //       currentIndex !== -1 && currentIndex < nextIndex ? nextIndex - 1 : nextIndex;
  //     if (adjustedNextIndex < newQueueList.length) {
  //       newQueueList[adjustedNextIndex].status = QueueStatus.SERVING;
  //       newQueueList[adjustedNextIndex].counter = 1;
  //       setCurrentNumber(newQueueList[adjustedNextIndex].id);
  //     }

  //     // Set new next if available
  //     if (adjustedNextIndex + 1 < newQueueList.length) {
  //       newQueueList[adjustedNextIndex + 1].status = QueueStatus.NEXT;
  //     }

  //     setExcelData(newQueueList);
  //     setStatistics((prev) => ({
  //       ...prev,
  //       totalWaiting: prev.totalWaiting - 1,
  //       servedToday: prev.servedToday + 1,
  //     }));
  //   }
  // };

  // const handleBackNumber = () => {};

  // const handleRecallCurrent = () => {
  //   // Logic for recalling current number
  //   console.log('Recalling current number:', currentNumber);
  // };

  // const handlePauseQueue = () => {
  //   setQueueStatus(queueStatus === QueueStatus.PAUSED ? QueueStatus.SERVING : QueueStatus.PAUSED);
  // };

  return (
    <>
      {/* <!-- Header --> */}
      <div className='bg-background text-foreground font-dm-sans min-h-screen'>
        <Header />

        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <Statistics statistics={statistics} />
          <CurrentNumber
            currentNumber={currentItem?.currentNumber}
            queueStatus={currentItem?.queueStatus}
          />

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <ControlPanel
              // onNextNumber={handleNextNumber}
              // onBackNumber={handleBackNumber}
              // onRecallCurrent={handleRecallCurrent}
              // onPauseQueue={handlePauseQueue}
              // onAddNew={handleAddNew}
              queueStatus={currentItem?.queueStatus}
              handleExportExcel={handleImportExcel}
            />

            <QueueList queueList={excelData} message={message} loading={loading} />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;

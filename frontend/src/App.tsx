import './assets/css/App.css';
import {
  ImportExcel,
  GetCurrentData,
  NextQueue,
  SpeakVietnamese,
  BackQueue,
  ReCallQueue,
  SkipQueue,
} from '../wailsjs/go/main/App';
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
        const currentNumberItem = result.data.find(
          (item: any) => item.status === QueueStatus.SERVING,
        );
        setCurrentItem({
          currentNumber: currentNumberItem ? currentNumberItem.id : 0,
          queueStatus: currentNumberItem ? currentNumberItem.status : QueueStatus.WAITING,
        });

        setStatistics({
          activeCounters: result.counter,
          servedToday: result.data.filter((item: any) => item.status === QueueStatus.COMPLETED)
            .length,
          totalWaiting: result.data.filter((item: any) => item.status === QueueStatus.WAITING)
            .length,
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

  const handleNextNumber = () => {
    if (excelData.length === 0) {
      setMessage('Danh sách trống. Vui lòng import file Excel trước.');
      return;
    }
    const index = excelData.findIndex((item) => item.status === QueueStatus.SERVING);
    NextQueue(index)
      .then((res) => {
        loadCurrentData();
        SpeakVietnamese(res.message || 'Số tiếp theo, xin mời quý khách.');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBackNumber = () => {
    if (excelData.length === 0) {
      setMessage('Danh sách trống. Vui lòng import file Excel trước.');
      return;
    }
    const index = excelData.findIndex((item) => item.status === QueueStatus.SERVING);
    BackQueue(index)
      .then((res) => {
        loadCurrentData();
        SpeakVietnamese(res.message || 'Số trước đó, xin mời quý khách.');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRecallCurrent = () => {
    const index = excelData.findIndex((item) => item.status === QueueStatus.SERVING);
    ReCallQueue(index).then((res) => {
      SpeakVietnamese(res.message || 'Xin mời quý khách.');
    });
  };

  const handleSkipCurrent = () => {
    if (excelData.length === 0) {
      setMessage('Danh sách trống. Vui lòng import file Excel trước.');
      return;
    }
    const index = excelData.findIndex((item) => item.status === QueueStatus.SERVING);
    SkipQueue(index).then((res) => {
      loadCurrentData();
      SpeakVietnamese(res.message || 'Số tiếp theo, xin mời quý khách.');
    });
  };

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
              onNextCurrent={handleNextNumber}
              onBackCurrent={handleBackNumber}
              onRecallCurrent={handleRecallCurrent}
              loading={loading}
              onSkipCurrent={handleSkipCurrent}
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

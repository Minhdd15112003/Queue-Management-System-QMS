import { useRef } from 'react';
import { QueueStatus } from '../shared';
import { useSpeech } from 'react-text-to-speech';
import { SpeakVietnamese } from '../../wailsjs/go/main/App';

type ControlPanelProps = {
  onNextCurrent?: () => void;
  onBackCurrent?: () => void;
  onRecallCurrent?: () => void;
  onSkipCurrent?: () => void;
  onPauseCurrent?: () => void;
  handleExportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
};

const ControlPanel = ({
  onNextCurrent,
  onBackCurrent,
  onRecallCurrent,
  onSkipCurrent,
  handleExportExcel,
  loading,
}: ControlPanelProps) => {
  return (
    <div className='lg:col-span-1'>
      <div className='bg-card rounded-xl shadow-md p-6 border border-border'>
        <h3 className='font-space-grotesk font-semibold text-lg text-card-foreground mb-6'>
          Bảng điều khiển
        </h3>

        <div className='space-y-4'>
          <button
            onClick={onNextCurrent}
            className='w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <span>Gọi số tiếp theo</span>
          </button>

          <button
            onClick={onBackCurrent}
            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M11 15l-3-3m0 0l3-3m-3 3h8m-13 0a9 9 0 1118 0 9 9 0 01-18 0z'
              ></path>
            </svg>
            <span>Gọi số lại số trước đó</span>
          </button>

          <button
            onClick={onRecallCurrent}
            className='w-full bg-primary hover:bg-gray-800 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              ></path>
            </svg>
            <span>Gọi lại số hiện tại</span>
          </button>

          <button
            onClick={onSkipCurrent}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2
              bg-red-500 hover:bg-red-600 text-white `}
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 4l10 8-10 8V4zM19 5v14'
              ></path>
            </svg>
            <span>Bỏ qua</span>
          </button>

          {/* 
          <button
            onClick={onAddNew}
            className='w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              ></path>
            </svg>
            <span>Thêm số mới</span>
          </button> */}
        </div>

        <div className='mt-8 pt-6 border-t border-border'>
          <h4 className='font-semibold text-card-foreground mb-4'>Thao tác nhanh</h4>
          <div className='grid grid-cols-2 gap-3'>
            <button className='bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200'>
              Cài đặt
            </button>
            <label className='bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer inline-block text-center'>
              Nhập Excel
              <input
                type='file'
                accept='.xlsx,.xls'
                onChange={(e) => {
                  handleExportExcel(e);
                }}
                className='hidden'
                disabled={loading}
              />
            </label>
            <button className='bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200'>
              Xuất Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

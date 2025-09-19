// app/pfc-dashboard/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  fetchPFCDashboard, 
  calculatePFCRatio, 
  evaluatePFCBalance 
} from '@/app/services/pfcService';
import { 
  DailyPFCData, 
  MonthlyPFCData, 
  PFCDashboardResponse 
} from '@/app/types';

// チャート用のコンポーネント（簡易版）
const PFCChart = ({ protein, fat, carbs }: { protein: number; fat: number; carbs: number }) => {
  const { proteinRatio, fatRatio, carbsRatio } = calculatePFCRatio(protein, fat, carbs);
  
  return (
    <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="bg-red-400" 
        style={{ width: `${proteinRatio}%` }}
        title={`タンパク質: ${proteinRatio}%`}
      ></div>
      <div 
        className="bg-yellow-400" 
        style={{ width: `${fatRatio}%` }}
        title={`脂質: ${fatRatio}%`}
      ></div>
      <div 
        className="bg-blue-400" 
        style={{ width: `${carbsRatio}%` }}
        title={`炭水化物: ${carbsRatio}%`}
      ></div>
    </div>
  );
};

const PFCLegend = () => (
  <div className="flex justify-center space-x-4 text-sm">
    <div className="flex items-center">
      <div className="w-3 h-3 bg-red-400 rounded mr-1"></div>
      <span>タンパク質</span>
    </div>
    <div className="flex items-center">
      <div className="w-3 h-3 bg-yellow-400 rounded mr-1"></div>
      <span>脂質</span>
    </div>
    <div className="flex items-center">
      <div className="w-3 h-3 bg-blue-400 rounded mr-1"></div>
      <span>炭水化物</span>
    </div>
  </div>
);

// 円グラフコンポーネント
const PFCPieChart = ({ protein, fat, carbs }: { protein: number; fat: number; carbs: number }) => {
  const { proteinRatio, fatRatio, carbsRatio } = calculatePFCRatio(protein, fat, carbs);
  
  const total = protein + fat + carbs;
  if (total === 0) {
    return (
      <div className="flex items-center justify-center w-48 h-48 rounded-full bg-gray-100">
        <span className="text-gray-500">データなし</span>
      </div>
    );
  }

  // 円グラフのセグメント作成
  let cumulativePercentage = 0;
  const segments = [
    { label: 'タンパク質', value: protein, percentage: proteinRatio, color: '#f87171' }, // red-400
    { label: '脂質', value: fat, percentage: fatRatio, color: '#facc15' }, // yellow-400
    { label: '炭水化物', value: carbs, percentage: carbsRatio, color: '#60a5fa' } // blue-400
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 42 42" className="w-full h-full">
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          {segments.map((segment, index) => {
            if (segment.percentage === 0) return null;
            
            const strokeDasharray = `${segment.percentage} ${100 - segment.percentage}`;
            const strokeDashoffset = -cumulativePercentage;
            const rotation = cumulativePercentage * 3.6; // 3.6度 per percentage point
            
            const result = (
              <circle
                key={index}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={segment.color}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 21 21) rotate(${rotation} 21 21)`}
              />
            );
            
            cumulativePercentage += segment.percentage;
            return result;
          })}
        </svg>
        
        {/* 中央の統計情報 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold text-gray-900">{total.toFixed(0)}g</div>
          <div className="text-xs text-gray-500">総PFC</div>
        </div>
      </div>
      
      {/* 凡例 */}
      <div className="ml-6 space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: segment.color }}
            ></div>
            <span className="text-gray-700">{segment.label}</span>
            <span className="font-medium text-gray-900">{segment.value.toFixed(1)}g</span>
            <span className="text-gray-500">({segment.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ページネーションコンポーネント
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  totalItems: number;
}) => {
  const getVisiblePageNumbers = () => {
    const delta = 2; // 現在のページの前後に表示するページ数
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-lg">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          前へ
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          次へ
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> 件目
            (全 <span className="font-medium">{totalItems}</span> 件)
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">表示件数:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={5}>5件</option>
              <option value={10}>10件</option>
              <option value={20}>20件</option>
              <option value={50}>50件</option>
            </select>
          </div>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            
            {getVisiblePageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`dots-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default function PFCDashboardPage() {
  const [viewType, setViewType] = useState<'daily' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<PFCDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // ページネーション関連の状態
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  
  // 月別表示用の状態
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  // 初期日付設定
  useEffect(() => {
    const today = new Date();
    
    if (viewType === 'daily') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      setEndDate(today.toISOString().split('T')[0]);
      setStartDate(oneWeekAgo.toISOString().split('T')[0]);
    } else {
      // 月別表示の場合は今月から過去3ヶ月
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      setEndDate(today.toISOString().split('T')[0]);
      setStartDate(threeMonthsAgo.toISOString().split('T')[0]);
      
      // 現在の月を設定
      const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      setCurrentMonth(currentMonthKey);
    }
  }, [viewType]);

  // スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      setShowScrollTop(scrollTop > 300); // 300px以上スクロールしたら表示
    };

    // 初回チェック
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ページネーション関数
  const paginateData = <T,>(data: T[]): { paginatedData: T[]; totalPages: number } => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return { paginatedData, totalPages };
  };

  // ページ変更時の処理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ページトップにスムーススクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ページサイズ変更時の処理
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // ページを1にリセット
  };

  // トップへスクロール
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 月別表示のナビゲーション
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (availableMonths.length === 0) return;
    
    const currentIndex = availableMonths.findIndex(month => month === currentMonth);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = Math.min(currentIndex + 1, availableMonths.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }
    
    setCurrentMonth(availableMonths[newIndex]);
    setCurrentPage(newIndex + 1); // ページ番号は1ベース
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToMonth = (monthKey: string) => {
    const monthIndex = availableMonths.findIndex(month => month === monthKey);
    if (monthIndex !== -1) {
      setCurrentMonth(monthKey);
      setCurrentPage(monthIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPFCDashboard(startDate, endDate, viewType);
      setDashboardData(data);
      
      // 月別表示の場合、利用可能な月のリストを更新
      if (viewType === 'monthly' && data?.data) {
        const months = (data.data as MonthlyPFCData[])
          .map(item => item.month)
          .filter(month => month)
          .sort((a, b) => b.localeCompare(a)); // 新しい月から古い月へ
        setAvailableMonths(months);
        
        // 現在選択中の月が利用可能な月に含まれていない場合、最新の月を選択
        if (months.length > 0 && !months.includes(currentMonth)) {
          setCurrentMonth(months[0]);
          setCurrentPage(1);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'データ取得エラー');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, viewType, currentMonth]);

  // データ取得
  useEffect(() => {
    if (startDate && endDate) {
      loadDashboardData();
      setCurrentPage(1); // データが変わったらページを1にリセット
    }
  }, [startDate, endDate, loadDashboardData]);

  const handleDateRangeChange = (range: 'week' | 'month' | '3months') => {
    const today = new Date();
    const startDate = new Date();
    
    if (viewType === 'daily') {
      // 日別表示の場合
      switch (range) {
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(today.getMonth() - 3);
          break;
      }
    } else {
      // 月別表示の場合は今日から指定期間
      switch (range) {
        case 'week':
        case 'month':
          // 月別の場合は最低3ヶ月のデータを取得
          startDate.setMonth(today.getMonth() - 3);
          break;
        case '3months':
          startDate.setMonth(today.getMonth() - 3);
          break;
      }
      
      // 現在の月を選択
      const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      setCurrentMonth(currentMonthKey);
    }
    
    setStartDate(startDate.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    setCurrentPage(1);
  };

  const renderDailyView = (data: DailyPFCData[]) => {
    const { paginatedData, totalPages } = paginateData(data);
    
    return (
      <div>
        <div className="space-y-4">
          {paginatedData.map((day) => {
            const { proteinRatio, fatRatio, carbsRatio } = calculatePFCRatio(
              day.totalProtein, 
              day.totalFat, 
              day.totalCarbs
            );
            const evaluation = evaluatePFCBalance(proteinRatio, fatRatio, carbsRatio);
            
            // 目標カロリーとの比較
            const calorieGoalRatio = dashboardData?.userInfo?.targetCal 
              ? (day.totalCalories / dashboardData.userInfo.targetCal) * 100 
              : 0;
            const isOverGoal = calorieGoalRatio > 110; // 110%以上で警告
            const isUnderGoal = calorieGoalRatio < 80; // 80%以下で警告
            
            return (
              <div key={day.date} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">📅 {day.date}</h3>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      evaluation.status === 'good' ? 'bg-green-100 text-green-700' :
                      evaluation.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {evaluation.status === 'good' ? '✅ PFC良好' :
                       evaluation.status === 'warning' ? '⚠️ PFC要注意' : '❌ PFC改善必要'}
                    </span>
                    {dashboardData?.userInfo?.targetCal && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isOverGoal ? 'bg-red-100 text-red-700' :
                        isUnderGoal ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        🎯 {calorieGoalRatio.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <PFCChart 
                    protein={day.totalProtein} 
                    fat={day.totalFat} 
                    carbs={day.totalCarbs} 
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xl font-bold text-gray-900">{day.totalCalories.toFixed(0)}</div>
                    <div className="text-sm text-gray-600 font-medium">kcal</div>
                    {dashboardData?.userInfo?.targetCal && (
                      <div className="text-xs text-gray-500 mt-1">
                        目標: {dashboardData.userInfo.targetCal}
                      </div>
                    )}
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-xl">
                    <div className="text-xl font-bold text-red-600">
                      {day.totalProtein.toFixed(1)}g
                    </div>
                    <div className="text-sm text-gray-600 font-medium">タンパク質</div>
                    <div className="text-xs text-red-500 mt-1">{proteinRatio}%</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-xl">
                    <div className="text-xl font-bold text-yellow-600">
                      {day.totalFat.toFixed(1)}g
                    </div>
                    <div className="text-sm text-gray-600 font-medium">脂質</div>
                    <div className="text-xs text-yellow-600 mt-1">{fatRatio}%</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-xl font-bold text-blue-600">
                      {day.totalCarbs.toFixed(1)}g
                    </div>
                    <div className="text-sm text-gray-600 font-medium">炭水化物</div>
                    <div className="text-xs text-blue-500 mt-1">{carbsRatio}%</div>
                  </div>
                </div>
                
                {(evaluation.issues.length > 0 || dashboardData?.userInfo?.targetCal) && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    {evaluation.issues.length > 0 && (
                      <div className="text-sm text-gray-700 mb-2">
                        💡 <span className="font-medium">アドバイス:</span> {evaluation.issues.join('、')}
                      </div>
                    )}
                    
                    {/* 目標達成状況の表示 */}
                    {dashboardData?.userInfo?.targetCal && (
                      <div className="text-sm text-gray-700">
                        {isOverGoal && (
                          <div className="flex items-center text-red-600">
                            <span className="mr-2">⚠️</span>
                            目標カロリーを超過しています。運動量を増やすか摂取量を調整しましょう。
                          </div>
                        )}
                        {isUnderGoal && (
                          <div className="flex items-center text-yellow-600">
                            <span className="mr-2">⚠️</span>
                            目標カロリーに達していません。栄養バランスを保ちながら摂取量を増やしましょう。
                          </div>
                        )}
                        {!isOverGoal && !isUnderGoal && (
                          <div className="flex items-center text-green-600">
                            <span className="mr-2">✅</span>
                            目標カロリー範囲内で理想的です！この調子を維持しましょう。
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* ページネーション */}
        {data.length > itemsPerPage && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={data.length}
            />
          </div>
        )}
      </div>
    );
  };

  const renderMonthlyView = (data: MonthlyPFCData[]) => {
    // 現在選択中の月のデータを取得
    const currentMonthData = data.find(month => month.month === currentMonth);
    
    if (!currentMonthData) {
      return (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-gray-400 text-5xl">�</div>
            <p className="text-gray-600 text-lg">選択した月のデータがありません</p>
            <p className="text-gray-500 text-sm">期間を変更してお試しください</p>
          </div>
        </div>
      );
    }

    const month = currentMonthData;
    const { proteinRatio, fatRatio, carbsRatio } = calculatePFCRatio(
      month.averageProtein, 
      month.averageFat, 
      month.averageCarbs
    );
    
    // 月名を日本語で表示
    const monthKey = month.month || '';
    if (!monthKey.includes('-')) {
      console.error('Invalid month format:', month);
      return null; // 無効なデータをスキップ
    }
    
    const [year, monthNum] = monthKey.split('-');
    const monthName = `${year}年${parseInt(monthNum)}月`;
    
    // 目標カロリーとの比較
    const calorieGoalRatio = dashboardData?.userInfo?.targetCal 
      ? (month.averageCalories / dashboardData.userInfo.targetCal) * 100 
      : 0;
    const isOverGoal = calorieGoalRatio > 110;
    const isUnderGoal = calorieGoalRatio < 80;
    
    const currentIndex = availableMonths.findIndex(m => m === currentMonth);
    const canGoPrev = currentIndex < availableMonths.length - 1;
    const canGoNext = currentIndex > 0;
    
    return (
      <div>
        {/* 月間ナビゲーション */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              disabled={!canGoPrev}
              className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← 前の月
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
              <p className="text-sm text-gray-600">
                {currentIndex + 1} / {availableMonths.length} 月
              </p>
            </div>
            
            <button
              onClick={() => navigateMonth('next')}
              disabled={!canGoNext}
              className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              次の月 →
            </button>
          </div>
          
          {/* 月選択ドロップダウン */}
          <div className="mt-4 flex justify-center">
            <select
              value={currentMonth}
              onChange={(e) => jumpToMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {availableMonths.map((monthKey) => {
                const [year, monthNum] = monthKey.split('-');
                const monthName = `${year}年${parseInt(monthNum)}月`;
                return (
                  <option key={monthKey} value={monthKey}>
                    {monthName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* 月間データ表示 */}
        <div className="space-y-8">
          <div key={month.month} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                {/* ヘッダー */}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">📊 {monthName}</h3>
                  <div className="flex justify-center space-x-4">
                    <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      月間平均データ
                    </span>
                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      記録日数: {month.dayCount}日
                    </span>
                    {dashboardData?.userInfo?.targetCal && (
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        isOverGoal ? 'bg-red-100 text-red-700' :
                        isUnderGoal ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        🎯 目標達成率: {calorieGoalRatio.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                
                {/* メインコンテンツ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* 左側: 円グラフ */}
                  <div className="flex justify-center">
                    <PFCPieChart 
                      protein={month.averageProtein} 
                      fat={month.averageFat} 
                      carbs={month.averageCarbs} 
                    />
                  </div>
                  
                  {/* 右側: 詳細統計 */}
                  <div className="space-y-4">
                    {/* カロリー統計 */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">🔥 カロリー統計</h4>
                        {dashboardData?.userInfo?.targetCal && (
                          <div className="text-sm text-gray-600">
                            目標: {dashboardData.userInfo.targetCal} kcal/日
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {month.averageCalories.toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-600">kcal/日（平均）</div>
                        {dashboardData?.userInfo?.targetCal && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full transition-all duration-500 ${
                                  isOverGoal ? 'bg-red-400' :
                                  isUnderGoal ? 'bg-yellow-400' :
                                  'bg-green-400'
                                }`}
                                style={{ 
                                  width: `${Math.min(calorieGoalRatio, 150)}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* PFC詳細 */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-red-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-red-600 mb-1">
                          {month.averageProtein.toFixed(1)}g
                        </div>
                        <div className="text-xs text-gray-600 font-medium">タンパク質</div>
                        <div className="text-xs text-red-500 mt-1">{proteinRatio}%</div>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600 mb-1">
                          {month.averageFat.toFixed(1)}g
                        </div>
                        <div className="text-xs text-gray-600 font-medium">脂質</div>
                        <div className="text-xs text-yellow-600 mt-1">{fatRatio}%</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {month.averageCarbs.toFixed(1)}g
                        </div>
                        <div className="text-xs text-gray-600 font-medium">炭水化物</div>
                        <div className="text-xs text-blue-500 mt-1">{carbsRatio}%</div>
                      </div>
                    </div>
                    
                    {/* アドバイス */}
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="text-sm text-gray-700">
                        <div className="font-medium mb-2">📊 月間レポート</div>
                        {isOverGoal && (
                          <div className="text-red-600 mb-2">
                            ⚠️ 平均的に目標カロリーを上回っています。運動量を増やすか、食事量を調整することをお勧めします。
                          </div>
                        )}
                        {isUnderGoal && (
                          <div className="text-yellow-600 mb-2">
                            ⚠️ 平均的に目標カロリーに達していません。栄養バランスを保ちながら摂取量を増やしましょう。
                          </div>
                        )}
                        {!isOverGoal && !isUnderGoal && (
                          <div className="text-green-600 mb-2">
                            ✅ この月は目標カロリー範囲内で理想的でした！
                          </div>
                        )}
                        <div className="text-gray-600">
                          この月は{month.dayCount}日間記録され、
                          平均的にタンパク質{proteinRatio}%、脂質{fatRatio}%、炭水化物{carbsRatio}%の割合でした。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PFC Balance Dashboard</h1>
          <p className="text-gray-600">栄養バランスを可視化して健康的な食生活をサポート</p>
        </div>
        
        {/* 凡例 */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <PFCLegend />
        </div>
        
        {/* コントロール */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">表示設定</h2>
          <div className={`grid ${viewType === 'monthly' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'} gap-6`}>
            {/* 表示タイプ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">表示タイプ</label>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value as 'daily' | 'monthly')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="daily">📅 日別表示（詳細データ）</option>
                <option value="monthly">📊 月別表示（円グラフ・月単位）</option>
              </select>
            </div>
            
            {/* 期間選択 - 日別表示の時のみ表示 */}
            {viewType === 'daily' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">期間選択</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDateRangeChange('week')}
                      className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all"
                    >
                      1週間
                    </button>
                    <button
                      onClick={() => handleDateRangeChange('month')}
                      className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all"
                    >
                      1ヶ月
                    </button>
                    <button
                      onClick={() => handleDateRangeChange('3months')}
                      className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all"
                    >
                      3ヶ月
                    </button>
                  </div>
                </div>
                
                {/* カスタム日付 */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">カスタム期間</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">開始日</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">終了日</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* データ表示 */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-gray-600 text-lg">データを読み込み中...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-red-500 text-5xl">⚠️</div>
              <p className="text-red-600 text-lg font-medium">{error}</p>
              <button 
                onClick={loadDashboardData}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
              >
                再試行
              </button>
            </div>
          </div>
        ) : !dashboardData ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-gray-400 text-5xl">📊</div>
              <p className="text-gray-600 text-lg">表示するデータがありません</p>
              <p className="text-gray-500 text-sm">期間を変更してお試しください</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ユーザー情報表示 */}
            {dashboardData?.userInfo && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">👤 ユーザー情報</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {dashboardData.userInfo.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{dashboardData.userInfo.targetCal || 0}</div>
                    <div className="text-sm text-gray-600 font-medium">目標カロリー/日</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      {viewType === 'daily' && dashboardData.summary
                        ? dashboardData.summary.averageCalories.toFixed(0)
                        : viewType === 'monthly' && dashboardData.data && currentMonth
                        ? (() => {
                            const monthlyData = dashboardData.data as MonthlyPFCData[];
                            const currentMonthData = monthlyData.find(m => m.month === currentMonth);
                            return currentMonthData ? currentMonthData.averageCalories.toFixed(0) : '0';
                          })()
                        : '0'
                      }
                    </div>
                    <div className="text-sm text-gray-600 font-medium">平均摂取/日</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className={`text-2xl font-bold ${(() => {
                      let averageCalories = 0;
                      if (viewType === 'daily' && dashboardData.summary) {
                        averageCalories = dashboardData.summary.averageCalories;
                      } else if (viewType === 'monthly' && dashboardData.data && currentMonth) {
                        const monthlyData = dashboardData.data as MonthlyPFCData[];
                        const currentMonthData = monthlyData.find(m => m.month === currentMonth);
                        averageCalories = currentMonthData ? currentMonthData.averageCalories : 0;
                      }
                      
                      if (dashboardData.userInfo.targetCal && averageCalories > 0) {
                        const ratio = averageCalories / dashboardData.userInfo.targetCal;
                        return ratio > 1.1 ? 'text-red-600' : ratio < 0.8 ? 'text-yellow-600' : 'text-green-600';
                      }
                      return 'text-gray-600';
                    })()}`}>
                      {(() => {
                        let averageCalories = 0;
                        if (viewType === 'daily' && dashboardData.summary) {
                          averageCalories = dashboardData.summary.averageCalories;
                        } else if (viewType === 'monthly' && dashboardData.data && currentMonth) {
                          const monthlyData = dashboardData.data as MonthlyPFCData[];
                          const currentMonthData = monthlyData.find(m => m.month === currentMonth);
                          averageCalories = currentMonthData ? currentMonthData.averageCalories : 0;
                        }
                        
                        if (dashboardData.userInfo.targetCal && averageCalories > 0) {
                          return `${((averageCalories / dashboardData.userInfo.targetCal) * 100).toFixed(0)}%`;
                        }
                        return '-%';
                      })()}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">目標達成率</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">
                      {viewType === 'daily' && dashboardData.data 
                        ? (dashboardData.data as DailyPFCData[]).length 
                        : viewType === 'monthly' && dashboardData.data && currentMonth
                        ? (() => {
                            const monthlyData = dashboardData.data as MonthlyPFCData[];
                            const currentMonthData = monthlyData.find(m => m.month === currentMonth);
                            return currentMonthData ? currentMonthData.dayCount : 0;
                          })()
                        : 0}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">記録日数</div>
                  </div>
                </div>
              </div>
            )}

            {/* サマリー（日別表示の場合） */}
            {viewType === 'daily' && dashboardData.summary && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">📈 期間サマリー</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    平均値
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white/70 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-gray-900">{dashboardData.summary.averageCalories.toFixed(0)}</div>
                    <div className="text-sm text-gray-600 font-medium">kcal/日</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <div className="text-2xl font-bold text-red-600">{dashboardData.summary.averageProtein.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600 font-medium">タンパク質/日</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-600">{dashboardData.summary.averageFat.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600 font-medium">脂質/日</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{dashboardData.summary.averageCarbs.toFixed(1)}g</div>
                    <div className="text-sm text-gray-600 font-medium">炭水化物/日</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* メインデータ */}
            {viewType === 'daily' 
              ? renderDailyView(dashboardData.data as DailyPFCData[])
              : renderMonthlyView(dashboardData.data as MonthlyPFCData[])
            }
          </div>
        )}
      </div>
      
      {/* スクロールトップボタン */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="ページトップへ戻る"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

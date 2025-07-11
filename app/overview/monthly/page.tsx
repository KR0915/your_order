// app/overview/monthly/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { fetchDailyConsumption } from '@/app/services/consumptionService';
import { ConsumptionRecord } from '@/app/types';

// 指定年月のカレンダー配列を生成（週始めは日曜日）
function generateCalendar(year: number, month: number): (string | null)[][] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const weeks: (string | null)[][] = [];
  let week: (string | null)[] = Array(firstDay).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

export default function MonthlyOverviewPage() {
  const today = new Date();
  const [yearMonth, setYearMonth] = useState<string>(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  );
  const [calendar, setCalendar] = useState<(string | null)[][]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(today.toISOString().split('T')[0]);
  const [records, setRecords] = useState<ConsumptionRecord[]>([]);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 年月変更時にカレンダー生成
  useEffect(() => {
    const [y, m] = yearMonth.split('-').map(Number);
    setCalendar(generateCalendar(y, m));
    setSelectedDate(`${yearMonth}-01`);
  }, [yearMonth]);

  // 選択日または年月変更時にデータ取得
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDailyConsumption(selectedDate);
        setRecords(data.records);
        setTotalCalories(data.totalCalories);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'データ取得エラー');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedDate]);

  // 月操作
  const shiftMonth = (offset: number) => {
    const [y, m] = yearMonth.split('-').map(Number);
    const date = new Date(y, m - 1 + offset);
    const newYear = date.getFullYear();
    const newMonth = date.getMonth() + 1;
    setYearMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  return (
    <div className="min-h-screen pt-20 px-4 py-8">
      <div className="max-w-xl max-h-[80vh] mx-auto bg-white p-4 rounded-lg shadow-md overflow-y-auto">
        <h1 className="text-xl font-semibold mb-2 text-center">月別カレンダー</h1>
        <div className="flex justify-center items-center mb-2 space-x-2">
          {/* 前月ボタン */}
          <button onClick={() => shiftMonth(-1)} className="px-2 py-1 border rounded text-sm hover:bg-gray-100">◀</button>
          {/* 年と月のセレクトUI */}
          <select
            value={yearMonth.split('-')[0]}
            onChange={(e) => {
              const m = yearMonth.split('-')[1];
              setYearMonth(`${e.target.value}-${m}`);
            }}
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring"
          >
            {Array.from({ length: 7 }).map((_, i) => {
              const y = today.getFullYear() - 3 + i;
              return (
                <option key={y} value={y.toString()}>
                  {y}年
                </option>
              );
            })}
          </select>
          <select
            value={yearMonth.split('-')[1]}
            onChange={(e) => {
              const y = yearMonth.split('-')[0];
              setYearMonth(`${y}-${e.target.value}`);
            }}
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring"
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const m = (i + 1).toString().padStart(2, '0');
              return (
                <option key={m} value={m}>
                  {i + 1}月
                </option>
              );
            })}
          </select>
          {/* 次月ボタン */}
          <button onClick={() => shiftMonth(1)} className="px-2 py-1 border rounded text-sm hover:bg-gray-100">▶</button>
        </div>
        {/* カレンダー */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
          {['日','月','火','水','木','金','土'].map(d => (
            <div key={d} className="h-8 w-8 flex items-center justify-center font-medium">{d}</div>
          ))}
        </div>
        <div className="overflow-y-auto mb-4">
          <div className="grid grid-cols-7 gap-1">
            {calendar.map((week, wi) =>
              week.map((date, di) => (
                <button
                  key={`${wi}-${di}`}
                  onClick={() => date && setSelectedDate(date)}
                  disabled={!date}
                  className={
                    `h-8 w-8 flex items-center justify-center rounded text-sm ` +
                    (date === selectedDate ? 'bg-blue-600 text-white' : 'hover:bg-gray-200')
                  }
                >
                  {date ? Number(date.split('-')[2]) : ''}
                </button>
              ))
            )}
          </div>
        </div>
        {/* 選択日詳細 */}
        <div>
          <h2 className="text-base font-medium mb-1">{selectedDate} の記録</h2>
          {loading ? (
            <p className="text-sm">読み込み中...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : records.length === 0 ? (
            <p className="text-sm">記録がありません</p>
          ) : (
            <ul className="space-y-1 mb-3">
              {records.map(r => (
                <li key={r.id} className="border p-1 rounded flex justify-between text-sm">
                  <span>料理名: {r.recipeName} × {r.quantity}</span>
                  <span>{new Date(r.consumedAt).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="font-bold text-sm">合計カロリー: {totalCalories} kcal</p>
        </div>
      </div>
    </div>
  );
}

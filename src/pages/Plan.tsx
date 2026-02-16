import { useState } from 'react';
import { useData } from '../context/DataContext';
import { IconCalendar } from '../components/UI/Icons';
import type { StudyPlan } from '../types';

export const Plan = () => {
  const { data, addPlan, updatePlan, deletePlan } = useData();

  // Calendar State
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

  // Form State
  const [content, setContent] = useState('');
  const [themeId, setThemeId] = useState('');

  // Calendar Logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0: Sun, 1: Mon...

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const days = [];
  // Empty slots for prev month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push(dateStr);
  }

  // Event Helpers
  const getPlansForDate = (dateStr: string) => data.plans.filter(p => p.date === dateStr);

  // Handlers
  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !themeId) return;

    const newPlan: StudyPlan = {
      id: crypto.randomUUID(),
      date: selectedDate,
      themeId,
      content,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    addPlan(newPlan);
    setContent('');
  };

  const togglePlan = (plan: StudyPlan) => {
    updatePlan({ ...plan, isCompleted: !plan.isCompleted });
  };

  const getTheme = (id: string) => data.themes.find(t => t.id === id);

  return (
    <div className="page-container">
      <div className="calendar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconCalendar />
          <h3>{year}年 {month + 1}月</h3>
        </div>
        <div>
          <button onClick={prevMonth} className="btn-nav" style={{ marginRight: '8px' }}>&lt;</button>
          <button onClick={nextMonth} className="btn-nav">&gt;</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekday">日</div>
        <div className="weekday">月</div>
        <div className="weekday">火</div>
        <div className="weekday">水</div>
        <div className="weekday">木</div>
        <div className="weekday">金</div>
        <div className="weekday">土</div>

        {days.map((dateStr, index) => {
          if (!dateStr) return <div key={`empty-${index}`} className="day-cell empty"></div>;

          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today.toISOString().split('T')[0];
          const planCount = getPlansForDate(dateStr).length;
          const recordCount = data.records.filter(r => r.date === dateStr).length;
          const dayNum = parseInt(dateStr.split('-')[2]);

          return (
            <div
              key={dateStr}
              className={`day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => setSelectedDate(dateStr)}
            >
              <span className="day-num">{dayNum}</span>
              <div className="dots-container">
                {planCount > 0 && <span className="dot plan-dot"></span>}
                {recordCount > 0 && <span className="dot record-dot"></span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="plan-section">
        <div className="plan-header">
          <h4>{selectedDate.replace(/-/g, '/')} の予定</h4>
        </div>

        <div className="plan-list">
          {getPlansForDate(selectedDate).length === 0 && (
            <p className="no-plans">予定はありません</p>
          )}
          {getPlansForDate(selectedDate).map(plan => {
            const theme = getTheme(plan.themeId);
            return (
              <div key={plan.id} className={`plan-item ${plan.isCompleted ? 'completed' : ''}`}>
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={plan.isCompleted}
                    onChange={() => togglePlan(plan)}
                  />
                  <span className="checkmark"></span>
                </label>
                <div className="plan-content">
                  <span
                    className="plan-theme-badge"
                    style={{ backgroundColor: theme?.color || '#ccc' }}
                  >
                    {theme?.title}
                  </span>
                  <span className="plan-text">{plan.content}</span>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => deletePlan(plan.id)}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleAddPlan} className="add-plan-form">
          <select
            value={themeId}
            onChange={e => setThemeId(e.target.value)}
            required
            className={!themeId ? 'placeholder' : ''}
          >
            <option value="" disabled>テーマ選択...</option>
            {data.themes.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="学習内容..."
            required
          />
          <button type="submit" disabled={!content || !themeId}>追加</button>
        </form>
        {data.themes.length === 0 && (
          <p className="helper-text">※テーマを作成すると予定を追加できます</p>
        )}
      </div>

      <style>{`
        .page-container {
          padding: var(--spacing-md);
          padding-bottom: 80px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        .calendar-header h3 {
          font-size: var(--font-size-lg);
        }
        .btn-nav {
          background: none;
          border: 1px solid var(--color-border);
          padding: 4px 12px;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: var(--spacing-lg);
        }
        .weekday {
          text-align: center;
          font-size: var(--font-size-xs);
          color: var(--color-text-sub);
          font-weight: 600;
          padding-bottom: 4px;
        }
        .day-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%; /* Rounded for selection */
          cursor: pointer;
          position: relative;
          font-size: var(--font-size-sm);
        }
        .day-cell.empty {
          cursor: default;
        }
        .day-cell.selected {
          background-color: var(--color-primary);
          color: white;
        }
        .day-cell.today:not(.selected) {
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          font-weight: 700;
        }
        .dots-container {
            display: flex;
            gap: 2px;
            position: absolute;
            bottom: 4px;
        }
        .dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
        }
        .plan-dot {
            background-color: var(--color-warning);
        }
        .record-dot {
            background-color: var(--color-primary); /* Green or Primary color for executed */
        }
        .day-cell.selected .dot {
            background-color: white;
        }

        .plan-section {
          background: var(--color-bg-card);
          padding: var(--spacing-md);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .plan-header {
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid var(--color-border);
        }
        .plan-list {
          flex: 1;
          overflow-y: auto;
          margin-bottom: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        .no-plans {
          color: var(--color-text-sub);
          text-align: center;
          margin-top: var(--spacing-md);
          font-size: var(--font-size-sm);
        }
        .plan-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: 8px;
          background: var(--color-bg-base);
          border-radius: var(--radius-md);
        }
        .plan-content {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          overflow: hidden;
        }
        .plan-theme-badge {
          font-size: 0.7rem;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .plan-text {
          font-size: var(--font-size-sm);
           white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .plan-item.completed .plan-text {
          text-decoration: line-through;
          color: var(--color-text-sub);
        }
        .plan-item.completed .plan-theme-badge {
          opacity: 0.6;
        }
        .btn-delete {
          background: none;
          border: none;
          color: var(--color-text-sub);
          font-size: 1.2rem;
          padding: 0 4px;
        }

        .add-plan-form {
          display: flex;
          gap: var(--spacing-sm);
        }
        .add-plan-form select, .add-plan-form input {
          padding: 8px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
        }
        .add-plan-form select {
          width: 30%;
        }
        .add-plan-form input {
          flex: 1;
        }
        .add-plan-form button {
          background-color: var(--color-primary);
          color: white;
          border: none;
          padding: 0 12px;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }
        .add-plan-form button:disabled {
          background-color: var(--color-border);
        }
        .checkbox-container input {
            width: 16px; 
            height: 16px;
        }
        .helper-text {
          font-size: 0.75rem;
          color: var(--color-text-sub);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

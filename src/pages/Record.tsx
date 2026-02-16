import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { IconCalendar } from '../components/UI/Icons';
import type { StudyRecord } from '../types';

interface RecordProps {
    onNavigateHome: () => void;
    initialData?: StudyRecord | null;
}

export const Record: React.FC<RecordProps> = ({ onNavigateHome, initialData }) => {
    const { data, addRecord, updateRecord } = useData();

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('0');
    const [minutes, setMinutes] = useState('0');
    const [themeId, setThemeId] = useState('');
    const [itemId, setItemId] = useState('');
    const [memo, setMemo] = useState('');
    const [reflection, setReflection] = useState('');

    // Pre-fill form if editing
    useEffect(() => {
        if (initialData) {
            setDate(initialData.date);
            setHours(Math.floor(initialData.durationMinutes / 60).toString());
            setMinutes((initialData.durationMinutes % 60).toString());
            setThemeId(initialData.themeId);
            setItemId(initialData.itemId || '');
            setMemo(initialData.memo || '');
            setReflection(initialData.reflection || '');
        }
    }, [initialData]);

    // Filter items based on selected theme
    const filteredItems = data.items.filter(item => item.themeId === themeId && !item.isCompleted);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!themeId) {
            alert('テーマを選択してください');
            return;
        }

        const duration = parseInt(hours) * 60 + parseInt(minutes);
        if (duration <= 0) {
            alert('学習時間を入力してください');
            return;
        }

        const recordData: StudyRecord = {
            id: initialData ? initialData.id : crypto.randomUUID(),
            date,
            durationMinutes: duration,
            themeId,
            itemId: itemId || undefined,
            memo,
            reflection,
            createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
        };

        if (initialData) {
            updateRecord(recordData);
            alert('記録を更新しました！');
        } else {
            addRecord(recordData);
            alert('学習を記録しました！');
        }
        onNavigateHome();
    };

    return (
        <div className="page-container">
            <h2>{initialData ? '記録の編集' : '学習記録'}</h2>
            <form onSubmit={handleSubmit} className="record-form">
                <div className="form-group">
                    <label>日付</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                        className="input-date"
                    />
                </div>

                <div className="form-group">
                    <label>時間</label>
                    <div className="time-inputs">
                        <div className="time-input-group">
                            <input
                                type="number"
                                min="0"
                                value={hours}
                                onChange={e => setHours(e.target.value)}
                            />
                            <span>時間</span>
                        </div>
                        <div className="time-input-group">
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={minutes}
                                onChange={e => setMinutes(e.target.value)}
                            />
                            <span>分</span>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>テーマ <span className="required">*</span></label>
                    <select
                        value={themeId}
                        onChange={e => {
                            setThemeId(e.target.value);
                            setItemId(''); // Reset item when theme changes
                        }}
                        required
                    >
                        <option value="" disabled>選択してください</option>
                        {data.themes.map(theme => (
                            <option key={theme.id} value={theme.id}>{theme.title}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>学習項目 (任意)</label>
                    <select
                        value={itemId}
                        onChange={e => setItemId(e.target.value)}
                        disabled={!themeId}
                    >
                        <option value="">選択なし</option>
                        {filteredItems.map(item => (
                            <option key={item.id} value={item.id}>{item.title}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>メモ</label>
                    <textarea
                        value={memo}
                        onChange={e => setMemo(e.target.value)}
                        placeholder="学習内容の詳細など"
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label>振り返り</label>
                    <textarea
                        value={reflection}
                        onChange={e => setReflection(e.target.value)}
                        placeholder="分かったこと、次はどうする？"
                        rows={2}
                    />
                </div>

                <button type="submit" className="btn-submit">
                    {initialData ? '更新する' : '記録する'}
                </button>
            </form>

            <style>{`
        .page-container {
          padding: var(--spacing-md);
          padding-bottom: 80px; /* Nav bar height */
        }
        .record-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-md);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        .form-group label {
          font-weight: 600;
          font-size: var(--font-size-sm);
          color: var(--color-text);
        }
        .required {
          color: var(--color-warning);
        }
        
        input, select, textarea {
          padding: 12px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-md);
          background-color: var(--color-bg-base);
          color: var(--color-text);
        }
        
        .time-inputs {
          display: flex;
          gap: var(--spacing-md);
        }
        .time-input-group {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          flex: 1;
        }
        .time-input-group input {
          width: 100%;
          text-align: center;
          font-size: var(--font-size-lg);
        }

        .btn-submit {
          margin-top: var(--spacing-md);
          padding: 16px;
          background-color: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-size: var(--font-size-md);
          font-weight: bold;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
        }
        .btn-submit:active {
          font-size: 0.8rem;
          color: var(--color-danger);
          margin-top: 4px;
        }
      `}</style>
        </div>
    );
};

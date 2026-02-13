import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import type { StudyRecord } from '../types';

export const Record = ({ onNavigateHome }: { onNavigateHome: () => void }) => {
    const { data, addRecord } = useData();

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState(1);
    const [minutes, setMinutes] = useState(0);
    const [selectedThemeId, setSelectedThemeId] = useState('');
    const [selectedItemId, setSelectedItemId] = useState('');
    const [memo, setMemo] = useState('');
    const [reflection, setReflection] = useState('');

    // Reset item selection when theme changes
    useEffect(() => {
        setSelectedItemId('');
    }, [selectedThemeId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedThemeId) {
            alert('テーマを選択してください');
            return;
        }

        const durationMinutes = (Number(hours) * 60) + Number(minutes);
        if (durationMinutes <= 0) {
            alert('学習時間を入力してください');
            return;
        }

        const newRecord: StudyRecord = {
            id: crypto.randomUUID(),
            date,
            durationMinutes,
            themeId: selectedThemeId,
            itemId: selectedItemId || undefined,
            memo,
            reflection,
            createdAt: new Date().toISOString(),
        };

        addRecord(newRecord);
        alert('学習を記録しました！');
        onNavigateHome();
    };

    const themeItems = data.items.filter(i => i.themeId === selectedThemeId);

    return (
        <div className="page-container">
            <h2>学習記録</h2>

            <form onSubmit={handleSubmit} className="record-form">
                <div className="form-group">
                    <label>日付</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>学習時間</label>
                    <div className="time-inputs">
                        <div className="time-field">
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={hours}
                                onChange={e => setHours(Number(e.target.value))}
                            />
                            <span>時間</span>
                        </div>
                        <div className="time-field">
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={minutes}
                                onChange={e => setMinutes(Number(e.target.value))}
                            />
                            <span>分</span>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>テーマ</label>
                    <select
                        value={selectedThemeId}
                        onChange={e => setSelectedThemeId(e.target.value)}
                        required
                        className={!selectedThemeId ? 'placeholder' : ''}
                    >
                        <option value="" disabled>テーマを選択...</option>
                        {data.themes.map(theme => (
                            <option key={theme.id} value={theme.id}>{theme.title}</option>
                        ))}
                    </select>
                    {data.themes.length === 0 && (
                        <p className="helper-text">※まずは学習項目画面でテーマを作成してください</p>
                    )}
                </div>

                <div className="form-group">
                    <label>学習項目 (任意)</label>
                    <select
                        value={selectedItemId}
                        onChange={e => setSelectedItemId(e.target.value)}
                        disabled={!selectedThemeId}
                    >
                        <option value="">-- 指定なし --</option>
                        {themeItems.map(item => (
                            <option key={item.id} value={item.id}>{item.title}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>内容メモ</label>
                    <textarea
                        value={memo}
                        onChange={e => setMemo(e.target.value)}
                        placeholder="学習した内容の要約など"
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label>振り返り</label>
                    <textarea
                        value={reflection}
                        onChange={e => setReflection(e.target.value)}
                        placeholder="良かった点、反省点、次回の目標など"
                        rows={2}
                    />
                </div>

                <button type="submit" className="btn-submit">記録する</button>
            </form>

            <style>{`
        .page-container {
          padding: var(--spacing-md);
          max-width: 600px;
          margin: 0 auto;
          padding-bottom: 80px;
        }
        .record-form {
          background: var(--color-bg-card);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-md);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        .form-group label {
          font-weight: 600;
          font-size: var(--font-size-sm);
          color: var(--color-text-sub);
        }
        input, select, textarea {
          padding: 10px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          background-color: var(--color-bg-base);
          font-family: inherit;
        }
        input:focus, select:focus, textarea:focus {
          outline: 2px solid var(--color-primary-light);
          border-color: var(--color-primary);
        }
        .time-inputs {
          display: flex;
          gap: var(--spacing-md);
        }
        .time-field {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }
        .time-field input {
          width: 80px;
          text-align: center;
        }
        .btn-submit {
          background-color: var(--color-primary);
          color: white;
          border: none;
          padding: 14px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: var(--font-size-lg);
          margin-top: var(--spacing-sm);
          box-shadow: var(--shadow-md);
          transition: transform 0.1s;
        }
        .btn-submit:active {
          transform: scale(0.98);
        }
        .placeholder {
          color: var(--color-text-sub);
        }
        .helper-text {
          font-size: 0.8rem;
          color: var(--color-danger);
          margin-top: 4px;
        }
      `}</style>
        </div>
    );
};

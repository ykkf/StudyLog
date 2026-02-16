import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { StudyRecord } from '../types';

export const History = ({ onEdit }: { onEdit: (record: StudyRecord) => void }) => {
    const { data, deleteRecord } = useData();
    const [filterThemeId, setFilterThemeId] = useState<string>('');

    const sortedRecords = [...data.records].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime() ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const filteredRecords = filterThemeId
        ? sortedRecords.filter(r => r.themeId === filterThemeId)
        : sortedRecords;

    const getTheme = (id: string) => data.themes.find(t => t.id === id);
    const getItem = (id?: string) => id ? data.items.find(i => i.id === id) : undefined;

    const handleDelete = (id: string) => {
        if (window.confirm('この記録を削除してもよろしいですか？')) {
            deleteRecord(id);
        }
    };

    // Group by month
    const groupedRecords: { [key: string]: StudyRecord[] } = {};
    filteredRecords.forEach(record => {
        const month = record.date.substring(0, 7); // YYYY-MM
        if (!groupedRecords[month]) groupedRecords[month] = [];
        groupedRecords[month].push(record);
    });

    return (
        <div className="page-container">
            <div className="history-header">
                <h2>学習履歴</h2>
                <select
                    value={filterThemeId}
                    onChange={e => setFilterThemeId(e.target.value)}
                    className="theme-filter"
                >
                    <option value="">全てのテーマ</option>
                    {data.themes.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                </select>
            </div>

            <div className="history-list">
                {Object.keys(groupedRecords).length === 0 && (
                    <p className="no-records">記録がありません</p>
                )}

                {Object.keys(groupedRecords).map(month => (
                    <div key={month} className="month-group">
                        <h3 className="month-label">{month.replace('-', '年 ')}月</h3>
                        {groupedRecords[month].map(record => {
                            const theme = getTheme(record.themeId);
                            const item = getItem(record.itemId);

                            return (
                                <div key={record.id} className="history-card">
                                    <div className="history-card-header">
                                        <span className="history-date">
                                            {new Date(record.date).getDate()}日
                                        </span>
                                        <span
                                            className="history-theme-badge"
                                            style={{ backgroundColor: theme?.color || '#ccc' }}
                                        >
                                            {theme?.title}
                                        </span>
                                        <span className="history-duration">
                                            {Math.floor(record.durationMinutes / 60)}h {record.durationMinutes % 60}m
                                        </span>
                                    </div>

                                    <div className="history-card-body">
                                        {item && <div className="history-item-title">項目: {item.title}</div>}
                                        {record.memo && <div className="history-memo">{record.memo}</div>}
                                        {record.reflection && <div className="history-reflection">振り返り: {record.reflection}</div>}
                                    </div>

                                    <div className="history-actions">
                                        <button onClick={() => onEdit(record)} className="btn-edit-sm">編集</button>
                                        <button onClick={() => handleDelete(record.id)} className="btn-delete-sm">削除</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <style>{`
        .page-container {
          padding: var(--spacing-md);
          padding-bottom: 80px;
        }
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        .theme-filter {
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
        }
        .month-label {
          font-size: var(--font-size-md);
          color: var(--color-text-sub);
          margin-top: var(--spacing-lg);
          margin-bottom: var(--spacing-sm);
          padding-bottom: 4px;
          border-bottom: 1px solid var(--color-border);
        }
        .history-card {
          background: var(--color-bg-card);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-md);
          box-shadow: var(--shadow-sm);
        }
        .history-card-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }
        .history-date {
          font-weight: bold;
          font-size: var(--font-size-lg);
        }
        .history-theme-badge {
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: var(--font-size-xs);
        }
        .history-duration {
          margin-left: auto;
          font-weight: 600;
          color: var(--color-primary);
        }
        .history-card-body {
          font-size: var(--font-size-sm);
          color: var(--color-text);
          margin-bottom: var(--spacing-sm);
        }
        .history-item-title {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .history-memo, .history-reflection {
          margin-bottom: 4px;
          line-height: 1.4;
        }
        .history-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
          border-top: 1px solid var(--color-bg-base);
          padding-top: 8px;
        }
        .btn-edit-sm, .btn-delete-sm {
          background: none;
          border: none;
          font-size: var(--font-size-sm);
          cursor: pointer;
          text-decoration: underline;
        }
        .btn-edit-sm { color: var(--color-primary); }
        .btn-delete-sm { color: var(--color-warning); }
      `}</style>
        </div>
    );
};

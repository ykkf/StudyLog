import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Theme, LearningItem } from '../types';

export const Items = () => {
    const { data, addTheme, deleteTheme } = useData();
    const [isAddingTheme, setIsAddingTheme] = useState(false);
    const [newThemeTitle, setNewThemeTitle] = useState('');
    const [newThemeColor, setNewThemeColor] = useState('#4F46E5');
    const [expandedThemeId, setExpandedThemeId] = useState<string | null>(null);

    const handleAddTheme = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newThemeTitle.trim()) return;

        const newTheme: Theme = {
            id: crypto.randomUUID(),
            title: newThemeTitle,
            color: newThemeColor,
            createdAt: new Date().toISOString(),
        };

        addTheme(newTheme);
        setNewThemeTitle('');
        setIsAddingTheme(false);
    };

    const handleDeleteTheme = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('このテーマと関連する学習項目を削除しますか？')) {
            deleteTheme(id);
        }
    };

    const toggleTheme = (id: string) => {
        setExpandedThemeId(prev => prev === id ? null : id);
    };

    return (
        <div className="page-container">
            <div className="header-actions">
                <h2>学習項目</h2>
                <button className="btn-add" onClick={() => setIsAddingTheme(true)}>
                    ＋ テーマ追加
                </button>
            </div>

            {isAddingTheme && (
                <form onSubmit={handleAddTheme} className="theme-form">
                    <input
                        type="text"
                        placeholder="テーマ名 (例: 英語, プログラミング)"
                        value={newThemeTitle}
                        onChange={(e) => setNewThemeTitle(e.target.value)}
                        autoFocus
                    />
                    <input
                        type="color"
                        value={newThemeColor}
                        onChange={(e) => setNewThemeColor(e.target.value)}
                        className="color-picker"
                    />
                    <div className="form-actions">
                        <button type="button" onClick={() => setIsAddingTheme(false)}>キャンセル</button>
                        <button type="submit" className="btn-primary">追加</button>
                    </div>
                </form>
            )}

            <div className="theme-list">
                {data.themes.length === 0 && <p className="empty-state">テーマがありません。「＋ テーマ追加」から作成してください。</p>}

                {data.themes.map(theme => (
                    <div key={theme.id} className={`theme-card ${expandedThemeId === theme.id ? 'expanded' : ''}`}>
                        <div
                            className="theme-header"
                            onClick={() => toggleTheme(theme.id)}
                            style={{ borderLeft: `4px solid ${theme.color}` }}
                        >
                            <span className="theme-title">{theme.title}</span>
                            <div className="theme-meta">
                                <span className="item-count">
                                    {data.items.filter(i => i.themeId === theme.id).length} items
                                </span>
                                <button
                                    className="btn-icon"
                                    onClick={(e) => handleDeleteTheme(theme.id, e)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {expandedThemeId === theme.id && (
                            <ItemList themeId={theme.id} />
                        )}
                    </div>
                ))}
            </div>

            <style>{`
        .page-container {
          padding: var(--spacing-md);
          padding-bottom: 80px;
        }
        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        .btn-add {
          background-color: var(--color-primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: var(--font-size-sm);
        }
        .theme-form {
          background: var(--color-bg-card);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          margin-bottom: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        .theme-form input[type="text"] {
          padding: 8px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-sm);
        }
        .theme-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        .theme-card {
          background: var(--color-bg-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: var(--shadow-md);
        }
        .theme-header {
          padding: var(--spacing-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .theme-title {
          font-weight: 600;
          font-size: var(--font-size-lg);
        }
        .theme-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        .item-count {
          font-size: var(--font-size-xs);
          color: var(--color-text-sub);
        }
        .btn-icon {
          background: none;
          border: none;
          padding: 4px;
          font-size: 1.2rem;
          opacity: 0.6;
        }
        .btn-icon:hover {
          opacity: 1;
        }
        .empty-state {
          text-align: center;
          color: var(--color-text-sub);
          margin-top: var(--spacing-xl);
        }
      `}</style>
        </div>
    );
};

const ItemList = ({ themeId }: { themeId: string }) => {
    const { data, addItem, updateItem, deleteItem } = useData();
    const [newItemTitle, setNewItemTitle] = useState('');

    const themeItems = data.items.filter(i => i.themeId === themeId);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemTitle.trim()) return;

        const newItem: LearningItem = {
            id: crypto.randomUUID(),
            themeId,
            title: newItemTitle,
            isCompleted: false,
            createdAt: new Date().toISOString(),
        };

        addItem(newItem);
        setNewItemTitle('');
    };

    const toggleComplete = (item: LearningItem) => {
        updateItem({ ...item, isCompleted: !item.isCompleted });
    };

    return (
        <div className="item-list-container">
            <ul className="item-list">
                {themeItems.map(item => (
                    <li key={item.id} className={`item-row ${item.isCompleted ? 'completed' : ''}`}>
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={item.isCompleted}
                                onChange={() => toggleComplete(item)}
                            />
                            <span className="checkmark"></span>
                        </label>
                        <span className="item-title">{item.title}</span>
                        <button
                            className="btn-delete-item"
                            onClick={() => deleteItem(item.id)}
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleAddItem} className="add-item-form">
                <input
                    type="text"
                    placeholder="新しい項目を追加..."
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                />
                <button type="submit" disabled={!newItemTitle.trim()}>追加</button>
            </form>

            <style>{`
        .item-list-container {
          background-color: var(--color-bg-base);
          padding: var(--spacing-md);
          border-top: 1px solid var(--color-border);
        }
        .item-list {
          list-style: none;
          padding: 0;
          margin: 0;
          margin-bottom: var(--spacing-md);
        }
        .item-row {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--color-border);
        }
        .item-row:last-child {
          border-bottom: none;
        }
        .item-row.completed .item-title {
          text-decoration: line-through;
          color: var(--color-text-sub);
        }
        .item-title {
          flex: 1;
          margin-left: var(--spacing-sm);
        }
        .checkbox-container input {
          width: 18px;
          height: 18px;
        }
        .btn-delete-item {
          background: none;
          border: none;
          color: var(--color-text-sub);
          font-size: 1.5rem;
          padding: 0 8px;
        }
        .add-item-form {
          display: flex;
          gap: var(--spacing-sm);
        }
        .add-item-form input {
          flex: 1;
          padding: 8px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .add-item-form button {
          background-color: var(--color-primary-light);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
        }
        .add-item-form button:disabled {
          background-color: var(--color-border);
        }
      `}</style>
        </div>
    );
};

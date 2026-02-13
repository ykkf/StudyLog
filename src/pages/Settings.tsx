import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { storage } from '../utils/storage';

export const Settings = () => {
    const { resetData, importData } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBackup = async () => {
        const data = storage.exportBackup();
        const blob = new Blob([data], { type: 'application/json' });

        // Check for Share API support (Mobile)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'study_backup.json', { type: 'application/json' })] })) {
            try {
                const file = new File([blob], 'study_backup.studylog.json', { type: 'application/json' });
                await navigator.share({
                    files: [file],
                    title: 'StudyLog Backup',
                });
                return;
            } catch (e) {
                console.log('Share failed or cancelled', e);
            }
        }

        // Fallback to download (Desktop/Android legacy)
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `studylog_backup_${new Date().toISOString().split('T')[0]}.studylog.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!window.confirm('現在のデータはすべて上書きされます。よろしいですか？')) {
            e.target.value = ''; // Reset input
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                const success = importData(content);
                if (success) {
                    alert('復元が完了しました。');
                } else {
                    alert('ファイルの読み込みに失敗しました。正しいバックアップファイル形式か確認してください。');
                }
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        if (window.confirm('すべてのデータを削除して初期化します。この操作は取り消せません。よろしいですか？')) {
            resetData();
            alert('データを初期化しました。');
        }
    };

    return (
        <div className="page-container">
            <h2>設定</h2>

            <div className="settings-section">
                <h3>データ管理</h3>

                <div className="setting-item">
                    <p>現在のデータをバックアップファイルとして保存します。</p>
                    <button onClick={handleBackup} className="btn-primary">バックアップ作成</button>
                </div>

                <div className="setting-item">
                    <p>バックアップファイルからデータを復元します。</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json,.studylog.json"
                        style={{ display: 'none' }}
                    />
                    <button onClick={handleRestoreClick} className="btn-secondary">バックアップから復元</button>
                </div>

                <div className="setting-item danger-zone">
                    <p>すべての学習記録を削除します。</p>
                    <button onClick={handleReset} className="btn-danger">データ初期化</button>
                </div>
            </div>

            <style>{`
        .page-container {
          padding: var(--spacing-md);
          max-width: 600px;
          margin: 0 auto;
        }
        .settings-section {
          background: var(--color-bg-card);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }
        .setting-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
        }
        .setting-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .btn-primary {
          background-color: var(--color-primary);
          color: white;
          border: none;
          padding: 12px;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .btn-secondary {
          background-color: white;
          color: var(--color-text-main);
          border: 1px solid var(--color-border);
          padding: 12px;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .btn-danger {
          background-color: white;
          color: var(--color-danger);
          border: 1px solid var(--color-danger);
          padding: 12px;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
      `}</style>
        </div>
    );
};

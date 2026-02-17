import React, { useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { storage } from '../utils/storage';

export const Settings = () => {
    const { data, updateUser, toggleTheme, resetData, importData, setBackgroundColor } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [userName, setUserName] = useState(data.user.name);
    const [isNameEditing, setIsNameEditing] = useState(false);

    const handleBackup = async () => {
        const backupData = storage.exportBackup();
        const blob = new Blob([backupData], { type: 'application/json' });

        // Check for Share API support (Mobile)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'study_backup.json', { type: 'application/json' })] })) {
            try {
                const fileName = 'studylog_backup_' + new Date().toISOString().split('T')[0] + '.studylog.json';
                const file = new File([blob], fileName, { type: 'application/json' });
                await navigator.share({
                    files: [file],
                    title: 'StudyLog Backup',
                });
                return;
            } catch (e) {
                console.log('Share failed, falling back to download', e);
            }
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'studylog_backup_' + new Date().toISOString().split('T')[0] + '.studylog.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                if (importData(content)) {
                    alert('データを復元しました');
                } else {
                    alert('データの形式が正しくありません');
                }
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    };

    const handleReset = () => {
        if (window.confirm('本当に全てのデータを削除してもよろしいですか？この操作は取り消せません。')) {
            resetData();
            alert('データを初期化しました');
        }
    };

    const handleNameSave = () => {
        updateUser({ name: userName });
        setIsNameEditing(false);
    };

    return (
        <div className="page-container">
            <h2>設定</h2>

            <div className="settings-section">
                <h3>プロフィール</h3>
                <div className="profile-setting">
                    {isNameEditing ? (
                        <div className="name-edit">
                            <input
                                type="text"
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                            />
                            <button onClick={handleNameSave} className="btn-save">保存</button>
                        </div>
                    ) : (
                        <div className="name-display">
                            <span>ユーザー名: <strong>{data.user.name}</strong></span>
                            <button onClick={() => setIsNameEditing(true)} className="btn-edit">変更</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="settings-section">
                <h3>表示</h3>
                <div className="theme-setting">
                    <span>ダークモード</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={data.themeMode === 'dark'}
                            onChange={toggleTheme}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="theme-setting" style={{ marginTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
                    <span>背景色</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {data.backgroundColor && (
                            <button
                                onClick={() => setBackgroundColor(undefined)}
                                style={{ fontSize: '0.8rem', padding: '2px 8px', background: 'none', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                            >
                                リセット
                            </button>
                        )}
                        <input
                            type="color"
                            value={data.backgroundColor || '#ffffff'}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            style={{
                                width: '40px',
                                height: '24px',
                                padding: 0,
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                background: 'none'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h3>データ管理</h3>
                <div className="settings-actions">
                    <div className="setting-item">
                        <p>現在のデータをファイルに保存します（バックアップ）</p>
                        <button onClick={handleBackup} className="btn-primary">
                            データを書き出し (バックアップ)
                        </button>
                    </div>

                    <div className="setting-item">
                        <p>バックアップファイルからデータを復元します</p>
                        <button onClick={handleRestoreClick} className="btn-secondary">
                            データを読み込み (復元)
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className="setting-item danger-zone">
                        <p>全てのデータを削除して初期状態に戻します</p>
                        <button onClick={handleReset} className="btn-danger">
                            データを初期化
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .page-container {
                    padding: var(--spacing-md);
                    max-width: 600px;
                    margin: 0 auto;
                    padding-bottom: 80px; 
                }
                .settings-section {
                    background: var(--color-bg-card);
                    padding: var(--spacing-md);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--spacing-md);
                    box-shadow: var(--shadow-sm);
                }
                .settings-section h3 {
                    font-size: var(--font-size-md);
                    margin-bottom: var(--spacing-sm);
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: 8px;
                }
                .profile-setting, .theme-setting {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    min-height: 40px;
                }
                .name-display {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    width: 100%;
                    justify-content: space-between;
                }
                .name-edit {
                    display: flex;
                    gap: 8px;
                    width: 100%;
                }
                .name-edit input {
                    flex: 1;
                    padding: 8px;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--color-border);
                    font-size: var(--font-size-base);
                    background: var(--color-bg-base);
                    color: var(--color-text-main);
                }
                .btn-save {
                    background: var(--color-primary);
                    color: white;
                    border: none;
                    padding: 4px 12px;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                }
                .btn-edit {
                    background: none;
                    border: 1px solid var(--color-border);
                    padding: 4px 12px;
                    border-radius: var(--radius-sm);
                    font-size: var(--font-size-sm);
                    cursor: pointer;
                    color: var(--color-text-main);
                }
                
                /* Toggle Switch */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                }
                input:checked + .slider {
                    background-color: var(--color-primary);
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                .slider.round {
                    border-radius: 24px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }

                .settings-actions {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }
                .setting-item {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                }
                .setting-item p {
                    font-size: var(--font-size-sm);
                    color: var(--color-text-sub);
                }

                .btn-primary, .btn-secondary, .btn-danger {
                    padding: 12px;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    width: 100%;
                    text-align: center;
                }
                .btn-primary {
                    background-color: var(--color-primary);
                    color: white;
                }
                .btn-secondary {
                    background-color: var(--color-bg-base);
                    border: 1px solid var(--color-border);
                    color: var(--color-text-main);
                }
                .btn-danger {
                    background-color: #fee2e2;
                    color: #ef4444;
                }
                .danger-zone {
                    margin-top: var(--spacing-md);
                    padding-top: var(--spacing-md);
                    border-top: 1px solid var(--color-border);
                }
            `}</style>
        </div>
    );
};

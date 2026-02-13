
import { useData } from '../context/DataContext';

export const Home = () => {
  const { data } = useData();

  // Total Time Calculation
  const totalTime = data.records.reduce((acc, text) => acc + text.durationMinutes, 0);
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  // Recent Activities
  const recentRecords = [...data.records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getTheme = (id: string) => data.themes.find(t => t.id === id);
  const getItem = (id: string | undefined) => id ? data.items.find(i => i.id === id) : undefined;

  // Chart Data Preparation (Theme Distribution)
  const themeDist = data.records.reduce((acc, record) => {
    acc[record.themeId] = (acc[record.themeId] || 0) + record.durationMinutes;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(themeDist).map(([themeId, minutes]) => {
    const theme = getTheme(themeId);
    return {
      id: themeId,
      label: theme?.title || 'Unknown',
      color: theme?.color || '#ccc',
      value: minutes,
    };
  }).sort((a, b) => b.value - a.value);

  // Simple Donut using stroke-dasharray
  // Circumference = 2 * PI * r. Let r=16 (approx to viewBox 32 size). C ~ 100.
  // Then stroke-dasharray = "percent 100". stroke-dashoffset = "cumulative-percent".
  // Note: standard circle starts at 3 o'clock. rotate -90deg to start at 12.

  let offsetAccumulator = 0;
  const donutSegments = chartData.map(d => {
    const percent = totalTime > 0 ? (d.value / totalTime) * 100 : 0;
    const segment = {
      ...d,
      strokeDasharray: `${percent} 100`,
      strokeDashoffset: -offsetAccumulator
    };
    offsetAccumulator += percent;
    return segment;
  });

  return (
    <div className="page-container">
      <div className="welcome-card">
        <h2>Hello, {data.user.name}</h2>
        <div className="summary-row">
          <div className="total-time-block">
            <span className="label">Total Study</span>
            <div className="time-display">
              <span className="time-value">{hours}</span>
              <span className="time-unit">h</span>
              <span className="time-value">{minutes}</span>
              <span className="time-unit">m</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Distribution</h3>
        {totalTime === 0 ? (
          <div className="empty-chart">記録がありません</div>
        ) : (
          <div className="chart-container">
            <svg viewBox="0 0 32 32" className="donut-chart">
              {donutSegments.map(seg => (
                <circle
                  key={seg.id}
                  r="16"
                  cx="16"
                  cy="16"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="8"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                />
              ))}
            </svg>
            <div className="chart-center">
              <span>{Math.round(totalTime / 60 * 10) / 10}h</span>
            </div>
          </div>
        )}
        <div className="legend">
          {chartData.map(d => (
            <div key={d.id} className="legend-item">
              <span className="dot" style={{ backgroundColor: d.color }}></span>
              <span className="legend-label">{d.label}</span>
              <span className="legend-value">{Math.round((d.value / totalTime) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent</h3>
        {recentRecords.length === 0 ? (
          <p className="no-records">まだ記録がありません</p>
        ) : (
          <div className="record-list">
            {recentRecords.map(record => {
              const theme = getTheme(record.themeId);
              const item = getItem(record.itemId);
              return (
                <div key={record.id} className="record-card">
                  <div className="record-left" style={{ borderLeft: `4px solid ${theme?.color || '#ccc'}` }}>
                    <div className="record-date">{record.date.replace(/-/g, '/')}</div>
                    <div className="record-theme">{theme?.title}</div>
                    {item && <div className="record-item">{item.title}</div>}
                  </div>
                  <div className="record-right">
                    <span className="record-duration">{Math.floor(record.durationMinutes / 60)}h {record.durationMinutes % 60}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .page-container {
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }
        .welcome-card {
          margin-bottom: var(--spacing-sm);
        }
        .welcome-card h2 {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--spacing-sm);
        }
        .total-time-block {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          color: white;
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
        }
        .label {
          font-size: var(--font-size-xs);
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .time-display {
          display: flex;
          align-items: baseline;
          margin-top: var(--spacing-xs);
        }
        .time-value {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
        }
        .time-unit {
          font-size: var(--font-size-base);
          opacity: 0.8;
          margin-right: var(--spacing-sm);
          margin-left: 2px;
        }

        .chart-section {
          background: var(--color-bg-card);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }
        .chart-section h3, .recent-section h3 {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-md);
          font-weight: 600;
        }
        .chart-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }
        .donut-chart {
          transform: rotate(-90deg);
          width: 100%;
          height: 100%;
        }
        .chart-center {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-text-main);
        }
        .empty-chart {
          text-align: center;
          color: var(--color-text-sub);
          padding: var(--spacing-lg) 0;
        }

        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
          justify-content: center;
        }
        .legend-item {
          display: flex;
          align-items: center;
          font-size: var(--font-size-sm);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;
        }
        .legend-value {
          margin-left: 6px;
          color: var(--color-text-sub);
        }

        .record-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        .record-card {
          background: var(--color-bg-card);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .record-left {
          padding-left: var(--spacing-sm);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .record-date {
          font-size: var(--font-size-xs);
          color: var(--color-text-sub);
        }
        .record-theme {
          font-weight: 600;
        }
        .record-item {
          font-size: var(--font-size-sm);
          color: var(--color-text-sub);
        }
        .record-duration {
          font-weight: 700;
          font-size: var(--font-size-lg);
          color: var(--color-primary);
        }
        .no-records {
            color: var(--color-text-sub);
            text-align: center;
            margin-top: var(--spacing-md);
        }
      `}</style>
    </div>
  );
};

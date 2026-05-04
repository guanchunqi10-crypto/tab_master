import React, { useState, useEffect, useRef } from 'react';

/**
 * 数字动画组件
 */
function AnimatedNumber({ value, duration = 400 }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    
    const startValue = prevValue.current;
    const diff = value - startValue;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + diff * easeProgress);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

/**
 * 清理助手组件 - 现代简洁设计
 */
export default function CleanupHelper({
  casualCount,
  futureCount,
  totalTabs,
  onOneClickCleanup,
  onViewDetails
}) {
  const total = casualCount + futureCount;
  const [isAnimating, setIsAnimating] = useState(false);
  const progressPercent = totalTabs > 0 ? (total / totalTabs) * 100 : 0;

  // 良好状态 - 没有需要清理的标签
  if (total === 0) {
    return (
      <div className="cleanup-card cleanup-good animate-slide-up">
        <div className="cleanup-card-header">
          <div className="cleanup-icon">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="cleanup-title">标签页状态良好</h4>
            <p className="cleanup-subtitle">所有 {totalTabs} 个标签页都值得关注，继续保持！</p>
          </div>
        </div>
      </div>
    );
  }

  // 有需要清理的标签
  const handleCleanup = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onOneClickCleanup();
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="cleanup-card animate-slide-up">
      <div className="cleanup-card-header">
        <div className="cleanup-icon">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div>
          <h4 className="cleanup-title">整理建议</h4>
          <p className="cleanup-subtitle">
            有 <strong>{total}</strong> 个标签页可以清理
          </p>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="cleanup-stats">
        <div className="cleanup-stat">
          <span className="cleanup-stat-value today">
            <AnimatedNumber value={casualCount} />
          </span>
          <span className="cleanup-stat-label">随手开的</span>
        </div>
        <div className="cleanup-stat">
          <span className="cleanup-stat-value future">
            <AnimatedNumber value={futureCount} />
          </span>
          <span className="cleanup-stat-label">以后再看的</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="cleanup-progress">
        <div 
          className="cleanup-progress-bar" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 操作按钮 */}
      <div className="cleanup-actions">
        <button
          onClick={handleCleanup}
          disabled={isAnimating}
          className="btn-cleanup btn-press"
        >
          {isAnimating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              清理中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              一键清理
            </>
          )}
        </button>
        <button
          onClick={onViewDetails}
          className="btn-view btn-press"
        >
          查看详情
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

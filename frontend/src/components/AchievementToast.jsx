import React, { useEffect, useState } from 'react';

/**
 * 成就 Toast 组件
 */
export default function AchievementToast({ achievements, onDismiss }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (achievements.length === 0) return;

    const current = achievements[currentIndex];

    // 自动切换
    const displayTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (currentIndex < achievements.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsExiting(false);
        } else {
          onDismiss?.();
        }
      }, 400);
    }, 3000);

    return () => clearTimeout(displayTimer);
  }, [achievements, currentIndex, onDismiss]);

  if (achievements.length === 0) return null;

  const current = achievements[currentIndex];

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        ${isExiting ? 'animate-achievement-out' : 'animate-achievement-in'}
      `}
    >
      <div className="achievement-toast px-6 py-4 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
          {/* 成就图标 */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
            {current.icon}
          </div>

          {/* 成就信息 */}
          <div className="text-white">
            <p className="text-sm font-semibold opacity-80">成就解锁</p>
            <h4 className="text-lg font-bold">{current.title}</h4>
            {current.description && (
              <p className="text-sm opacity-70">{current.description}</p>
            )}
          </div>
        </div>

        {/* 进度指示器 */}
        {achievements.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {achievements.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${index === currentIndex
                    ? 'w-6 bg-white'
                    : 'bg-white/40'
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 预设成就列表
 */
export const ACHIEVEMENTS = {
  CLOSE_5: {
    id: 'close_5',
    icon: '🎯',
    title: '断舍离入门',
    description: '一次关闭 5 个标签页'
  },
  CLOSE_10: {
    id: 'close_10',
    icon: '⚡',
    title: '极速整理',
    description: '10 秒内关闭 10 个标签页'
  },
  CLOSE_20: {
    id: 'close_20',
    icon: '🔥',
    title: '清爽达人',
    description: '今日清理 20 个标签页'
  },
  CLOSE_50: {
    id: 'close_50',
    icon: '🏆',
    title: '整理大师',
    description: '累计清理 50 个标签页'
  },
  CLEAN_SLATE: {
    id: 'clean_slate',
    icon: '✨',
    title: '一键清爽',
    description: '使用一键清理功能'
  },
  STREAK_3: {
    id: 'streak_3',
    icon: '📈',
    title: '连续清理',
    description: '连续 3 天使用清理功能'
  }
};

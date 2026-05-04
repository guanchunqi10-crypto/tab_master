import React from 'react';

/**
 * 空状态组件
 * @param {string} icon - 图标（可以是emoji或svg）
 * @param {string} mainText - 主提示文字
 * @param {string} subText - 副提示文字
 */
export default function EmptyState({ icon, mainText, subText }) {
  return (
    <div className="
      flex flex-col items-center justify-center
      py-12 px-4
    ">
      {/* 图标 */}
      <div className="w-16 h-16 mb-4 flex items-center justify-center text-text-placeholder">
        {typeof icon === 'string' ? (
          <span className="text-5xl">{icon}</span>
        ) : (
          icon
        )}
      </div>

      {/* 主文字 */}
      <p className="text-sm font-medium text-text-primary mb-1">
        {mainText}
      </p>

      {/* 副文字 */}
      {subText && (
        <p className="text-xs text-text-secondary">
          {subText}
        </p>
      )}
    </div>
  );
}

/**
 * 搜索无结果空状态
 */
export function SearchEmptyState() {
  return (
    <EmptyState
      icon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      mainText="没有找到匹配的Tab"
      subText="试试其他关键词吧"
    />
  );
}

/**
 * 无已关闭Tab空状态
 */
export function NoRecentlyClosedState() {
  return (
    <EmptyState
      icon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      mainText="暂无关闭记录"
    />
  );
}

/**
 * 无最常访问空状态
 */
export function NoFrequentTabsState() {
  return (
    <EmptyState
      icon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      }
      mainText="数据不足"
      subText="明天再来看看"
    />
  );
}

/**
 * 无Tab空状态
 */
export function NoTabsState() {
  return (
    <EmptyState
      icon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      }
      mainText="暂无打开的Tab"
      subText="打开新标签页即可开始使用"
    />
  );
}

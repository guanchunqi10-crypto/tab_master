import React from 'react';

/**
 * 骨架屏组件
 * 用于数据加载中的占位动画
 */
export default function Skeleton() {
  return (
    <div className="p-8 animate-pulse">
      {/* 搜索框骨架 */}
      <div className="max-w-[600px] mx-auto mb-6">
        <div className="h-12 bg-[#F1F3F4] rounded-search" />
      </div>

      {/* 分组骨架 */}
      <div className="space-y-4">
        {/* 分组1 */}
        <div>
          <div className="h-10 w-48 bg-[#F1F3F4] rounded-lg mb-3" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-[100px] bg-[#F1F3F4] rounded-card" />
            ))}
          </div>
        </div>

        {/* 分组2 */}
        <div>
          <div className="h-10 w-40 bg-[#F1F3F4] rounded-lg mb-3" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[100px] bg-[#F1F3F4] rounded-card" />
            ))}
          </div>
        </div>

        {/* 分组3 */}
        <div>
          <div className="h-10 w-56 bg-[#F1F3F4] rounded-lg mb-3" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[100px] bg-[#F1F3F4] rounded-card" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Tab卡片骨架
 */
export function TabCardSkeleton({ width = 'w-[160px]' }) {
  return (
    <div className={`${width} h-[100px] skeleton rounded-card`} />
  );
}

/**
 * 分组骨架
 */
export function GroupSkeleton() {
  return (
    <div className="mb-4">
      <div className="h-10 w-48 skeleton rounded-lg mb-3" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[100px] skeleton rounded-card" />
        ))}
      </div>
    </div>
  );
}

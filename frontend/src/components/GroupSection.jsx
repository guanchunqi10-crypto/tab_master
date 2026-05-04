import React, { useState, useRef } from 'react';
import TabCard from './TabCard';
import GroupHeader from './GroupHeader';

/**
 * 分组列表区域组件
 * @param {Object} group - 分组数据
 * @param {Array} tabs - 该分组内的Tab列表
 * @param {Function} onTabClick - Tab点击回调
 * @param {Function} onTabClose - Tab关闭回调
 * @param {Function} onTabContextMenu - Tab右键菜单回调
 * @param {Function} onGroupContextMenu - 分组右键菜单回调
 * @param {Function} onToggleGroup - 展开/折叠分组回调
 * @param {Function} onTabDragStart - 拖拽开始回调
 * @param {Object} tabScores - Tab可关闭指数映射
 * @param {Function} onQuickClose - 快速关闭回调
 * @param {Set} closingTabs - 正在关闭动画的Tab ID集合
 */
export default function GroupSection({
  group,
  tabs,
  onTabClick,
  onTabClose,
  onTabContextMenu,
  onGroupContextMenu,
  onToggleGroup,
  onTabDragStart,
  isDropTarget = false,
  tabScores = {},
  onQuickClose,
  closingTabs = new Set()
}) {
  const [draggingTabId, setDraggingTabId] = useState(null);

  // 处理拖拽开始
  const handleDragStart = (tab) => {
    setDraggingTabId(tab.id);
    onTabDragStart?.(tab);
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    setDraggingTabId(null);
  };

  // 根据屏幕宽度确定列数
  const getResponsiveClass = () => {
    // 默认使用160px宽度
    return 'grid-cols-[repeat(auto-fill,minmax(160px,1fr))]';
  };

  return (
    <div
      onDragOver={(e) => {
        if (draggingTabId) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }
      }}
      className={`
        group
        ${isDropTarget ? 'ring-2 ring-primary ring-dashed rounded-lg' : ''}
      `}
    >
      {/* 分组标题 */}
      <GroupHeader
        group={group}
        tabCount={tabs.length}
        isExpanded={group.isExpanded}
        onToggle={() => onToggleGroup?.(group.id)}
        onContextMenu={onGroupContextMenu}
        isDropTarget={isDropTarget && draggingTabId !== null}
      />

      {/* Tab卡片网格 */}
      {group.isExpanded && (
        <div
          className={`
            grid ${getResponsiveClass()}
            gap-3 p-3 pt-1
          `}
          onDragEnd={handleDragEnd}
        >
          {tabs.map((tab) => (
            <TabCard
              key={tab.id}
              tab={tab}
              onClick={onTabClick}
              onClose={onTabClose}
              onContextMenu={onTabContextMenu}
              onDragStart={handleDragStart}
              isDragging={draggingTabId === tab.id}
              closeScore={tabScores[tab.id]}
              onQuickClose={onQuickClose}
              isClosing={closingTabs.has(tab.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

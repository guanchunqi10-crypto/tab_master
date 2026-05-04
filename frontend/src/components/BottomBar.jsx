import React from 'react';

function Section({ title, icon, items, onItemClick, onItemClose, emptyText }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-semibold text-[#1E1B4B]">{title}</h3>
      </div>
      
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {items.length > 0 ? (
          items.slice(0, 6).map((item, index) => (
            <div key={item.id || index} className="flex-shrink-0 w-[100px]">
              <MiniTabCard 
                item={item} 
                onClick={() => onItemClick?.(item)}
                onClose={onItemClose ? () => onItemClose(item) : undefined}
              />
            </div>
          ))
        ) : (
          <div className="text-sm text-[#9CA3AF] py-4">{emptyText}</div>
        )}
        
        {items.length > 6 && (
          <div className="flex-shrink-0 text-xs text-[#9CA3AF] py-4">
            +{items.length - 6} 更多
          </div>
        )}
      </div>
    </div>
  );
}

function MiniTabCard({ item, onClick, onClose }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div
      className="glass rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md relative group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`
            absolute top-1 right-1 w-5 h-5 rounded-full 
            flex items-center justify-center transition-all
            ${isHovered ? 'opacity-100' : 'opacity-0'}
            hover:bg-red-100 hover:text-red-500 bg-white/80
          `}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className="w-6 h-6 rounded mb-2 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
        <span className="text-white text-xs font-semibold">
          {item.title?.charAt(0)?.toUpperCase() || '?'}
        </span>
      </div>
      
      <p 
        className="text-xs text-[#1E1B4B] truncate font-medium"
        title={item.title}
      >
        {item.title || '无标题'}
      </p>
    </div>
  );
}

export default function BottomBar({
  recentlyClosed = [],
  frequentTabs = [],
  onRestoreTab,
  onOpenFrequentTab,
  onRemoveFromRecentlyClosed
}) {
  return (
    <div className="bottom-bar fixed bottom-0 left-0 right-0 px-6 py-4 z-40">
      <div className="flex items-start gap-8 max-w-full">
        <Section
          title="最近关闭"
          icon="⏪"
          items={recentlyClosed}
          onItemClick={(item) => onRestoreTab?.(item)}
          onItemClose={onRemoveFromRecentlyClosed}
          emptyText="暂无关闭记录"
        />

        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D1D5DB] to-transparent flex-shrink-0" />

        <Section
          title="最常访问"
          icon="📊"
          items={frequentTabs}
          onItemClick={(item) => onOpenFrequentTab?.(item)}
          emptyText="数据不足"
        />
      </div>
    </div>
  );
}

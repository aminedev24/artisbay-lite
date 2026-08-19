import { useEffect, useRef } from 'react';
import ScrollToTop from './scrollToTop';

export default function WidgetDock() {
  const dockRef = useRef(null);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const align = () => {
      const root = document.querySelector('#aurora-widget-root');
      if (!root) return false;

      // Find the actual rendered toggle button inside the widget
      const btn = root.querySelector('button') || root.querySelector('[role="button"]');
      const target = btn || root;
      const rect = target.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return false;

      const fromRight = window.innerWidth - rect.right;
      const fromBottom = window.innerHeight - rect.top + 10;

      dock.style.right  = fromRight + 'px';
      dock.style.bottom = fromBottom + 'px';
      dock.style.width  = rect.width + 'px';
      return true;
    };

    const interval = setInterval(() => {
      if (align()) clearInterval(interval);
    }, 300);

    const timeout = setTimeout(() => clearInterval(interval), 15000);
    window.addEventListener('resize', align);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener('resize', align);
    };
  }, []);

  return (
    <div ref={dockRef} className="widget-dock">
      <ScrollToTop />
    </div>
  );
}

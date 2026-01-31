'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraggableWindowProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  zIndex: number;
  onFocus: () => void;
}

export default function DraggableWindow({ title, children, isOpen, onClose, initialPosition = { x: 50, y: 50 }, zIndex, onFocus }: DraggableWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent drag from starting on button click
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    onFocus();
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  // Effect to handle dragging logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !windowRef.current) return;
      const parentRect = windowRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      let newX = e.clientX - dragStartPos.current.x;
      let newY = e.clientY - dragStartPos.current.y;
      
      // Clamp to parent boundaries to prevent dragging off-screen
      newX = Math.max(0, Math.min(newX, parentRect.width - windowRef.current.offsetWidth));
      newY = Math.max(0, Math.min(newY, parentRect.height - windowRef.current.offsetHeight));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartPos]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className="absolute pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex,
        width: 'clamp(350px, 25vw, 450px)',
        height: 'clamp(300px, 35vh, 400px)',
      }}
      onMouseDown={onFocus}
    >
      <Card className="h-full w-full border-primary bg-black/80 backdrop-blur-sm flex flex-col resize-both overflow-auto shadow-lg shadow-primary/20">
        <CardHeader
          className="p-1 border-b border-primary/50 flex flex-row items-center justify-between cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h3 className="font-bold font-headline text-sm pl-2 select-none">{title}</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/20" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <div className="p-0 flex-grow relative overflow-hidden">
          {children}
        </div>
      </Card>
    </div>
  );
}

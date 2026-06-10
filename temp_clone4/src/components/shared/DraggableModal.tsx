import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  className?: string;
}

export function DraggableModal({
  isOpen,
  onClose,
  title,
  children,
  width = 'max-w-2xl',
  className
}: DraggableModalProps) {
  const nodeRef = useRef(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <Draggable nodeRef={nodeRef} handle=".modal-handle">
            <div 
              ref={nodeRef}
              className={clsx(
                "bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col w-full",
                width,
                className
              )}
            >
              {/* Header / Handle */}
              <div className="modal-handle cursor-move bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">
                  {title}
                </h3>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </div>
          </Draggable>
        </div>
      )}
    </AnimatePresence>
  );
}

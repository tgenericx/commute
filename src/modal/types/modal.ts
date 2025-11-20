export interface DragBind {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export interface UseDragToCloseReturn {
  dragY: number;
  isDragging: boolean;
  bind: DragBind;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isDismissable?: boolean;
  size?: 'small' | 'medium' | 'large' | 'full';
  scrollBehavior?: 'inside' | 'outside';
  showCloseButton?: boolean;
  preventBackdropScroll?: boolean;
  dragThreshold?: number;
  animationDuration?: number;
  backdropClassName?: string;
  modalClassName?: string;
}

export interface UseDragToCloseProps {
  dismissable: boolean;
  threshold: number;
  onClose?: () => void;
}

export interface DragState {
  dragY: number;
  isDragging: boolean;
  startY: number;
}

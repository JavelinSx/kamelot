// types/modal.ts

export interface ModalState {
  isOpen: boolean;
  component?: Component | any;
  props?: Record<string, any>;
  persistent?: boolean;
  backdrop?: boolean;
  keyboard?: boolean;
  size?: ModalSize;
  position?: ModalPosition;
  zIndex?: number;
}

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type ModalPosition = "center" | "top" | "bottom" | "left" | "right";

export interface ModalOptions {
  persistent?: boolean;
  backdrop?: boolean;
  keyboard?: boolean;
  size?: ModalSize;
  position?: ModalPosition;
  zIndex?: number;
  closeOnRouteChange?: boolean;
}

export interface ModalProps {
  modelValue?: boolean;
  size?: ModalSize;
  position?: ModalPosition;
  persistent?: boolean;
  backdrop?: boolean;
  keyboard?: boolean;
  zIndex?: number;
  transition?: string;
  overlayClass?: string;
  contentClass?: string;
}

// Предустановленные модальные окна
export interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "warning" | "error" | "success";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface AlertModalProps {
  title: string;
  message: string;
  type?: "info" | "warning" | "error" | "success";
  confirmText?: string;
  onConfirm?: () => void;
}

export interface PromptModalProps {
  title: string;
  message?: string;
  placeholder?: string;
  inputType?: "text" | "email" | "password" | "number";
  defaultValue?: string;
  required?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (value: string) => void | Promise<void>;
  onCancel?: () => void;
}

// Типы для модального менеджера
export interface ModalManagerEntry {
  id: string;
  state: ModalState;
}

export interface ModalContext {
  modalId: string;
  close: () => void;
  props: Record<string, any>;
}

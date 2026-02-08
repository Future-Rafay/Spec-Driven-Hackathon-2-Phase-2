/**
 * UI state types for modals and notifications
 */

export interface ModalState {
  isOpen: boolean
  data?: any              // Modal-specific data (e.g., task to edit)
}

export interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
}

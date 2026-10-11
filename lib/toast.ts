import toast from 'react-hot-toast';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Show a toast message
 */
export const showToast = (
  message: string,
  type: ToastType = 'info',
  duration: number = 5000
) => {
  switch (type) {
    case 'success':
      toast.success(message, { duration });
      break;
    case 'error':
      toast.error(message, { duration });
      break;
    case 'warning':
      toast(message, { duration, style: { background: '#fbbf24', color: '#000' } });
      break;
    case 'info':
    default:
      toast(message, { duration });
      break;
  }
};

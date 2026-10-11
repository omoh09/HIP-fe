declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'react-datepicker/dist/react-datepicker.css';


declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void; ux_mode?: 'popup' | 'redirect'; auto_select?: boolean; cancel_on_tap_outside?: boolean }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export {};

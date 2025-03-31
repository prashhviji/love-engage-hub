
// Declare Electron interface
interface Window {
  electron?: {
    showNotification: (notification: { title: string; body: string }) => void;
  };
}

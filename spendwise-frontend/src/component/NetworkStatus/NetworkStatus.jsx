import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './networkStatus.css';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [toastId, setToastId] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (toastId) {
        toast.dismiss(toastId); 
        setToastId(null); 
      }
      toast.success('You are back online', {
        className: 'network-toast',
        autoClose: 2000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (!toast.isActive(toastId)) {
        const id = toast.error('Network disconnected', {
          className: 'network-toast',
          autoClose: false,
        });
        setToastId(id);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toastId]);

  return null;
};

export default NetworkStatus;

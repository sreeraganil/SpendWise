import { Navigate } from 'react-router-dom';
import useStore from '../store/zustand';

const GuestRoute = ({ children }) => {
  const user = useStore(state => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;

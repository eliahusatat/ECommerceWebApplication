//store
import { useSelector } from 'react-redux';

//style
import './Loader.css';




const Loader = () => {
  const { isVisible } = useSelector(state => state.loader);

  if (!isVisible) return null;

  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;

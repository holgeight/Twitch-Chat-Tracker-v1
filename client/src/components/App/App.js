import { Routes, Route } from 'react-router-dom';
import styles from './styles.module.css';
import { Header, Messages } from 'components';

export const App = () => {
  return (
    <div className={styles.main}>
      <div className={styles.text}>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/:userId/messages" element={<Messages />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

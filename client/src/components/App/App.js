import { useState } from 'react';
import styles from './styles.module.css';
import Axios from 'axios';
import { Header } from 'components';

export const App = () => {
  const [user, setUser] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);

  const addUser = () => {
    Axios.post('http://localhost:3001/create', {
      userName: user,
    }).then(() => console.log('success'));
  };

  const getMessages = user => {
    Axios.get('http://localhost:3001/messages', {
      params: {
        user: user,
      },
    }).then(
      response => setMessageList(response.data),
      console.log(messageList),
    );
  };

  const getUsers = () => {
    Axios.get('http://localhost:3001/users').then(
      response => setUserList(response.data),
      console.log(messageList),
    );
  };

  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.text}>
        <h2>
          {' '}
          Please enter the Twitch account you'd like to track below{' '}
        </h2>
        <div className={styles.form}>
          <label>Twitch Account Name:</label>
          <input
            type="text"
            onChange={event => {
              setUser(event.target.value);
            }}
          />
          <button onClick={addUser}> Track User</button>
          <hr />
          <div>
            <button onClick={getUsers}>Show Users</button>
            {userList.map((val, key) => {
              return (
                <div>
                  <button onClick={() => getMessages(val.username)}>
                    {val.username}{' '}
                  </button>
                </div>
              );
            })}
          </div>
          <div>
            {messageList.length
              ? messageList.map((val, key) => {
                  return <div> {val.message} </div>;
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

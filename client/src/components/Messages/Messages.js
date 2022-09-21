import styles from './styles.module.css';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMessageList,
  liveMessageUpdateAsync,
  getMessageListAsync,
} from 'features/messagesSlice';
import { io } from 'socket.io-client';
import { WordCloudMemo, Sentiment } from 'components';
import classNames from 'classnames';

export const Messages = () => {
  let socket;

  let location = useLocation();
  let currentUser = location.state.name;
  let id = location.state.id;

  useEffect(() => {
    socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });
    dispatch(getMessageListAsync(currentUser, id));
  }, [id]);

  const dispatch = useDispatch();
  let currentMessages = useSelector(state => state.messages.messageList);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [currentMessages]);

  useEffect(() => {
    socket.on(`${currentUser}`, data => {
      dispatch(liveMessageUpdateAsync(currentUser, id));
    });
  }, [socket]);

  return (
    <div className={styles.main}>
      <h1>
        {' '}
        You have tracked {currentMessages.length} messages in {currentUser}
        's chat
      </h1>

      <div className={styles.rowgrid}>
        <div>
          {currentMessages.length > 0 ? (
            <Sentiment />
          ) : (
            'Grabbing messages'
          )}
        </div>
        <div className={styles.chatmessages}>
          {currentMessages.map((val, key) => {
            {
              /* console.log('messagesjs', val); */
            }
            let sentimentClass;
            if (val.sentiment > 0) sentimentClass = styles.positive;
            else if (val.sentiment < 0) sentimentClass = styles.negative;
            else sentimentClass = styles.neutral;
            {
              /* console.log(sentimentClass); */
            }
            return (
              <div>
                <hr />
                <div key={val.messages_id}>
                  {' '}
                  <span
                    className={classNames(styles.text, sentimentClass)}
                  >
                    {' '}
                    <p>{val.message}</p>{' '}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.wordcloud}>
          {currentMessages.length > 0 ? (
            <WordCloudMemo user={currentUser} id={id} />
          ) : (
            'Grabbing messages'
          )}
        </div>
      </div>
    </div>
  );
};

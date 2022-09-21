import styles from './styles.module.css';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMessageList,
  liveMessageUpdateAsync,
  getMessageListAsync,
  showMessageList,
} from 'features/messagesSlice';
import { io } from 'socket.io-client';
import { current } from 'immer';
import { store } from 'store';
import { WordCloudMemo } from 'components';
import { TagCloud } from 'react-tagcloud';
import classNames from 'classnames';

export const Sentiment = () => {
  let totalMessages = useSelector(showMessageList);
  console.log(totalMessages, ' setn total');
  const [overallSentiment, setOverallSentiment] = useState(0);
  const [positiveSentiment, setPositiveSentiment] = useState(0);
  const [negativeSentiment, setNegativeSentiment] = useState(0);

  useEffect(() => {
    console.log('SENTIMENT', totalMessages);
    setOverallSentiment(0);
    setPositiveSentiment(0);
    setNegativeSentiment(0);
    totalMessages.forEach(el => {
      console.log('Sentiment analysis', el.sentiment);
      setOverallSentiment(prev => (prev += el.sentiment));
      if (el.sentiment > 0) setPositiveSentiment(prev => (prev += 1));
      if (el.sentiment < 0) setNegativeSentiment(prev => (prev += 1));
      console.log(overallSentiment);
    });
  }, [totalMessages]);

  return (
    <div className={styles.main}>
      <h2> You have tracked {totalMessages.length} </h2>
      <div>
        {' '}
        <p>
          {' '}
          You have an overall{' '}
          {overallSentiment > 0 ? 'Positive' : 'Negative'} sentiment with{' '}
          {positiveSentiment} positive messages and {negativeSentiment}{' '}
          negative messages.
        </p>
      </div>
    </div>
  );
};

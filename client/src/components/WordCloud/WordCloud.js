import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import styles from './styles.module.css';

import { TagCloud } from 'react-tagcloud';

export const WordCloud = (user, id) => {
  const [data, setData] = useState([]);

  const hash = {};
  // console.log('id', id, 'user', user);

  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get(
          'http://localhost:3001/messages',
          {
            params: {
              id: user.id,
            },
          },
        );
        console.log('useEffect async wC', response);
        if (response.status === 200) {
          setData([]);
          // console.log(user, id);
          let currentMessages = response.data;

          for (let i = 0; i < currentMessages.length; i++) {
            currentMessages[i].message.split(' ').forEach(el => {
              hash[el] = (hash[el] || 0) + 1;
            });
          }
          let counter = 0;
          for (const prop in hash) {
            if (
              hash[prop] > 10 &&
              prop.length > 1 &&
              prop !== 'is' &&
              prop !== 'to' &&
              prop !== 'it' &&
              prop !== 'of' &&
              prop !== 'in' &&
              prop !== 'are' &&
              prop !== 'you' &&
              prop !== 'the' &&
              prop !== 'so' &&
              prop !== 'or' &&
              prop !== 'on' &&
              prop !== 'be' &&
              prop !== 'at' &&
              prop !== 'do' &&
              prop !== 'my' &&
              prop !== 'and' &&
              prop !== 'if'
            ) {
              let newObj = {
                value: prop,
                count: hash[prop],
                key: String(counter),
              };
              setData(oldArr => [...oldArr, newObj]);
              counter++;
              // console.log('setstate data', data);
              // console.log(user);
            }
          }
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    })();
  }, [user]);

  data.sort((a, b) => (a.count < b.count ? 1 : -1));
  data.splice(50);
  // console.log(data);
  const SimpleCloud = () => {
    if (data.length > 0) {
      return (
        <div>
          <TagCloud
            minSize={20}
            maxSize={55}
            tags={data}
            shuffle={false}
          />
        </div>
      );
    } else {
      return (
        <div>
          <h2> Not enough data to render wordcloud </h2>
        </div>
      );
    }
  };

  return (
    <div className={styles.main}>
      <h2> Most common words </h2>{' '}
      <TagCloud minSize={20} maxSize={100} tags={data} shuffle={false} />
    </div>
  );
};

export const WordCloudMemo = React.memo(WordCloud);

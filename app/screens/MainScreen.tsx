'use client';
import { Star } from '@gravity-ui/icons';
import { Card, Button, Text, Icon, Label } from '@gravity-ui/uikit';
import React, { useCallback } from 'react';
import { $userData, navigateTo } from '../model';
import { useUnit } from 'effector-react';
import { tapMana } from '../actions';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { SHARING_MESSAGE } from '../constants';
import { app } from '@/shared/firebase';

const MainScreen: React.FC = () => {
  const userData = useUnit($userData);
  const analytics = getAnalytics(app);

  if (!userData) return;

  const userId = userData.id;
  const username = userData.username;

  const shareLink = useCallback(() => {
    logEvent(analytics, 'share', {
      method: 'Telegram',
      content_type: 'miniapp',
    });
    const url = encodeURI(
      `https://t.me/vself_bot/prestable?startapp=${userId}`
    );
    const text = encodeURI(SHARING_MESSAGE); //
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    navigator.clipboard.writeText(
      `https://t.me/vself_bot/prestable?startapp=${userId}`
    );
  }, [userId]);

  // let gravitySensor = new GravitySensor({ frequency: 60 });

  // gravitySensor.addEventListener('reading', (e) => {
  //   console.log(`Gravity along the X-axis ${gravitySensor.x}`);
  //   console.log(`Gravity along the Y-axis ${gravitySensor.y}`);
  //   console.log(`Gravity along the Z-axis ${gravitySensor.z}`);
  // });

  // gravitySensor.start();

  // const acl = new Accelerometer({ frequency: 60 });
  // acl.addEventListener('reading', () => {
  //   console.log(`Acceleration along the X-axis ${acl.x}`);
  //   console.log(`Acceleration along the Y-axis ${acl.y}`);
  //   console.log(`Acceleration along the Z-axis ${acl.z}`);
  // });

  // acl.start();

  // const handleOrientation = (event: any) => {
  //   const absolute = event.absolute;
  //   const alpha = event.alpha;
  //   const beta = event.beta;
  //   const gamma = event.gamma;
  //   //...
  //   console.log(absolute, alpha, beta, gamma);
  // };

  // window.addEventListener('deviceorientation', handleOrientation, true);

  return (
    <>
      <Text>{}</Text>
    </>
  );
};

export default MainScreen;

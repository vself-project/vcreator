import React from 'react';
import { navigateTo } from './model';
import { House } from '@gravity-ui/icons';
import { Button, Icon } from '@gravity-ui/uikit';

const HomeButton: React.FC = () => {
  return (
    <div className=''>
      <Button
        onClick={() => {
          navigateTo('main')
        }}
      >
        <Icon data={House} />
      </Button>
    </div>
  );
};

export default HomeButton;
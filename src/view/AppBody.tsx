import React from 'react';
import { Ketcher } from './Ketcher';

export const AppBody = React.memo(function() {
  return (
    <div>
      <Ketcher />
    </div>
  );
});

import React from 'react';
import { Footer, Header } from '@aglet/components';

import style from './app.container.style.scss';


export default function AppContainer() {
  return (
    <div className={style.container}>
      <Header />
      <div>HUNTER GATHER</div>
      <Footer repo={'https://github.com/luetkemj/aglet-hunter-gatherer/'} />
    </div>
  );
}

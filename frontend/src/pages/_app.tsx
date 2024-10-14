import { useEffect, useState } from 'react';

import '@/styles/globals.css';

import { Wallet, NearContext } from '@/wallets/near';
import { NetworkId } from '@/config';

const wallet = new Wallet({ networkId: NetworkId, createAccessKeyFor:undefined });

export default function MyApp({ Component, pageProps }) {
  const [signedAccountId, setSignedAccountId] = useState('');

  useEffect(() => { wallet.startUp(setSignedAccountId) }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      <Component {...pageProps} />
    </NearContext.Provider>
  );
}
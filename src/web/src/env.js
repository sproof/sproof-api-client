const onlineIPFS ='https://ipfs.sproof.io/ipfs/';

const localHost = 'http://localhost:6001/';

export function isProduction ()
{
    return (process.env.NODE_ENV !== 'development')
}

export function getIPFSLink () {
   if (process.env.REACT_APP_HOST_SOURCE === 'online' || process.env.NODE_ENV !== 'development')
      return onlineIPFS;

  return `http://localhost:8081/ipfs/`
}

export function getHost () {
  if (process.env.NODE_ENV === 'development')
    return localHost;
  return ''
}

export function getWsHost (){
  if (process.env.REACT_APP_HOST_SOURCE === 'local' && process.env.NODE_ENV !== 'development')
    return `${localHost}:3001/`

  if (process.env.REACT_APP_HOST_SOURCE === 'online')
    return undefined;
  else if (process.env.NODE_ENV !== 'development') return undefined;

  return `${localHost}:3002/`
}

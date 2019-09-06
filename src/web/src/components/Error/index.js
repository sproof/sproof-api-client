import React from 'react';
import Typography from '@material-ui/core/Typography'

export default function Loading(props) {
  return (
    <Typography variant='h5'>
      {props.text}
    </Typography>
  );
}
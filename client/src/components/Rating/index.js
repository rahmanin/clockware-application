import React from 'react';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginTop: theme.spacing(1),
    },
  },
}));

export default function RatingStars({value, readOnly, precision, onChange, defaultValue}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Rating 
        name="evaluation" 
        defaultValue={defaultValue} 
        value={value}
        precision={precision} 
        readOnly={readOnly} 
        onChange={onChange}
      /> 
      ({!value ? "New" : value})
    </div>
  );
}
import React, { FunctionComponent } from 'react';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginTop: theme.spacing(1),
    },
  },
}));

interface Props {
  className?: string,
  value?: number,
  readOnly: boolean, 
  precision?: number, 
  onChange?: any, 
  defaultValue?: any
}

export const RatingStars: FunctionComponent<Props> = ({value, readOnly, precision, onChange, defaultValue}) => {
  const { t } = useTranslation('common')
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
      ({!value ? t("Rating.New") : value})
    </div>
  );
}
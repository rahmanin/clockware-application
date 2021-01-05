import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Calendar: FunctionComponent = () => {

  const { t } = useTranslation('common')

  return (
    <div className="calendar_wrapper">
      {t("Calendar.Here will be calendar")}<br />
      <a href='https://calendar.google.com/calendar/embed?src=kmdr3rc1pnjk3f2q4oa9505nj8%40group.calendar.google.com&ctz=Europe%2FKiev'>{t("Calendar.Open")} Google calendar</a>
    </div>
  );
};

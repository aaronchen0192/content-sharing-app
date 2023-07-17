import React from 'react';
import { useNavigate } from 'react-router-dom';
import { uid } from 'uid';

export default function New() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate(`/${uid(5)}`, { replace: true });
  }, [navigate]);

  return <div />;
}

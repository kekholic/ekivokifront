import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export default function useActivateAccount(activateLink: string) {
  const [isActivated, setIsActivated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const chekActivateLink = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/activate/${activateLink}`,
      );
      setIsActivated(data);
    } catch (error: any) {
      const { message } = error.response.data;
      setErrorMsg(message);
      // console.log(error);
    }
  }, [activateLink]);

  useEffect(() => {
    chekActivateLink();
  }, []);

  return { isActivated, errorMsg };
}

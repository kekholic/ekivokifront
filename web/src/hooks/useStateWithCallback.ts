import {
  SetStateAction,
  useCallback, useEffect, useRef, useState,
} from 'react';

const useStateWithCallback = (initialState: Array<null>) : Array<any> => {
  const [state, setState] = useState(initialState);

  const cbRef = useRef<any>(null);

  const updateState = useCallback((newState:SetStateAction<null[]>, cb : ()=>void) : void => {
    cbRef.current = cb;

    setState((prev) => (typeof newState === 'function' ? newState(prev) : newState));
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);

      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState];
};

export default useStateWithCallback;

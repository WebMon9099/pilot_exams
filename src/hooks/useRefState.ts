import { useEffect, useRef, useState } from 'react';

function useRefState<T>(
  initialState: T
): [T, React.Dispatch<React.SetStateAction<T>>, React.MutableRefObject<T>] {
  const stateRef = useRef<T>(initialState);

  const [state, setState] = useState(initialState);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return [state, setState, stateRef];
}

export default useRefState;

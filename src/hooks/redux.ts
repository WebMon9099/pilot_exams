import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from 'react-redux';
import { AppDispatch, RootState } from '../redux';

export const useDispatch: () => AppDispatch = _useDispatch;

export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;

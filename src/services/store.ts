import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import ingredientsReducer from './ingredientsSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = {
  auth: authReducer, // Редьюсер для управления состоянием аутентификации
  ingredients: ingredientsReducer // Редьюсер для управления состоянием ингредиентов
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

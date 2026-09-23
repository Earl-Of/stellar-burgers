import { RootState } from './store';

// селекторы для аутентификации:
export const isAuthCheckedSelector = (state: RootState) =>
  state.auth.isAuthChecked;
export const userDataSelector = (state: RootState) => state.auth.user;

// селекторы для ошибки и загрузки логина:
export const loginErrorSelector = (state: RootState) => state.auth.loginError;
export const loginLoadingSelector = (state: RootState) =>
  state.auth.loginLoading;

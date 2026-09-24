import { RootState } from './store';

// селекторы для аутентификации:
export const isAuthCheckedSelector = (state: RootState) =>
  state.auth.isAuthChecked;
export const userDataSelector = (state: RootState) => state.auth.user;

// селекторы для ошибки и загрузки логина:
export const loginErrorSelector = (state: RootState) => state.auth.loginError;
export const loginLoadingSelector = (state: RootState) =>
  state.auth.loginLoading;

// Ингредиенты
export const ingredientsSelector = (state: RootState) =>
  state.ingredients.items;
export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients.loading;
export const ingredientsErrorSelector = (state: RootState) =>
  state.ingredients.error;
// Конструктор
export const constructorItemsSelector = (state: RootState) =>
  state.burgerConstructor;

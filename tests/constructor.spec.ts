import { test, expect } from '@playwright/test';

// список констант для тестов
const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = '12345';
const SAUCE_NAME = 'Соус Spicy-X';

test.describe('Тестирование Конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('refreshToken', 'mockedRefreshToken');
    });
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'mockedAccessToken',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.routeFromHAR('./tests/hars/auth-user.har', {
      url: '**/api/auth/user',
      update: false
    });
    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false
    });
    await page.routeFromHAR('./tests/hars/orders-all.har', {
      url: '**/api/orders/all',
      update: false
    });

    await page.goto('/');
    await page.getByText(BUN_NAME).first().waitFor({ state: 'visible' });
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    await page
      .locator('li', { hasText: BUN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li', { hasText: MAIN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(
      page
        .getByTestId('constructor-ingredients')
        .getByText(`${BUN_NAME} (верх)`)
    ).toBeVisible();
    await expect(
      page.getByTestId('constructor-ingredients').getByText(`${BUN_NAME} (низ)`)
    ).toBeVisible();
    await expect(
      page.getByTestId('constructor-ingredients').getByText(MAIN_NAME)
    ).toBeVisible();
  });

  test('открытие модального окна выбранного ингредиента (соус, не первый в списке)', async ({
    page
  }) => {
    await page.locator('li', { hasText: SAUCE_NAME }).getByRole('link').click();

    const modal = page.getByTestId('modal');

    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await expect(modal.getByText(SAUCE_NAME)).toBeVisible();

    // данные именно соуса: калории, белки, жиры, углеводы
    await expect(modal).toContainText('77');
    await expect(modal).toContainText('31');
    await expect(modal).toContainText('22');
    await expect(modal).toContainText('43');

    // других ингредиентов в модалке нет
    await expect(modal.getByText(BUN_NAME)).not.toBeVisible();
    await expect(modal.getByText(MAIN_NAME)).not.toBeVisible();
  });

  test('закрытие модального окна по крестику', async ({ page }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();

    await expect(
      page.getByTestId('modal').getByText('Детали ингредиента')
    ).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('закрытие модального окна по оверлею', async ({ page }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();

    await expect(
      page.getByTestId('modal').getByText('Детали ингредиента')
    ).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 }
    });

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('создание заказа', async ({ page }) => {
    await page
      .locator('li', { hasText: BUN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li', { hasText: MAIN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(
      page.getByTestId('modal').getByText(ORDER_NUMBER)
    ).toBeVisible();
    await expect(
      page.getByTestId('modal').getByText('идентификатор заказа')
    ).toBeVisible();

    await expect(
      page
        .getByTestId('constructor-ingredients')
        .getByText('Выберите булки')
        .first()
    ).toBeVisible();
    await expect(
      page
        .getByTestId('constructor-ingredients')
        .getByText('Выберите булки')
        .nth(1)
    ).toBeVisible();
    await expect(
      page.getByTestId('constructor-ingredients').getByText('Выберите начинку')
    ).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByText(ORDER_NUMBER)).not.toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });
});

import { expect, test as setup } from '@playwright/test';
import { fullUserMock } from 'src/tests/mocks/mocks';
setup('clean localhost', async ({ request }) => {
  console.log('Cleaning localhost...');
  const loginResponse = await request.post(
    'http://localhost:3000/api/auth/signin',
    {
      data: {
        usernameOrEmail: fullUserMock.username,
        password: fullUserMock.password,
      },
    }
  );

  const authToken = JSON.parse(await loginResponse.text()).token;

  const cleanLocalhostResponse = await request.post(
    'http://localhost:3000/api/environment/reset',
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  console.log('Clean localhost response:', cleanLocalhostResponse.status());
  expect(cleanLocalhostResponse.status()).toBe(200);
});

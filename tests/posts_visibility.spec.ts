import { test, expect } from '@playwright/test';

test('Post is invisible for another user on Main Page', async ({ page }) => {
  // User: Sign up

  await page.goto('http://localhost/sign_up.php');

  const username = 'new_test_user_' + +new Date();

  await page.getByRole('textbox', { name: 'name' }).fill(username);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('123');
  await page.getByRole('textbox', { name: 'Repeat Password' }).fill('123');

  await page.getByRole('button', { name: 'submit' }).click();

  // Post: Create

  const post = {
    title: 'random_title_' + +new Date(),
    content: 'lorem ipsum',
  };

  await page.getByRole('textbox', { name: 'title' }).fill(post.title);
  await page.getByRole('textbox', { name: 'content' }).fill(post.content);

  await page.getByRole('button', { name: 'submit' }).click();

  // Post: Read

  const newPostId = await page.getByTestId('post_id').textContent();
  const title = await page.getByTestId('post_title').textContent();
  const content = await page.getByTestId('post_content').textContent();

  expect(title).toBe(post.title);
  expect(content).toBe(post.content);

  await expect(page.locator(`#post_${newPostId}`)).toBeVisible();

  // Post: Try read by admin

  await page.goto('http://localhost/sign_in.php');

  await page.getByRole('textbox', { name: 'name' }).fill('admin');
  await page.getByRole('textbox', { name: 'password' }).fill('admin');

  await page.getByRole('button', { name: 'submit' }).click();

  await expect(page).toHaveURL('http://localhost/');

  await expect(page.locator(`#post_${newPostId}`)).not.toBeVisible();

  // Post: Delete by admin

  await page.getByText('Admin Panel').click();
  await page.getByTestId(`delete_post_${newPostId}`).click();

  // User: Delete (also by admin)

  await page.getByTestId(`delete_user_${username}`).click();
});
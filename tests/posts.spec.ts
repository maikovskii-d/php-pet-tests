import { test, expect } from '@playwright/test';

test('Post (Create, Read, Update, Delete)', async ({ page }) => {
  // User: Sign up

  await page.goto('http://localhost/page_sign_up.php');

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

  const title = await page.getByTestId('post_title').textContent();
  const content = await page.getByTestId('post_content').textContent();

  expect(title).toBe(post.title);
  expect(content).toBe(post.content);

  // Post: Update

  await page.getByRole('button', { name: 'edit' }).click();

  await page.getByRole('textbox', { name: 'title' }).fill(`${post.title} UPDATED`);
  await page.getByRole('textbox', { name: 'content' }).fill(`${post.content} UPDATED`);

  await page.getByRole('button', { name: 'submit' }).click();

  const titleUpdated = await page.getByTestId('post_title').textContent();
  const contentUpdated = await page.getByTestId('post_content').textContent();

  expect(titleUpdated).toBe(`${post.title} UPDATED`);
  expect(contentUpdated).toBe(`${post.content} UPDATED`);

  // Post: Delete

  const newPostId = await page.getByTestId('post_id').textContent();

  await expect(page.locator(`#post_${newPostId}`)).toBeVisible();

  await page.getByRole('button', { name: 'delete' }).click();

  await expect(page.locator(`#post_${newPostId}`)).not.toBeVisible();

  // User: Delete

  await page.goto('http://localhost/page_sign_in.php');

  await page.getByRole('textbox', { name: 'name' }).fill('admin');
  await page.getByRole('textbox', { name: 'password' }).fill('admin');

  await page.getByRole('button', { name: 'submit' }).click();

  await page.getByText('Admin Panel').click();
  await page.getByTestId(`delete_user_${username}`).click();
});


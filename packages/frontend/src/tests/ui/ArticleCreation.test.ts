import { browser, $ } from '@wdio/globals';

describe('Article Creation', () => {
    it('should allow creating a new article', async () => {
      // Navigate to the article creation form
      await browser.url('/articles/new');
      
      // Wait for the form to load
      const titleInput = await $('#title');
      await titleInput.waitForDisplayed();
      
      // Fill out the form
      await titleInput.setValue('UI Test Article');
      await $('#author').setValue('UI Test Author');
      await $('#content').setValue('This article was created during a UI test.');
      
      // Add a tag
      await $('#tags').setValue('ui-test');
      await $('button=Add').click();
      
      // Submit the form
      await $('button=Create Article').click();
      
      // Wait for redirection to articles list
      await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/articles'),
        { timeout: 5000, timeoutMsg: 'Expected to be redirected to articles page' }
      );
      
      // Verify the article was created and is displayed in the list
      const articleTitle = await $('=UI Test Article');
      await expect(articleTitle).toBeDisplayed();
      
      // Verify other details
      const articleAuthor = await $('=UI Test Author');
      await expect(articleAuthor).toBeDisplayed();
      
      const articleTag = await $('=ui-test');
      await expect(articleTag).toBeDisplayed();
    });
  });
Feature: Article Management
  As a content creator
  I want to manage my articles
  So that I can organize and share my content

  Scenario: Creating and viewing an article
    Given I am on the article creation page
    When I fill in the article form with the following details:
      | Field   | Value                     |
      | Title   | My First Article          |
      | Author  | BDD Tester                |
      | Content | This is a test article... |
      | Tags    | bdd, test, acceptance     |
    And I submit the article form
    Then I should be redirected to the articles list page
    And I should see the article "My First Article" in the list
    When I click on the article "My First Article"
    Then I should see the article details page
    And The article should display the correct information
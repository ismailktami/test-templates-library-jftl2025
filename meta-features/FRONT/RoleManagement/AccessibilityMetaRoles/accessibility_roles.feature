@MetaRoles
Feature:[METAROLES][Page Name]
  Scenario Outline:[METAROLES][Page Name][<user_role>] Expect <component_name> to <expected_state>
    Given a "INTERNALUSER_FFMBACKOFFICE_<user_role>" is logged
    When they navigate to the "Page Name" page
    And Execute setup "<setup>"
    Then the component with "<component_selector>" should "<expected_state>"
    Examples:
      | user_role | setup | component_name                 | component_selector                       | expected_state |
      | ADMIN     |       | add a new delivery mode button | [data-testid='add-delivery-mode-button'] | be.enabled     |
      | FULL      |       | add a new delivery mode button | [data-testid='add-delivery-mode-button'] | not.exist      |
      | RESTREINT |       | add a new delivery mode button | [data-testid='add-delivery-mode-button'] | not.exist      |
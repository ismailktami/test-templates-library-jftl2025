@Smoke
@DeliveryModes
@IDS
Feature: Check The Navigation To DeliveryModes Page
@TXRAY-56025
Scenario: Navigate to DeliveryModes page
    Given the user is logged
    When the user clicks on the redirect button DeliveryModes
    Then the user should be redirected to DeliveryModes page
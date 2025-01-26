testCases.forEach((testCase) => {
  it(testCase.testCaseName, () => {
    // Fill out the form fields
    testCase.inputs.forEach((field) => {
      cy.fillField(field); // Pass the entire field object
    });

    // Check the expectations for buttons
    testCase.expectations.forEach((expectation) => {
      for (const [buttonId, state] of Object.entries(expectation)) {
        if (state === "enabled") {
          cy.get(`#${buttonId}`).should('not.be.disabled');
        } else {
          cy.get(`#${buttonId}`).should('be.disabled');
        }
      }
    });
  });
});

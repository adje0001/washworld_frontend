// E2E Testing with Cypress — covers navigation, locations, search, auth forms

describe("Navbar", () => {
  it("shows the WashWorld logo and navigation links", () => {
    cy.visit("/");
    cy.get("nav").should("exist");
    cy.get('a[href="/locations"]').should("exist");
    cy.get('a[href="/signup"]').should("exist");
  });
});

describe("Locations page", () => {
  beforeEach(() => {
    cy.visit("/locations");
  });

  it("shows the page header", () => {
    cy.contains("Find vaskehal nær dig").should("be.visible");
  });

  it("loads and displays location cards", () => {
    cy.get('[class*="grid"]').children().should("have.length.greaterThan", 0);
  });

  it("shows Vis mere button when there are more than 4 locations", () => {
    cy.contains("Vis mere").should("be.visible");
  });

  it("shows all locations after clicking Vis mere and collapses on Vis mindre", () => {
    cy.contains("Vis mere").click();
    cy.contains("Vis mindre").should("be.visible");
    cy.contains("Vis mindre").click();
    cy.contains("Vis mere").should("be.visible");
  });

  it("filters locations when searching", () => {
    cy.get('[class*="grid"]').children().its("length").then((totalVisible) => {
      cy.get('input[placeholder*="Søg"]').type("a");
      cy.get('[class*="grid"]').children().its("length").should("be.lessThan", totalVisible + 1);
    });
  });

  it("shows empty state when search has no results", () => {
    cy.get('input[placeholder*="Søg"]').type("xyzingennavn123");
    cy.contains("Ingen vaskehaller matcher din søgning").should("be.visible");
  });

  it("resets to 4 cards when search is cleared", () => {
    cy.contains("Vis mere").click();
    cy.contains("Vis mindre").should("be.visible");
    cy.get('input[placeholder*="Søg"]').type("a").clear();
    cy.contains("Vis mere").should("be.visible");
  });
});

describe("Login page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("shows the login form", () => {
    cy.contains("Log ind").should("be.visible");
    cy.get('input[type="email"]').should("exist");
    cy.get('input[type="password"]').should("exist");
  });

  it("shows an error with wrong credentials", () => {
    cy.get('input[type="email"]').type("forkert@email.dk");
    cy.get('input[type="password"]').type("forkertpassword");
    cy.get('button[type="submit"]').click();
    cy.contains("Forkert email eller adgangskode", { timeout: 5000 }).should("be.visible");
  });
});

describe("Signup page", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("shows the signup form", () => {
    cy.contains("Opret konto").should("be.visible");
    cy.get('input[type="email"]').should("exist");
    cy.get('input[type="password"]').should("have.length", 2);
  });

  it("shows validation error when name is too short", () => {
    cy.get('input[placeholder="Fornavn"]').type("A");
    cy.get('input[type="email"]').type("test@test.dk");
    cy.get('input[placeholder="Adgangskode"]').type("password123");
    cy.get('input[placeholder="Bekræft adgangskode"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.contains("Fornavn skal være 2-20 tegn").should("be.visible");
  });

  it("shows validation error when passwords do not match", () => {
    cy.get('input[placeholder="Fornavn"]').type("Oliver");
    cy.get('input[type="email"]').type("test@test.dk");
    cy.get('input[placeholder="Adgangskode"]').type("password123");
    cy.get('input[placeholder="Bekræft adgangskode"]').type("andetpassword");
    cy.get('button[type="submit"]').click();
    cy.contains("Adgangskoder matcher ikke").should("be.visible");
  });
});

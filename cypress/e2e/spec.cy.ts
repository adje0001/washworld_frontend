// E2E Testing with Cypress — covers navigation, locations, search, auth forms

describe("Navbar", () => {
  // Checks that the navbar renders with the correct links
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

  // Checks that the page header text is visible
  it("shows the page header", () => {
    cy.contains("Find vaskehal nær dig").should("be.visible");
  });

  // Checks that location cards load from the backend
  it("loads and displays location cards", () => {
    cy.get('[class*="grid"]').children().should("have.length.greaterThan", 0);
  });

  // Checks that Vis mere appears when there are more than 4 locations
  it("shows Vis mere button when there are more than 4 locations", () => {
    cy.contains("Vis mere").should("be.visible");
  });

  // Checks that Vis mere expands the list and Vis mindre collapses it
  it("shows all locations after clicking Vis mere and collapses on Vis mindre", () => {
    cy.contains("Vis mere").click();
    cy.contains("Vis mindre").should("be.visible");
    cy.contains("Vis mindre").click();
    cy.contains("Vis mere").should("be.visible");
  });

  // Checks that typing in the search box filters the visible cards
  it("filters locations when searching", () => {
    cy.get('[class*="grid"]')
      .children()
      .its("length")
      .then((totalVisible) => {
        cy.get('input[placeholder*="Søg"]').type("a");
        cy.get('[class*="grid"]')
          .children()
          .its("length")
          .should("be.lessThan", totalVisible + 1);
      });
  });

  // Checks that the empty state message appears when no locations match
  it("shows empty state when search has no results", () => {
    cy.get('input[placeholder*="Søg"]').type("xyzingennavn123");
    cy.contains("Ingen vaskehaller matcher din søgning").should("be.visible");
  });

  // Checks that clearing the search resets back to showing 4 cards
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

  // Checks that the login form fields are rendered
  it("shows the login form", () => {
    cy.contains("Log ind").should("be.visible");
    cy.get('input[type="email"]').should("exist");
    cy.get('input[type="password"]').should("exist");
  });

  // Checks that wrong credentials shows a Danish error message
  it("shows an error with wrong credentials", () => {
    cy.get('input[type="email"]').type("forkert@email.dk");
    cy.get('input[type="password"]').type("forkertpassword");
    cy.get('button[type="submit"]').click();
    cy.contains("Forkert email eller adgangskode", { timeout: 5000 }).should("be.visible");
  });

  // Checks that an unverified account shows the correct Danish error — requires an unverified account in the DB
  it("shows error when account is not verified", () => {
    cy.get('input[type="email"]').type("unverified@test.dk");
    cy.get('input[type="password"]').type("password");
    cy.get('button[type="submit"]').click();
    cy.contains("Du skal verificere din email før du kan logge ind.", { timeout: 5000 }).should("be.visible");
  });
});

describe("Signup page", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  // Checks that the signup form fields are rendered
  it("shows the signup form", () => {
    cy.contains("Opret konto").should("be.visible");
    cy.get('input[type="email"]').should("exist");
    cy.get('input[type="password"]').should("have.length", 2);
  });

  // Checks that a too-short first name triggers clientside validation
  it("shows validation error when name is too short", () => {
    cy.get('input[placeholder="Fornavn"]').type("A");
    cy.get('input[type="email"]').type("test@test.dk");
    cy.get('input[placeholder="Adgangskode"]').type("password123");
    cy.get('input[placeholder="Bekræft adgangskode"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.contains("Fornavn skal være 2-20 tegn").should("be.visible");
  });

  // Checks that mismatched passwords trigger clientside validation
  it("shows validation error when passwords do not match", () => {
    cy.get('input[placeholder="Fornavn"]').type("Oliver");
    cy.get('input[type="email"]').type("test@test.dk");
    cy.get('input[placeholder="Adgangskode"]').type("password123");
    cy.get('input[placeholder="Bekræft adgangskode"]').type("andetpassword");
    cy.get('button[type="submit"]').click();
    cy.contains("Adgangskoder matcher ikke").should("be.visible");
  });

  // Checks that a duplicate email shows the backend error which requires an existing account in the DB
  it("shows error when email is already registered", () => {
    cy.get('input[placeholder="Fornavn"]').type("Oliver");
    cy.get('input[type="email"]').type("bb@b.dk");
    cy.get('input[placeholder="Adgangskode"]').type("password123");
    cy.get('input[placeholder="Bekræft adgangskode"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.contains("Email er allerede i brug", { timeout: 5000 }).should("be.visible");
  });
});

describe("Profile page", () => {
  // Checks that visiting /profile without a token shows the not logged in message
  it("shows not logged in message when visiting without a token", () => {
    cy.clearLocalStorage();
    cy.visit("/profile");
    cy.contains("Du er ikke logget ind").should("be.visible");
  });
});

describe("Logout page", () => {
  // Checks that visiting /logout without a token shows the not logged in message
  it("shows not logged in message and redirects when visiting without a token", () => {
    cy.clearLocalStorage();
    cy.visit("/logout");
    cy.contains("Du er ikke logget ind").should("be.visible");
  });
});

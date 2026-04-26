import Link from "next/link";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="https://bulma.io/images/bulma-logo.png" alt="Soon wash world" />
        </a>
      </div>
      <div className="navbar__links">
        <Link href="/">Home</Link>
        <Link href="/products">Bliv medlem</Link>
        <Link href="/products/crud">Log in</Link>
      </div>
    </nav>
  );
}

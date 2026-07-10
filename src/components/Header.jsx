import NavBar from './NavBar'

function Header({ name }) {
  return (
    <header>
      <h1>Student Portfolio</h1>
      <h2>Welcome, {name}!</h2>
      <NavBar />
    </header>
  );
}

export default Header;
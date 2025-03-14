import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 fixed w-full">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">My Portfolio</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-400">Home</Link>
          <Link to="/about" className="hover:text-gray-400">About</Link>
          <Link to="/projects" className="hover:text-gray-400">Projects</Link>
          <Link to="/experience" className="hover:text-gray-400">Experience</Link>
          <Link to="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

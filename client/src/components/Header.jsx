import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    if (searchTermFormUrl) {
      setSearchTerm(searchTermFormUrl);
    }
  }, [location.search]);
  return (
    <header className="bg-slate-200 shadow-md relative">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 gap-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Property</span>
            <span className="text-slate-700">Hub</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-2 sm:p-3 rounded-lg flex items-center flex-1 max-w-[220px] sm:max-w-xs"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="hidden sm:flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <li className=" text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-slate-700 text-xl p-2"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-200 shadow-md sm:hidden">
            <div className="flex flex-col p-5 gap-5">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-slate-700 font-medium"
              >
                Home
              </Link>

              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="text-slate-700 font-medium"
              >
                About
              </Link>

              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-slate-700 font-medium"
              >
                {currentUser ? "Profile" : "Sign in"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

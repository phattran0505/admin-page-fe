import { FiHome, FiFileText, FiSettings } from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom';
import { LuLayoutDashboard } from 'react-icons/lu';

import './Sidebar.scss';
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">VN</div>
        <h2 className="sidebar-title">Admin</h2>
      </div>
      <nav className="sidebar-nav" aria-label="Main">
        <ul className="sidebar-menu">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            <li>
              <LuLayoutDashboard className="icon" size={18} />
              <span>Dashboard</span>
            </li>
          </NavLink>
          <NavLink to="/news" className={({ isActive }) => (isActive ? 'active' : '')}>
            <li>
              <FiFileText className="icon" size={18} />
              <span>Tin tức</span>
            </li>
          </NavLink>
          <Link to="#">
            <li>
              <FiSettings className="icon" size={18} />
              <span>Cài đặt</span>
            </li>
          </Link>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;

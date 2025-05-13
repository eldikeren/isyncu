import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
  };

  return (
    <aside style={{ backgroundColor: '#1f1f1f', padding: '1rem', width: '200px', color: '#fff' }}>
      <h2>BandGo</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li onClick={() => handleNav('/schedule')}>Schedule</li>
        <li onClick={() => handleNav('/members')}>Members</li>
        <li onClick={() => handleNav('/venues')}>Venues</li>
        <li onClick={() => handleNav('/admin')}>Admin</li>
      </ul>
    </aside>
  );
};

export default Sidebar;

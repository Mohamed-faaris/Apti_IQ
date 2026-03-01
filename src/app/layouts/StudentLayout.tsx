import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../../shared/ui/Navbar';

export const StudentLayout = () => {
  const location = useLocation();
  const isTestActive = location.pathname === '/test/active';

  return (
    <div className="min-h-screen">
      {!isTestActive && <Navbar />}
      <main className={isTestActive ? '' : 'container mx-auto px-4 py-8'}>
        <Outlet />
      </main>
    </div>
  );
};

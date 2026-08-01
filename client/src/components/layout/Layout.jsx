import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import BottomNav from './BottomNav';
import MandatoryBetGate from '../bets/MandatoryBetGate';

export default function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <NavBar />
      <main className="flex-1 px-4 py-4">
        <Outlet />
      </main>
      <BottomNav />
      <MandatoryBetGate />
    </div>
  );
}

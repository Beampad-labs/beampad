import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import PresalesPage from './pages/PresalesPage';
import PresaleDetailPage from './pages/PresaleDetailPage';
import ManagePresalePage from './pages/ManagePresalePage';
import CreateTokenPage from './pages/CreateTokenPage';
import CreatePresalePage from './pages/CreatePresalePage';
import TokenLockerPage from './pages/TokenLockerPage';
import AirdropPage from './pages/AirdropPage';
import Staking from './pages/Staking';
import Tools from './pages/Tools';
import ProjectPage from './pages/ProjectPage';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/presales" element={<PresalesPage />} />
        <Route path="/presales/:address" element={<PresaleDetailPage />} />

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/presales/manage/:address" element={<ManagePresalePage />} />
          <Route path="/create/token" element={<CreateTokenPage />} />
          <Route path="/create/presale" element={<CreatePresalePage />} />
          <Route path="/tools/token-locker" element={<TokenLockerPage />} />
          <Route path="/tools/airdrop" element={<AirdropPage />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default AppRoutes;

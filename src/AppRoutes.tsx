import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import ProjectPage from './pages/ProjectPage';
import Staking from './pages/Staking';
import Tools from './pages/Tools';

import { useAccount } from 'wagmi';

const AppRoutes = () => {
  const { isConnected } = useAccount();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={isConnected ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/staking" element={<Staking />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default AppRoutes;

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/index.js';
import { supabase } from './lib/supabase.js';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import JobListings from './pages/JobListings.jsx';
import JobDetail from './pages/JobDetail.jsx';
import CompanyProfile from './pages/CompanyProfile.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import CompanyDashboard from './pages/CompanyDashboard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const { setSession, setProfile } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      useAuthStore.getState().setProfile(data);
    }
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/vagas" element={<JobListings />} />
          <Route path="/vagas/:id" element={<JobDetail />} />
          <Route path="/empresa/:slug" element={<CompanyProfile />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/empresa/dashboard" element={<CompanyDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

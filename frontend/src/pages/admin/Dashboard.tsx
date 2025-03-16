import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminMenu from '../../components/AdminMenu';
import Users from './Users';
import News from './News';
import NewsCreate from './NewsCreate';
import NewsEdit from './NewsEdit';
/* import EventsCreate from './EventsCreate'; */
import PromotionsCreate from './PromotionsCreate';
import PromotionsEdit from './PromotionsEdit';
/* import Events from './Events'; */
import Promotions from './Promotions';
/* import EventsEdit from './EventsEdit'; */

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const userRole = response.data.user.role;
        setRole(userRole);
        if (!['ADMIN', 'MODERATOR'].includes(userRole)) {
          navigate('/');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  if (!role) {
    return <div className="text-whiteText">Loading...</div>;
  }

  return (
    <div className="container px-4 py-8">
      <div className="w-full md:w-2/3 mx-auto">
        <AdminMenu role={role} />
        <div className="mt-4 bg-lightGray rounded-lg shadow-md p-6">
          <Routes>
            <Route path="/" element={<h1 className="text-3xl text-darkBg">Главная панель</h1>} />
            <Route path="/news" element={<News />} />
            <Route path="/news/create" element={<NewsCreate />} />
            <Route path="/news/edit/:slug" element={<NewsEdit />} /> 
{/*             <Route path="/events" element={<Events />} />
            <Route path="/events/create" element={<EventsCreate />} /> */}
        {/*     <Route path="/events/edit/:slug" element={<EventsEdit />} /> */}
            <Route path="/promotions" element={<Promotions />} />
        <Route path="/promotions/create" element={<PromotionsCreate />} />
          <Route path="/promotions/edit/:slug" element={<PromotionsEdit /> } />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
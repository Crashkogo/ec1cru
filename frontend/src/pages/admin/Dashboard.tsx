import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminMenu from '../../components/AdminMenu';
import Users from './Users';
import News from './News';
import AdminHome from './AdminHome'; // Импортируем новый компонент
import NewsCreate from './NewsCreate';
import NewsEdit from './NewsEdit';
import EventsCreate from './EventsCreate';
import PromotionsCreate from './PromotionsCreate';
import PromotionsEdit from './PromotionsEdit';
import Events from './Events';
import Promotions from './Promotions';
import EventsEdit from './EventsEdit';
import EventRegistrations from './EventRegistrations';
import ReadySolutions from './ReadySolutions'; // Новый компонент
import ReadySolutionsCreate from './ReadySolutionsCreate'; // Новый компонент
import ReadySolutionsEdit from './ReadySolutionsEdit'; // Новый компонент

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
          <Route path="/" element={<AdminHome />} /> 
            <Route path="/news" element={<News />} />
            <Route path="/news/create" element={<NewsCreate />} />
            <Route path="/news/edit/:slug" element={<NewsEdit />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/create" element={<EventsCreate />} />
            <Route path="/events/edit/:slug" element={<EventsEdit />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/promotions/create" element={<PromotionsCreate />} />
            <Route path="/promotions/edit/:slug" element={<PromotionsEdit />} />
            <Route path="/events/:slug/registrations" element={<EventRegistrations />} />
            <Route path="/users" element={<Users />} /> 
            <Route path="/ready-solutions" element={<ReadySolutions />} />
            <Route path="/ready-solutions/create" element={<ReadySolutionsCreate />} />
            <Route path="/ready-solutions/edit/:slug" element={<ReadySolutionsEdit />} />        
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Layout Component ---
import Layout from './components/Layout';
import Home from './components/Home';

// --- Imports from ./pages/navbarPages/ ---
import Login from './pages/navbarPages/Login';
import SignUp from './pages/navbarPages/SignUp';
import PostTicket from './pages/navbarPages/PostTicket';
import BusTicket from './pages/navbarPages/BusTicket';
import TrainTicket from './pages/navbarPages/TrainTicket';
import LoginSuccess from './pages/utilityPages/LoginSuccess';

// --- Imports from ./pages/homePages/ ---
import BookTicket from './pages/homePages/BookTicket';

// --- Imports from ./pages/utilityPages/ (NEW) ---
import PrivacyPolicy from './pages/utilityPages/PrivacyPolicy';
import TermsOfService from './pages/utilityPages/TermsOfService';
import ForgotPassword from './pages/utilityPages/ForgotPassword';
import ResetPassword from './pages/utilityPages/ResetPassword';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* The parent Layout Route renders the Navbar and Footer */}
        <Route path="/" element={<Layout />}>
          {/* All these child routes will render inside the Layout's <Outlet /> */}
          <Route index element={<Home />} />

          {/* Routes for navbarPages */}
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="login/success" element={<LoginSuccess />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="post-ticket" element={<PostTicket />} />
          <Route path="bus-tickets" element={<BusTicket />} />
          <Route path="train-tickets" element={<TrainTicket />} />

          {/* Route for homePages */}
          <Route path="book-ticket" element={<BookTicket />} />
          
          {/* Routes for utilityPages (from footer) */}
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
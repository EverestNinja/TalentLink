import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Feed from './pages/Feed/Feed';
import Resources from './pages/Resources/Resources';
import Jobs from './pages/Jobs/Jobs';
import PostJob from './pages/Jobs/PostJob';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import SignupPage from './pages/Login/signup';
import ProfileComplete from './pages/Profile/ProfileComplete';
import ProfileView from './pages/Profile/ProfileView';

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/68494fcdd1e41e190ca9b698/1itf5vfd2";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup on unmount
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/post" element={<PostJob />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile/complete" element={<ProfileComplete />} />
          <Route path="/profile" element={<ProfileView />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

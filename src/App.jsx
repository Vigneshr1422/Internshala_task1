import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Header from './components/header';
import Footer from './components/footer';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the toast CSS
import AddStudent from './pages/AddStudent';
import StudentList from './pages/StudentList';
import ShowDepartment from './pages/ShowDepartment';
import VisualizeData from './pages/VisualizeData';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-student" element={<AddStudent />} />
<Route path="/student-list" element={<StudentList />} />
 <Route path="/show-department" element={<ShowDepartment />} />
<Route path="/visualize-data" element={<VisualizeData />} /> 
      </Routes>
      <Footer />

      {/* Toast Notification Container */}
      <ToastContainer />
    </Router>
  );
}

export default App;

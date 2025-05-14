import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { LogOut, PlusCircle, List, Users, BarChart } from 'lucide-react'; // Updated icons
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../config/firebase'; 

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // Set user if logged in
      } else {
        navigate('/login'); // Redirect to login if no user is found
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  const handleLogout = () => {
    getAuth().signOut()
      .then(() => navigate('/login'))  // Redirect after sign-out
      .catch((error) => console.error("Error signing out: ", error));  // Handle sign-out errors
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  const cardItems = [
    { 
      onClick: () => navigate('/add-student'),
      icon: <PlusCircle size={36} />,
      title: 'Add Student',
      subtitle: 'Add a new student entry',
      gradient: 'from-green-400 to-green-600'
    },
    { 
      onClick: () => navigate('/student-list'),
      icon: <List size={36} />, // Updated icon for Student List (List icon)
      title: 'Student List',
      subtitle: 'View all student records',
      gradient: 'from-blue-400 to-blue-600'
    },
    { 
      onClick: () => navigate('/show-department'),
      icon: <Users size={36} />,
      title: 'Department',
      subtitle: 'Manage student departments',
      gradient: 'from-teal-400 to-teal-600'
    },
    { 
      onClick: () => navigate('/visualize-data'),
      icon: <BarChart size={36} />,
      title: 'Visualize',
      subtitle: 'View student data and generate reports',
      gradient: 'from-indigo-400 to-indigo-600'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 pt-40 p-2">
      <div className="flex flex-col items-center max-w-6xl mx-auto gap-6 flex-grow">
        {/* Grid of action cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cardItems.map((item, index) => (
            <CardItem
              key={index}
              onClick={item.onClick}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              gradient={item.gradient}
            />
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>


    </div>
  );
};

// CardItem component for reusable action items
const CardItem = ({ onClick, icon, title, subtitle, gradient, full = false }) => (
  <div
    onClick={onClick}
    className={`flex items-center ${full ? 'w-full' : ''} bg-gradient-to-r ${gradient} text-white p-4 sm:p-5 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`}
  >
    <div className="mr-4">{icon}</div>
    <div>
      <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
      <p className="text-xs sm:text-sm opacity-90">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;

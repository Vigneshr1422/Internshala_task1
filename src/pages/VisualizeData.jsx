import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF download
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

// Mapping full department names to short versions
const departmentShortNames = {
  "Computer Science": "CSE",
  "Information Technology": "IT",
  "Electronics": "EEE",
  "Mechanical": "MECH",
  "Civil": "CIVIL",
  "Artificial Intelligence and Data Science": "AI",
  "Electronics and Communication": "ECE",
};

const VisualizeData = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const studentsRef = collection(db, `admins/${user.uid}/students`);
          const studentSnap = await getDocs(studentsRef);
          const studentsList = studentSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setStudents(studentsList);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      } 
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const getDepartmentStats = () => {
    const departmentCount = {};
    students.forEach((student) => {
      const dept = student.department;
      departmentCount[dept] = (departmentCount[dept] || 0) + 1;
    });
    return departmentCount;
  };

  const departmentCount = getDepartmentStats();

  const data = {
    labels: Object.keys(departmentCount).map(
      (dept) => departmentShortNames[dept] || dept
    ),
    datasets: [
      {
        data: Object.values(departmentCount),
        backgroundColor: [
          "#4F46E5", // Indigo
          "#10B981", // Emerald
          "#F59E0B", // Amber
          "#EF4444", // Red
          "#3B82F6", // Blue
          "#8B5CF6", // Violet
          "#EC4899", // Pink
        ],
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
    animation: {
      animateRotate: true, // Animate the chart rotation
      animateScale: true, // Animate the scale
    },
  };

  // Function to download the chart as an image
  const downloadImage = () => {
    const canvas = document.querySelector('canvas');
    const imageUrl = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'department-distribution.png';
    link.click();
    toast.success("Chart downloaded as image!", { position: "bottom-center", autoClose: 3000 }); // Toast for image download
  };

  // Function to download the chart as a PDF
  const downloadPDF = () => {
    const canvas = document.querySelector('canvas');
    const imageUrl = canvas.toDataURL("image/png");

    const doc = new jsPDF();
    doc.addImage(imageUrl, 'PNG', 10, 10, 180, 160); // Add image to PDF
    doc.save('department-distribution.pdf');
    toast.success("Chart downloaded as PDF!", { position: "bottom-center", autoClose: 3000 }); // Toast for PDF download
  };

  // Loading animation
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-indigo-500 border-solid"></div>
      </div>
    );
  }

 return (
  <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 mt-14 bg-gradient-to-br from-white to-blue-50">
    <div className="flex-grow flex flex-col items-center pb-24">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 text-center mb-6 drop-shadow">
        📊 Department-wise Student Distribution
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between w-full max-w-6xl">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md transition-transform hover:scale-[1.01]">
            <Pie
              data={{
                labels: Object.keys(departmentCount).map(
                  (dept) => departmentShortNames[dept] || dept
                ),
                datasets: [
                  {
                    data: Object.values(departmentCount),
backgroundColor: [
  "#FF6B00", // Orange
  "#007AFF", // Bright Blue
  "#8E44AD", // Purple
  "#A52A2A ", // Teal
  "#FFD700", // Gold/Yellow
  "#003f5c", // Red
  "#2ECC71", // Leaf Green
  "#FF1493" // Deep Pink

],
// backgroundColor: [
//   "#003f5c", // Dark Blue
//   "#2f4b7c", // Steel Blue
//   "#665191", // Purple
//   "#a05195", // Violet
//   "#d45087", // Fuchsia
//   "#f95d6a", // Tomato Red
//   "#ff7c43", // Orange
//   "#ffa600"  // Yellow Orange
// ],




                    hoverOffset: 8,
                  },
                ],
              }}
              options={options}
            />
          </div>
        </div>

        {/* Department Stats */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-4">
          <h3 className="text-xl font-semibold text-purple-700">
            🏫 Department Stats
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {Object.keys(departmentCount).map((dept, index) => (
              <div
                key={index}
                className="bg-white border-l-4 border-indigo-500 p-4 rounded-lg shadow-md hover:shadow-lg hover:border-indigo-600 transition"
              >
                <h4 className="text-sm font-medium text-gray-600">
                  {departmentShortNames[dept] || dept}
                </h4>
                <p className="text-2xl font-bold text-indigo-700">
                  {departmentCount[dept]}
                </p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-6 w-full flex flex-col sm:flex-row flex-wrap gap-3">
  <button
    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
    onClick={downloadImage}
  >
    📥 Download Image
  </button>
  <button
    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
    onClick={downloadPDF}
  >
    📄 Download PDF
  </button>
  <button
    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto"
    onClick={() => window.history.back()}
  >
    ← Back
  </button>
</div>

        </div>
      </div>
    </div>

    {/* Toast */}
    <ToastContainer
      position="bottom-center"
      autoClose={3000}
      hideProgressBar
      closeButton={false}
      pauseOnHover
      draggable
    />
  </div>
);

};

export default VisualizeData;

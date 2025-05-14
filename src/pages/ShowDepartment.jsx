import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"
import { useNavigate } from "react-router-dom";
import {
  Cpu,
  Laptop,
  Construction,
  Wrench,
  Zap,
  GraduationCap,
  Bot,
} from "lucide-react";
import { motion } from "framer-motion";

const ShowDepartment = () => {
  const [students, setStudents] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 6;

  const navigate = useNavigate();

  // Mapping short code to full department name
  const deptNameMap = {
    MECH: "Mechanical",
    Civil: "Civil",
    ECE: "Electronics and Communication",
    EEE: "Electrical and Electronics",
    AI: "Artificial Intelligence and Data Science",
    MCA: "MCA",
    MBA: "MBA",
  };

  // Icon mapping
  const deptIcons = {
    MECH: <Wrench size={20} />,
    Civil: <Construction size={20} />,
    ECE: <Cpu size={20} />,
    EEE: <Zap size={20} />,
    AI: <Bot size={20} />,
    MCA: <Laptop size={20} />,
    MBA: <GraduationCap size={20} />,
  };

  const departments = Object.keys(deptIcons); // ["MECH", "Civil", "ECE", ...]

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const studentsRef = collection(db, `admins/${user.uid}/students`);
        const snapshot = await getDocs(studentsRef);
        const studentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching students", err);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = selectedDept
    ? students.filter(
        (s) => s.department === deptNameMap[selectedDept] // compare full names
      )
    : [];

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

return (
  <div className="p-4 mt-20 max-w-6xl mx-auto min-h-screen flex flex-col relative overflow-x-hidden">
    {/* Page Title */}
    <h2 className="text-3xl font-bold mb-4 text-center text-indigo-700 flex justify-center items-center gap-2">
      {selectedDept ? (
        <>
          {deptIcons[selectedDept]} {selectedDept} Students
        </>
      ) : (
        "Select a Department"
      )}
    </h2>

    {/* Back Button - responsive layout */}
    {selectedDept && (
      <div className="flex justify-center sm:justify-end mb-6 sm:mb-8">
        <button
          onClick={() => setSelectedDept(null)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition text-sm sm:text-base sm:absolute sm:top-6 sm:right-6"
        >
          ⬅ Back to Departments
        </button>
      </div>
    )}

    {/* Content */}
    {loading ? (
      <div className="text-center text-indigo-500 font-medium">Loading...</div>
    ) : !selectedDept ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {departments.map((dept) => (
          <motion.button
            key={dept}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedDept(dept)}
            className="flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold py-3 px-3 rounded-xl shadow transition-all duration-200 text-center w-full h-20"
          >
            {deptIcons[dept]} {dept}
          </motion.button>
        ))}
      </div>
    ) : filteredStudents.length === 0 ? (
      <div className="text-center text-red-500 font-medium">
        No students added in this department.
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {currentStudents.map((student) => (
            <motion.div
              key={student.id}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-300 rounded-3xl shadow-lg p-6 flex flex-col space-y-4"
            >
              <h3 className="text-lg font-semibold text-indigo-700 mb-2 border-b-2 pb-2">
                {student.name}
              </h3>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">
                  🎓 <span className="font-medium">Reg No:</span> {student.regNo}
                </p>
                <p className="text-sm text-gray-600">
                  🏫 <span className="font-medium">Section:</span> {student.section}
                </p>
                <p className="text-sm text-gray-600">
                  📅 <span className="font-medium">Year:</span> {student.passedOutYear}
                </p>
              </div>
              <div className="mt-4">
                <button
                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition duration-200 w-full"
                  onClick={() => navigate(`/student-list`)}
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`py-2 px-4 rounded-lg text-sm font-medium ${
                currentPage === index + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-indigo-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
);

};
export default ShowDepartment;

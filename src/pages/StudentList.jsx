import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeftCircle } from 'lucide-react';

// ✅ Toggle this to switch between mock mode and real Firebase data
const useMockData = false;

// ✅ Mock students array
const mockStudents = [
  {
    id: '1',
    name: 'Mock John Doe',
    regNo: '123456',
    department: 'CSE',
    section: 'A',
    passedOutYear: '2025',
  },
  {
    id: '2',
    name: 'Mock Jane Smith',
    regNo: '654321',
    department: 'ECE',
    section: 'B',
    passedOutYear: '2024',
  },
];

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [deleting, setDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      if (useMockData) {
        // Simulate network delay
        setTimeout(() => {
          setStudents(mockStudents);
          setLoading(false);
        }, 1000);
        return;
      }

      const auth = getAuth();
      const adminUid = auth.currentUser?.uid;
      if (!adminUid) {
        console.error('Admin not authenticated');
        setLoading(false);
        return;
      }

      const studentsRef = collection(db, `admins/${adminUid}/students`);
      const q = query(studentsRef, orderBy("regNo"));
      const querySnapshot = await getDocs(q);

      const studentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStudents(studentList);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      if (useMockData) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        setShowToast(true);
        return;
      }

      const studentDoc = doc(db, `admins/${getAuth().currentUser?.uid}/students`, id);
      await deleteDoc(studentDoc);
      fetchStudents();
      setShowToast(true);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

const filteredStudents = students.filter((student) =>
  Object.values(student).some((value) =>
    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )
);


  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-16 sm:p-8 lg:p-24">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-8 space-y-10 sm:space-y-0">
          <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700 text-center sm:text-left">
            Student Entries
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition text-sm sm:text-base"
          >
            <ArrowLeftCircle size={20} /> Back
          </button>
        </div>

      {/* Search Bar */}
<div className="flex justify-center mb-6">
  <div className="relative w-full max-w-md">
    <Search className="absolute left-4 top-3 text-gray-400" size={20} />
    <input
      type="text"
      placeholder="Search by student name, roll number, department..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-12 pr-4 py-3 rounded-full shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white"
    />
  </div>
</div>


        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
            <p className="text-indigo-600 font-semibold">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">No students found 🧍‍♂️🧍‍♀️</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full min-w-[600px] sm:min-w-full table-auto">
              <thead>
                <tr className="bg-indigo-200 text-indigo-800 text-sm sm:text-base">
                  <th className="py-3 px-4 sm:px-6 text-left">#</th>
                  <th className="py-3 px-4 sm:px-6 text-left">Name</th>
                  <th className="py-3 px-4 sm:px-6 text-left">Roll Number</th>
                  <th className="py-3 px-4 sm:px-6 text-left">Department</th>
                  <th className="py-3 px-4 sm:px-6 text-left">Section</th>
                  <th className="py-3 px-4 sm:px-6 text-left">Year</th>
                  <th className="py-3 px-4 sm:px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="border-b hover:bg-indigo-50 transition duration-300"
                  >
                    <td className="py-3 px-4 sm:px-6">{index + 1}</td>
                    <td className="py-3 px-4 sm:px-6">{student.name}</td>
                    <td className="py-3 px-4 sm:px-6">{student.regNo}</td>
                    <td className="py-3 px-4 sm:px-6">{student.department}</td>
                    <td className="py-3 px-4 sm:px-6">{student.section}</td>
                    <td className="py-3 px-4 sm:px-6">{student.passedOutYear}</td>
                    <td className="py-3 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => {
                          const confirmDelete = window.confirm("Are you sure you want to delete this student?");
                          if (confirmDelete) handleDelete(student.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-full shadow transition duration-200 ease-in-out transform hover:scale-105"
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-col items-center justify-center mt-6 space-y-2">
            <div className="flex space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">
          Student deleted successfully!
        </div>
      )}
    </div>
  );
};

export default StudentList;

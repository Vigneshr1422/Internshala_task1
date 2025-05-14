
// src/components/StudentEntry.jsx

import React, { useState } from "react";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentEntry = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    regNo: "",
    department: "",
    section: "",
    passedOutYear: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("❌ You must be logged in to add a student.");
      return;
    }

    if (formData.passedOutYear < 1900) {
      toast.error("⚠️ Enter a valid year (>= 1900).");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, `admins/${user.uid}/students`), {
        ...formData,
        adminEmail: user.email,
        createdAt: new Date(),
      });

      toast.success("✅ Student added successfully!");
      setFormData({
        name: "",
        regNo: "",
        department: "",
        section: "",
        passedOutYear: "",
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("❌ Failed to add student. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("❌ You must be logged in to delete a student.");
      return;
    }

    setLoading(true);
    try {
      await deleteDoc(doc(db, `admins/${user.uid}/students`, studentId));
      toast.success("✅ Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("❌ Failed to delete student. Try again.");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex flex-col min-h-screen bg-gray-100">
  <main className="flex-grow px-4 sm:px-6 md:px-16 pt-[72px] pb-[72px]">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-gray-200"
    >
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        🎓 Add Student Details
      </h2>

      {/* Input Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {/* Input Fields with Placeholders */}
  {[
    { name: "regNo", label: "Registration Number", type: "text", placeholder: "Enter Reg No" },
    { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name" },
    { name: "passedOutYear", label: "Passed-Out Year", type: "number", placeholder: "Enter year (e.g. 2023)" },
  ].map(({ name, label, type, placeholder }) => (
    <div key={name} className="relative">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
      />
    </div>
  ))}

  {/* Department Dropdown */}
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Department
    </label>
    <select
      name="department"
      value={formData.department}
      onChange={handleChange}
      required
      className="w-full appearance-none bg-gray-50 px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-gray-600"
    >
      <option value="">Select Department</option>
      <option value="Mechanical">BE - Mechanical</option>
      <option value="Civil">BE - Civil</option>
      <option value="Electronics and Communication">BE - ECE</option>
      <option value="Electrical and Electronics">BE - EEE</option>
      <option value="Artificial Intelligence ">BE - AI&DS</option>
      <option value="MCA">MCA</option>
      <option value="MBA">MBA</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.063a.75.75 0 111.08 1.04l-4.25 4.657a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>

  {/* Section Dropdown */}
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Section
    </label>
    <select
      name="section"
      value={formData.section}
      onChange={handleChange}
      required
      className="w-full appearance-none bg-gray-50 px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-gray-600"
    >
      <option value="">Select Section</option>
      <option value="A">I</option>
      <option value="B">II</option>
      <option value="C">III</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.063a.75.75 0 111.08 1.04l-4.25 4.657a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
</div>


      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  </main>

  {/* Toast container */}
  <ToastContainer
    position="top-center"
    autoClose={2000}
    hideProgressBar
    closeOnClick
    pauseOnHover={false}
    draggable={false}
    transition={Slide}
    theme="colored"
    limit={1}
  />
</div>

);


};

export default StudentEntry;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaListAlt, FaFilter, FaBuilding, FaChartPie, FaFilePdf, FaDownload, FaUserFriends, FaShieldAlt, FaClock } from "react-icons/fa";
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';

export default function Home() {
  const [sending, setSending] = useState(false);
  
  // Initialize formData from localStorage or default values
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : { name: '', email: '', message: '' };
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    // Sending email with emailjs
    emailjs
      .send(
        'service_bwipo6o',     // Replace with your EmailJS service ID
        'template_0ninx8j',    // Replace with your EmailJS template ID
        formData,
        '1K4Z1DQiS0AVGorrW'   // Replace with your EmailJS public key
      )
      .then(
        (response) => {
          toast.success('Message sent successfully!');
          setFormData({ name: '', email: '', message: '' }); // Clear form on success
          localStorage.removeItem('formData'); // Remove data from localStorage
        },
        (error) => {
          toast.error('Failed to send message!');
          console.error(error);
        }
      )
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-16 bg-white min-h-screen">
        <div className="md:w-1/2 text-center md:text-left">
         <h1 className="text-5xl font-extrabold mb-8 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
  BabyCode
</h1>
<h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-10">
  📊 Welcome to the <span className="text-blue-700">Student Management App</span> 🌟
</h2>
<p className="mb-6 text-gray-600 text-lg leading-relaxed">
  Simplify student tracking, pie chart analysis, and secure access.
</p>

          <Link to="/register">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Get Started
            </button>
          </Link>
        </div>
        <div className="md:w-1/2">
          <img
            src="public/assets/baby.jpg"
            alt="Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </section>

      {/* Why We Created Section */}
<section id="about" className="bg-blue-100 py-16">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold text-blue-900">🎯 Why We Created</h2>
    <p className="text-gray-700">To empower institutions with real-time student data & smart analytics.</p>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
    <div className="group bg-white p-8 rounded-xl shadow-md text-center border border-transparent hover:border-blue-400 transition duration-300 hover:shadow-xl">
      <FaUserFriends className="text-blue-500 text-4xl mx-auto mb-3 group-hover:animate-pulse" />
      <h3 className="font-semibold text-lg text-gray-800">Track Students</h3>
      <p className="text-gray-600 text-sm mt-1">Logged-in users can add and view only their students.</p>
    </div>
    <div className="group bg-white p-8 rounded-xl shadow-md text-center border border-transparent hover:border-green-400 transition duration-300 hover:shadow-xl">
      <FaShieldAlt className="text-green-500 text-4xl mx-auto mb-3 group-hover:animate-pulse" />
      <h3 className="font-semibold text-lg text-gray-800">Secure Login</h3>
      <p className="text-gray-600 text-sm mt-1">Only authenticated users can access features.</p>
    </div>
    <div className="group bg-white p-8 rounded-xl shadow-md text-center border border-transparent hover:border-purple-400 transition duration-300 hover:shadow-xl">
      <FaClock className="text-purple-500 text-4xl mx-auto mb-3 group-hover:animate-pulse" />
      <h3 className="font-semibold text-lg text-gray-800">Real-Time Updates</h3>
      <p className="text-gray-600 text-sm mt-1">Everything updates instantly — no refresh needed!</p>
    </div>
  </div>
</section>


      {/* Features Section */}
<section id="features" className="bg-white py-20 px-6">
  <div className="text-center mb-14">
    <h2 className="text-4xl font-bold text-gray-800">🚀 Features</h2>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
    {[
      { icon: <FaUserPlus />, color: "bg-blue-100", text: "text-blue-600", title: "Add Student", desc: "Easily add student records with department and section." },
      { icon: <FaListAlt />, color: "bg-indigo-100", text: "text-indigo-600", title: "Student List", desc: "View all students added in the system." },
      { icon: <FaFilter />, color: "bg-teal-100", text: "text-teal-600", title: "Filterable List", desc: "Quickly search students using filters like section or YOP." },
      { icon: <FaBuilding />, color: "bg-purple-100", text: "text-purple-600", title: "Department-wise View", desc: "View students grouped by their departments." },
      { icon: <FaChartPie />, color: "bg-pink-100", text: "text-pink-600", title: "Pie Chart Analysis", desc: "Visualize department-wise student distribution." },
      {
        icon: (
          <div className="flex justify-center gap-3 text-2xl">
            <FaFilePdf className="text-red-500" />
            <FaDownload className="text-yellow-500" />
          </div>
        ),
        color: "bg-gray-100", text: "text-gray-700", title: "Download Charts", desc: "Export pie charts as PDF or JPEG formats.",
      },
    ].map((f, i) => (
      <div key={i} className="rounded-xl shadow-md bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 p-6 text-center">
        <div className={`${f.color} w-16 h-16 mx-auto flex items-center justify-center rounded-full text-3xl mb-4 ${f.text}`}>
          {f.icon}
        </div>
        <h3 className="font-semibold text-lg text-gray-800">{f.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{f.desc}</p>
      </div>
    ))}
  </div>
</section>


     {/* Contact Section */}
<section id="contact" className="bg-gradient-to-r from-sky-100 to-white py-16 px-4 sm:px-6 lg:px-8">
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-gray-800">📞 Contact</h2>
  </div>

  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    {/* Left Side - Address */}
    <div className="space-y-6 text-center lg:text-left">
      <div className="flex justify-center lg:justify-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-16 h-16 text-indigo-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10.5L12 4l9 6.5M4.5 12v7.5a.75.75 0 00.75.75H9v-6h6v6h3.75a.75.75 0 00.75-.75V12"
          />
        </svg>
      </div>

      <div>
        <p className="text-4xl font-black tracking-tight mb-4 bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">
          Our Address
        </p>
        <p className="text-lg text-black font-semibold">
          No 5, Sivanantha Madam Lane<br />
          Koviloor Road ,<br />
          Karaikudi ,<br />
          Sivaganga - 630001 <br />
          Tamil Nadu
        </p>
      </div>
    </div>

    {/* Right Side - Contact Form */}
    <div>
      <div className="text-center lg:text-left">
        <h2 className="text-4xl font-black tracking-tight uppercase mb-4 bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">
          Get In Touch
        </h2>
        <p className="text-lg text-black font-semibold">
          Feel free to reach out if you’d like to collaborate – you’re just a few clicks away!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label className="block text-lg text-black font-semibold">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm hover:ring-2 hover:ring-indigo-300 transition-all"
            placeholder="Enter Name"
          />
        </div>

        <div>
          <label className="block text-lg text-black font-semibold">Your Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm hover:ring-2 hover:ring-indigo-300 transition-all"
            placeholder="Enter Your Mail id"
          />
        </div>

        <div>
          <label className="block text-lg text-black font-semibold">Your Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm hover:ring-2 hover:ring-indigo-300 transition-all"
            placeholder="Enter your message here"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none transition-all"
        >
          {sending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  </div>
</section>


</div>
);
}


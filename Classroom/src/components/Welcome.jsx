import React, { useRef, useState } from "react";

const Welcome = ({ setPage }) => {
  const scrollRef = useRef(null);
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="flex items-center justify-between px-10 py-5">

          <div className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            VRClass
          </div>

          <ul className="hidden md:flex gap-10 text-lg text-gray-200 font-medium">
            {[
              { label: "Features", id: "features" },
              { label: "Courses", id: "courses" },
              { label: "Live Classes", id: "live-classes" },
              { label: "Resources", id: "resources" },
            ].map((item) => (
              <li
                key={item.id}
                onClick={() =>
                  document
                    .getElementById(item.id)
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="cursor-pointer relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-cyan-400 hover:after:w-full after:transition-all"
              >
                {item.label}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setPage("auth")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2 rounded font-semibold shadow-lg hover:scale-105 transition hover:text-white"
          >
            Login / Register
          </button>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center text-center pt-32 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-[#050B2E] via-[#0A1A3C] to-[#020617]"></div>

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1639322537228-f710d846310a')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-5xl px-6 text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Future of Learning in
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Virtual Reality
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Step into immersive classrooms, collaborate in real time, and explore
            knowledge like never before.
          </p>

          <div className="mt-12 flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => setPage("auth")}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:scale-105 transition"
            >
              Enter VR Classroom
            </button>

            {/* ✅ FIXED WATCH DEMO */}
            <button
              onClick={() => setShowDemo(true)}
              className="border border-white/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition"
            >
              Watch Demo 🎥
            </button>
          </div>
        </div>
      </section>

      {/* ================= DEMO VIDEO MODAL ================= */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
          <div className="relative bg-black rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl">

            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-3 right-4 text-white text-3xl hover:text-red-500"
            >
              ✕
            </button>

            <iframe
              className="w-full h-[450px]"
              src="https://www.youtube.com/embed/8n8F2FjF2_Q"
              title="VR Classroom Demo"
              allowFullScreen
            ></iframe>

            <div className="p-6 text-center bg-gray-900 text-white">
              <h3 className="text-xl font-semibold mb-2">
                Why VR Classrooms Are the Future of Education
              </h3>
              <p className="text-gray-400 text-sm">
                Discover how immersive VR learning boosts engagement, collaboration,
                and real-world understanding.
              </p>
            </div>

          </div>
        </div>
      )}


      {/* Features */}
      {/* ================= FEATURES SLIDER SECTION ================= */}
      <section
        id="features"
        className="px-10 py-24 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative"
      >
        <h2 className="text-4xl font-extrabold mb-12 text-center">
          Platform Features
        </h2>

        {/* Arrows */}
        <button
          onClick={() => scrollRef.current.scrollBy({ left: -350, behavior: "smooth" })}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-2xl z-10"
        >

        </button>

        <button
          onClick={() => scrollRef.current.scrollBy({ left: 350, behavior: "smooth" })}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-2xl z-10"
        >

        </button>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide px-4"
        >

          {/* CARD 1 */}
          <div className="min-w-[300px] bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <div className="text-5xl mb-4 text-blue-400">🥽</div>
            <h3 className="text-2xl font-semibold mb-3">Immersive VR Classes</h3>
            <p className="text-gray-300">
              Learn in fully immersive 3D VR classrooms and labs.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="min-w-[300px] bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <div className="text-5xl mb-4 text-green-400">🤝</div>
            <h3 className="text-2xl font-semibold mb-3">Real-Time Collaboration</h3>
            <p className="text-gray-300">
              Chat, raise hands, and collaborate live.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="min-w-[300px] bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <div className="text-5xl mb-4 text-purple-400">🧪</div>
            <h3 className="text-2xl font-semibold mb-3">Interactive VR Labs</h3>
            <p className="text-gray-300">
              Perform simulations and experiments in VR.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="min-w-[300px] bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <div className="text-5xl mb-4 text-yellow-400">📊</div>
            <h3 className="text-2xl font-semibold mb-3">Smart Attendance</h3>
            <p className="text-gray-300">
              Automatic attendance tracking in live sessions.
            </p>
          </div>

          {/* CARD 5 */}
          <div className="min-w-[300px] bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <div className="text-5xl mb-4 text-red-400">🎥</div>
            <h3 className="text-2xl font-semibold mb-3">Recorded Sessions</h3>
            <p className="text-gray-300">
              Access recorded VR classes anytime.
            </p>
          </div>

          {/* CARD 6 */}
          <div className="min-w-[300px] bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition">
            <div className="text-5xl mb-4 text-cyan-400">🔐</div>
            <h3 className="text-2xl font-semibold mb-3">Secure Access</h3>
            <p className="text-gray-300">
              Role-based login for students & teachers.
            </p>
          </div>

        </div>

        <p className="text-center text-gray-400 mt-12 text-sm">
          Slide using arrows to explore features
        </p>
      </section>

      {/* ================= COURSES SECTION ================= */}
      <section
        id="courses"
        className="px-10 py-24 bg-gradient-to-br from-[#020617] to-[#0A1A3C] text-white"
      >
        <h2 className="text-4xl font-bold mb-4 text-center">
          Professional VR Courses
        </h2>
        <p className="text-center text-gray-300 max-w-3xl mx-auto mb-16">
          Industry-designed courses with real-world tools, projects, and immersive
          VR learning experiences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {[
            {
              title: "VR Fundamentals",
              desc: "Understand VR hardware, environments, and interaction models.",
              price: "$49",
              logo: "https://cdn-icons-png.flaticon.com/512/841/841364.png",
              link: "https://developers.meta.com/horizon/",
            },
            {
              title: "3D Modeling for VR",
              desc: "Create optimized 3D assets using Blender & real VR pipelines.",
              price: "$99",
              logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
              link: "https://www.blender.org/support/tutorials/",
            },
            {
              title: "Interactive VR Lessons",
              desc: "Design immersive educational experiences inside VR worlds.",
              price: "$79",
              logo: "https://cdn-icons-png.flaticon.com/512/2920/2920244.png",
              link: "https://learn.unity.com/",
            },
            {
              title: "Real-Time Collaboration",
              desc: "Build multi-user VR classrooms with live interaction.",
              price: "$59",
              logo: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
              link: "https://socket.io/docs/",
            },
            {
              title: "VR Classroom Management",
              desc: "Manage attendance, sessions, and students in VR spaces.",
              price: "$89",
              logo: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
              link: "https://www.education.com/",
            },
            {
              title: "Advanced VR Labs",
              desc: "Hands-on labs with simulations, physics, and experiments.",
              price: "$129",
              logo: "https://cdn-icons-png.flaticon.com/512/4320/4320224.png",
              link: "https://xrbootcamp.com/",
            },
          ].map((course, index) => (
            <div
              key={index}
              className="relative bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:scale-[1.03] transition"
            >
              {/* LOGO */}
              <div className="absolute -top-8 left-6 bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-full shadow-lg">
                <img
                  src={course.logo}
                  alt={course.title}
                  className="w-8 h-8"
                />
              </div>

              {/* CONTENT */}
              <div className="pt-8">
                <h3 className="text-xl font-semibold mb-3">
                  {course.title}
                </h3>

                <p className="text-gray-300 text-sm mb-6">
                  {course.desc}
                </p>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-cyan-400 text-lg">
                    {course.price}
                  </span>

                  <a
                    href={course.link}
                    target="_blank"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
                  >
                    View Course →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LIVE CLASSES SECTION ================= */}
      <section
        id="live-classes"
        className="px-10 py-24 bg-gradient-to-br from-[#020617] to-[#050B2E] text-white"
      >
        <h2 className="text-4xl font-extrabold text-center mb-4">
          Live VR Classes
        </h2>

        <p className="text-center text-gray-300 max-w-3xl mx-auto mb-16">
          Join real-time interactive VR sessions conducted by industry experts inside
          immersive virtual classrooms.
        </p>

        {localStorage.getItem("user") ? (
          /* ================= LOGGED-IN VIEW ================= */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {[
              {
                title: "Physics Lab – Motion & Forces",
                instructor: "Dr. Alex Morgan",
                time: "Today · 6:00 PM",
                link: "https://vrclassroom.fake/physics-live",
                icon: "🧪",
              },
              {
                title: "3D Modeling in VR (Blender)",
                instructor: "Sarah Williams",
                time: "Tomorrow · 4:30 PM",
                link: "https://vrclassroom.fake/3d-vr-live",
                icon: "🎨",
              },
              {
                title: "Collaborative VR Classroom Demo",
                instructor: "James Carter",
                time: "Friday · 7:00 PM",
                link: "https://vrclassroom.fake/collaboration-live",
                icon: "🤝",
              },
            ].map((cls, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:scale-[1.03] transition flex flex-col justify-between"
              >
                <div>
                  <div className="text-5xl mb-4">{cls.icon}</div>

                  <h3 className="text-xl font-semibold mb-2">
                    {cls.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-1">
                    Instructor: {cls.instructor}
                  </p>

                  <p className="text-gray-400 text-sm mb-6">
                    {cls.time}
                  </p>
                </div>

                <a
                  href={cls.link}
                  target="_blank"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 rounded-lg text-center font-semibold hover:opacity-90"
                >
                  Join Live VR Class →
                </a>
              </div>
            ))}
          </div>
        ) : (
          /* ================= NOT LOGGED-IN VIEW ================= */
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-10 text-center shadow-xl">
            <div className="text-6xl mb-6">🔒</div>

            <h3 className="text-2xl font-semibold mb-4">
              Login Required
            </h3>

            <p className="text-gray-300 mb-8">
              You must be logged in to access live VR classrooms, interact with
              instructors, and collaborate with students in real time.
            </p>

            <button
              onClick={() => setPage("auth")}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-xl text-lg font-semibold hover:scale-105 transition"
            >
              Login to Join Live Classes 🚀
            </button>
          </div>
        )}

        <p className="text-center text-gray-400 mt-16 text-sm">
          Live sessions are conducted daily inside immersive VR environments
        </p>
      </section>


      {/* ================= RESOURCES SECTION ================= */}
      <section
        id="resources"
        className="px-10 py-24 bg-gradient-to-br from-gray-900 to-black text-white"
      >
        <h2 className="text-4xl font-bold mb-4 text-center">
          Learning Resources
        </h2>
        <p className="text-center text-gray-400 max-w-3xl mx-auto mb-16">
          Step-by-step video series, official documentation, and real-world learning
          materials used by VR professionals.
        </p>

        {/* ================= VIDEO SERIES ================= */}
        <h3 className="text-2xl font-semibold mb-8 text-cyan-400">
          VR Video Learning Series
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">

          {[
            {
              title: "VR Basics – Episode 1",
              desc: "Introduction to Virtual Reality & hardware setup.",
              video: "https://www.youtube.com/embed/8mAITcNt710",
            },
            {
              title: "VR Environments – Episode 2",
              desc: "Understanding 3D environments & VR spaces.",
              video: "https://www.youtube.com/embed/XLP4YTpUpBI",
            },
            {
              title: "VR Interaction – Episode 3",
              desc: "Hands, controllers, and object interaction.",
              video: "https://www.youtube.com/embed/Lz8R1K7f9Yg",
            }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:scale-[1.03] transition"
            >
              <div className="relative">
                <iframe
                  className="w-full h-48"
                  src={item.video}
                  title={item.title}
                  allowFullScreen
                ></iframe>
                <span className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-xs font-bold">
                  Series
                </span>
              </div>

              <div className="p-6">
                <h4 className="text-lg font-semibold mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-300 text-sm">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= REAL-WORLD PDF RESOURCES ================= */}
        <h3 className="text-2xl font-semibold mb-8 text-blue-400">
          Official Guides & PDFs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {[
            {
              title: "Meta VR Development Guide",
              desc: "Official Meta documentation for VR apps & classrooms.",
              link: "https://developers.meta.com/horizon/documentation/",
            },
            {
              title: "Unity XR Interaction Toolkit",
              desc: "Professional XR development framework documentation.",
              link: "https://docs.unity3d.com/Packages/com.unity.xr.interaction.toolkit@latest",
            },
            {
              title: "Blender 3D Manual",
              desc: "Complete 3D modeling guide used by VR artists.",
              link: "https://docs.blender.org/manual/en/latest/",
            },
            {
              title: "WebXR Device API",
              desc: "Build VR experiences directly in the browser.",
              link: "https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API",
            },
            {
              title: "VR UX Design Principles",
              desc: "Human-centered design rules for VR experiences.",
              link: "https://uxdesign.cc/vr-design-principles-5a8b7a6d9f94",
            },
            {
              title: "OpenXR Specification",
              desc: "Cross-platform VR & AR standard documentation.",
              link: "https://www.khronos.org/openxr/",
            },
          ].map((doc, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:scale-[1.03] transition flex flex-col justify-between"
            >
              <div>
                <span className="inline-block bg-blue-600 px-3 py-1 rounded-full text-xs font-bold mb-4">
                  PDF / Docs
                </span>

                <h4 className="text-lg font-semibold mb-2">
                  {doc.title}
                </h4>

                <p className="text-gray-300 text-sm mb-6">
                  {doc.desc}
                </p>
              </div>

              <a
                href={doc.link}
                target="_blank"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg text-sm font-semibold text-center hover:opacity-90"
              >
                Open Resource
              </a>
            </div>
          ))}
        </div>

        {/* REAL-TIME NOTICE */}
        <p className="text-center text-gray-400 mt-16 text-sm">
          Resources are continuously updated during live VR sessions
        </p>
      </section>
    </div>
  );
};

export default Welcome;

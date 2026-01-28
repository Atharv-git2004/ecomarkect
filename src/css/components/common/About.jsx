import React from 'react';
import { Leaf, Users, ShieldCheck, Globe, ArrowLeft, Target, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="about-wrapper bg-white min-vh-100">
      
      {/* 1. Hero Section */}
      <section
        className="position-relative py-5 text-white mb-5 overflow-hidden"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0 0 50px 50px',
          minHeight: '400px',
        }}
      >
        <div className="container py-5 text-center position-relative z-index-2">
          <Link
            to="/"
            className="btn btn-link text-white text-decoration-none d-inline-flex align-items-center mb-4 opacity-75 hover-opacity-100 transition"
          >
            <ArrowLeft size={18} className="me-2" /> Back to Home
          </Link>

          <h1 className="display-3 fw-black mb-3">
            Rooted in <span className="text-success italic">Nature.</span>
          </h1>

          <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
            We are more than just a store. We are a community dedicated to plastic-free living
            and sustainable choices.
          </p>
        </div>
      </section>

      {/* 2. Mission Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="pe-lg-5">
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mb-3 fw-bold">
                  OUR MISSION
                </span>

                <h2 className="display-5 fw-bold text-dark mb-4">
                  Driving the <br /> Green Revolution
                </h2>

                <p className="text-secondary mb-4 fs-5">
                  Our mission is to make environmentally safe and sustainable products accessible
                  to everyone. Every product we offer is carefully selected to ensure it has minimal
                  impact on nature and supports a greener future.
                </p>

                <div className="row g-4 mt-2">
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light border-start border-success border-4 shadow-sm">
                      <Target className="text-success" size={24} />
                      <span className="fw-bold">Goal Oriented</span>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light border-start border-success border-4 shadow-sm">
                      <Heart className="text-success" size={24} />
                      <span className="fw-bold">Eco-Friendly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 order-1 order-lg-2">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&q=80&w=800"
                  alt="Eco Impact"
                  className="img-fluid rounded-5 shadow-2xl floating-img"
                />

                <div className="position-absolute bottom-0 start-0 bg-white p-4 rounded-4 shadow-lg m-4 d-none d-md-block border-start border-success border-5">
                  <h5 className="fw-bold mb-0">100% Transparent</h5>
                  <p className="small text-muted mb-0">From source to your home.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="py-5 my-5 bg-success bg-opacity-5">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { icon: <Users size={35} />, value: '25k+', label: 'Active Shoppers' },
              { icon: <Globe size={35} />, value: '15+', label: 'Organic Farms' },
              { icon: <Leaf size={35} />, value: '100%', label: 'Recyclable' },
              { icon: <ShieldCheck size={35} />, value: 'Certified', label: 'Quality Checks' },
            ].map((stat, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="p-4 transition hover-lift">
                  <div className="text-success mb-3 bg-white d-inline-block p-3 rounded-circle shadow-sm">
                    {stat.icon}
                  </div>
                  <h2 className="fw-black mb-1">{stat.value}</h2>
                  <p className="text-muted small text-uppercase fw-bold tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Values Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Values We Live By</h2>
            <div className="bg-success mx-auto" style={{ width: '50px', height: '4px' }}></div>
          </div>

          <div className="row g-4">
            {[
              {
                title: 'Pure Organic',
                desc: 'Sourced directly from certified sustainable farms.',
              },
              {
                title: 'Zero Waste',
                desc: 'Biodegradable packaging that leaves no trace behind.',
              },
              {
                title: 'Fair Trade',
                desc: 'Supporting local artisans and ethical manufacturing.',
              },
            ].map((box, i) => (
              <div className="col-md-4" key={i}>
                <div className="p-5 h-100 rounded-5 shadow-sm bg-white text-center hover-up transition">
                  <h4 className="fw-bold mb-3">{box.title}</h4>
                  <p className="text-muted">{box.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        .fw-black { font-weight: 900; }
        .italic { font-style: italic; font-family: 'Georgia', serif; }
        .tracking-wider { letter-spacing: 0.1em; }
        .transition { transition: all 0.4s ease; }
        .hover-lift:hover { transform: translateY(-10px); }
        .hover-up:hover {
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
          transform: translateY(-5px);
        }
        .floating-img { animation: float 5s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .hover-opacity-100:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

export default About;

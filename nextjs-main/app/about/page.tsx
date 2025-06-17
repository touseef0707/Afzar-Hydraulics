import React from 'react';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Afzar Hydraulics</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Pioneering hydraulic solutions for industrial excellence since 2005.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 px-6 container mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <Image 
              src="/images/hydraulic-factory.jpg" 
              alt="Afzar Hydraulics Facility"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2005, Afzar Hydraulics began as a small workshop specializing in hydraulic repairs. Today, we’re a leading manufacturer and service provider for industrial hydraulic systems across the Middle East.
            </p>
            <p className="text-gray-700 mb-4">
              With ISO 9001 certification and 50+ dedicated engineers, we deliver cutting-edge solutions for oil & gas, construction, and manufacturing sectors.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
              <p className="italic text-blue-900">
                "Precision in motion – powering industries with reliable hydraulic innovation."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="bg-blue-800 text-white py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <p className="text-5xl font-bold mb-2">18+</p>
            <p className="text-xl">Years of Experience</p>
          </div>
          <div className="p-6">
            <p className="text-5xl font-bold mb-2">500+</p>
            <p className="text-xl">Clients Worldwide</p>
          </div>
          <div className="p-6">
            <p className="text-5xl font-bold mb-2">24/7</p>
            <p className="text-xl">Technical Support</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6 container mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Innovation", icon: "⚙️", desc: "Continuous R&D in hydraulic technology" },
            { title: "Reliability", icon: "🔧", desc: "Tested solutions with 99.8% uptime guarantee" },
            { title: "Safety", icon: "🛡️", desc: "ASME and ISO compliant systems" }
          ].map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <span className="text-4xl mb-4 inline-block">{item.icon}</span>
              <h3 className="text-xl font-bold mb-3 text-blue-700">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-12 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to Power Your Operations?</h2>
          <button className="bg-white text-blue-800 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors">
            Contact Our Engineers
          </button>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
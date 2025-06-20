import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Powering Industry With <span className="text-blue-300">Hydraulic Excellence</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
              Afzar Hydraulics delivers cutting-edge hydraulic solutions for industrial applications since 2005.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/products" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-md hover:shadow-lg"
              >
                Our Products
              </Link>
              <Link 
                href="/contact" 
                className="bg-transparent hover:bg-blue-700/30 text-white font-semibold py-3 px-8 border-2 border-blue-300 rounded-lg text-lg transition duration-300 shadow-md hover:shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
      
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wide uppercase">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Trusted Hydraulic Solutions Provider
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Industry Expertise",
                description: "18+ years specializing in hydraulic systems for oil, gas, and manufacturing sectors with proven track record."
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
                title: "Custom Solutions",
                description: "Tailored hydraulic systems engineered for your specific operational requirements and challenges."
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Quality Assurance",
                description: "ISO 9001 certified with rigorous testing protocols ensuring maximum reliability and performance."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-200"
              >
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wide uppercase">Our Solutions</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Hydraulic Systems & Components
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Hydraulic Pumps",
                description: "High-performance pumps for all industrial applications with energy-efficient designs",
                image: "/images/hydraulic-pump.jpg",
                category: "Power Units"
              },
              {
                title: "Control Valves",
                description: "Precision valves for optimal system performance and flow control",
                image: "/images/control-valve.jpg",
                category: "Control Systems"
              },
              {
                title: "Hydraulic Cylinders",
                description: "Durable cylinders engineered for heavy-duty industrial operations",
                image: "/images/hydraulic-cylinder.jpg",
                category: "Actuators"
              }
            ].map((product, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image 
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/10 transition-all duration-300"></div>
                  <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <Link 
                    href="/products" 
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition group"
                  >
                    <span>Explore options</span>
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-md hover:shadow-lg"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "18+", label: "Years Experience" },
              { number: "500+", label: "Clients Served" },
              { number: "2,400+", label: "Projects Completed" },
              { number: "ISO 9001", label: "Certified Quality" }
            ].map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-blue-300 mb-2">{stat.number}</div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-8 md:p-12 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Ready to Upgrade Your Hydraulic Systems?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Our engineering team is ready to assess your needs and provide the perfect hydraulic solution tailored to your operational requirements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/contact" 
                className="bg-white hover:bg-gray-100 text-blue-800 font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-md"
              >
                Get a Free Consultation
              </Link>
              <Link 
                href="/contact" 
                className="bg-transparent hover:bg-blue-700/30 text-white font-semibold py-3 px-8 border-2 border-white rounded-lg text-lg transition duration-300 shadow-md"
              >
                Call Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
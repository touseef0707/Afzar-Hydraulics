import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Powering Industry With <span className="text-yellow-400">Hydraulic Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10">
            Afzar Hydraulics delivers cutting-edge hydraulic solutions for industrial applications since 2005.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
              Our Products
            </Link>
            <Link href="/contact" className="bg-transparent hover:bg-blue-800 text-white font-bold py-3 px-8 border-2 border-white rounded-lg text-lg transition duration-300">
              Contact Us
            </Link>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="container mx-auto px-6 pb-16">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/hydraulic-system.jpg" 
              alt="Industrial hydraulic system"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16">
            Why Choose Afzar Hydraulics?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: "⚙️",
                title: "Industry Expertise",
                description: "18+ years specializing in hydraulic systems for oil, gas, and manufacturing sectors."
              },
              {
                icon: "🔧",
                title: "Custom Solutions",
                description: "Tailored hydraulic systems designed for your specific operational needs."
              },
              {
                icon: "🛡️",
                title: "Quality Assurance",
                description: "ISO 9001 certified with rigorous testing protocols for maximum reliability."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-bold text-blue-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16">
            Our Hydraulic Solutions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Hydraulic Pumps",
                description: "High-performance pumps for all industrial applications",
                image: "/images/hydraulic-pump.jpg"
              },
              {
                title: "Control Valves",
                description: "Precision valves for optimal system performance",
                image: "/images/control-valve.jpg"
              },
              {
                title: "Cylinders",
                description: "Durable cylinders built for heavy-duty operations",
                image: "/images/hydraulic-cylinder.jpg"
              }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image 
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <Link href="/products" className="text-blue-600 font-medium hover:text-blue-800 transition">
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Upgrade Your Hydraulic Systems?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Our engineering team is ready to assess your needs and provide the perfect hydraulic solution.
          </p>
          <Link href="/contact" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 px-12 rounded-lg text-lg transition duration-300">
            Get a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}

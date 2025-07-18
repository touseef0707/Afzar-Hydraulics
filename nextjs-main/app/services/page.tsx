import React from 'react';

const page = () => {
  const services = [
    "Process Simulation",
    "Heat and Material Balance",
    "Pump Hydraulics",
    "Network Hydraulics",
    "Flare System Hydraulics",
    "Vessel and Tank Sizing",
    "Relief and Blowdown",
    "Heat Exchanger Rating (HTRI)",
    "OLGA & Pipesim",
    "Safety Studies",
    "HAZOP and SIL Workshops",
    "GHG Emission Calculation/Report",
    "Engineering Software Customization",
    "Complex Calculation Spreadsheet",
    "Energy Optimization",
    "Technical Bid Evaluation",
    "Vendor Document Review",
    "Pre-Commissioning and Commissioning Support",
    "Performance Test / FAT / SAT",
    "Training and Skill Development",
    "Coordinate third party studies",
    "AIV/FIV studies",
    "Surge(Water Hammer) Analysis"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Our Engineering Services
          </h1>
          <p className="mt-5 max-w-3xl mx-auto text-xl text-gray-500">
            Comprehensive solutions for your industrial and process engineering needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="px-6 py-8 sm:p-10">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <div className="h-6 w-6 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="ml-4 text-xl leading-7 font-semibold text-gray-900">
                    {service}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
//import React from 'react'

//const page = () => {
  //return (
    //<div>page</div>
  //)
//}

//export default page
// *********************
// Role of the component: Footer component
// Name of the component: Footer.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Footer />
// Input parameters: no input parameters
// Output: Footer component
// *********************

import { navigation } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200" aria-labelledby="footer-heading">
    <div>
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-20 pb-14">
        {/* Changed md:items-center to md:items-start to baseline align everything from the top */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
          
          {/* Logo Wrapper - -mt-5 pulls the logo graphic precisely up to meet the heading text level */}
          <div className="flex-shrink-0 -ml-4 -mt-5">
            <Image
              src="/MODERN E-COMMERCE.png"
              alt="Singitronic logo"
              width={200}
              height={60} /* Keeps container boundaries clean */
              className="h-auto w-auto object-contain"
              priority
            />
          </div>

            {/* Links Columns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-16 gap-y-10 flex-grow max-w-3xl">
              
              {/* Sale */}
              <div>
                <h3 className="text-sm font-bold text-blue-600 leading-6">
                  Sale
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.sale.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-xs text-black hover:text-gray-700 whitespace-nowrap"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About Us */}
              <div>
                <h3 className="text-sm font-bold text-blue-600 leading-6">
                  About Us
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.about.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-xs text-black hover:text-gray-700 whitespace-nowrap"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buying */}
              <div>
                <h3 className="text-sm font-bold text-blue-600">
                  Buying
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.buy.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-xs text-black hover:text-gray-700 whitespace-nowrap"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-sm font-bold text-blue-600">
                  Support
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {navigation.help.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-xs text-black hover:text-gray-700 whitespace-nowrap"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

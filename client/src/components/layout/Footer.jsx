import React from 'react';
const Footer = () => {
const currentYear = new Date().getFullYear();
return (
<footer className="bg-white border-t border-gray-200">
<div className="container mx-auto px-4 py-6">
<div className="flex flex-col md:flex-row justify-between items-center"><div className="text-sm text-gray-600">
            © {currentYear} Hospital Shift System. All rights reserved.
          </div>
          
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-6">
              <a
                href="/privacy"
                className="text-sm text-gray-600 hover:text-sky-600 transition-color
s"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sm text-gray-600 hover:text-sky-600 transition-color
s"
              >
                Terms of Service
              </a>
              <a
                href="/help"
                className="text-sm text-gray-600 hover:text-sky-600 transition-color
s"
              >
                Help Center
              </a>
              <a
                href="/contact"
                className="text-sm text-gray-600 hover:text-sky-600 transition-color
s"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          Version 1.0.0 • Designed for healthcare professionals
        </div>
      </div>
    </footer>
  );
};
export default Footer;
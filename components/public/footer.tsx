import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-serif font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Soreti Hotel
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Experience luxury and comfort at Soreti Hotel in Bedelle. We offer premium accommodations, fine dining,
              and exceptional service in the heart of the city.
            </p>
            <div className="flex items-center space-x-2 text-purple-400">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">Located in Bedelle, Ethiopia</span>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-300">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">+251 911 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">info@soretihotel.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-purple-400 mt-1" />
                <div className="text-gray-300">
                  <p>Bedelle Town Center</p>
                  <p>Bedelle, Oromia Region</p>
                  <p>Ethiopia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-300">Operating Hours</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-purple-400" />
                <div className="text-gray-300">
                  <p className="font-medium">Reception</p>
                  <p className="text-sm">24/7 Available</p>
                </div>
              </div>
              <div className="text-gray-300 text-sm space-y-1">
                <p>
                  <span className="font-medium text-purple-300">Restaurant:</span> 6:00 AM - 11:00 PM
                </p>
                <p>
                  <span className="font-medium text-purple-300">Café:</span> 6:00 AM - 10:00 PM
                </p>
                <p>
                  <span className="font-medium text-purple-300">Event Hall:</span> By Reservation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-800/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 Soreti Hotel, Bedelle. All rights reserved.</div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-purple-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

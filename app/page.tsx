"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { ManagerDashboard } from "@/components/dashboards/manager-dashboard"
import { ReceptionistDashboard } from "@/components/dashboards/receptionist-dashboard"
import { CustomerDashboard } from "@/components/dashboards/customer-dashboard"
import { CashierDashboard } from "@/components/dashboards/cashier-dashboard"
import { ChefDashboard } from "@/components/dashboards/chef-dashboard"
import { WaiterDashboard } from "@/components/dashboards/waiter-dashboard"
import { Navbar } from "@/components/public/navbar"
import { HeroSection } from "@/components/public/hero-section"
import { AboutSection } from "@/components/public/about-section"
import { RestaurantSection } from "@/components/public/restaurant-section"
import { RestaurantMenuPage } from "@/components/restaurant/restaurant-menu-page"
import { CafeMenuPage } from "@/components/cafe/cafe-menu-page"
import { HallBookingPage } from "@/components/hall/hall-booking-page"
import { BedroomBookingPage } from "@/components/bedroom/bedroom-booking-page"
import { SnacksMenuPage } from "@/components/snacks/snacks-menu-page"
import { Footer } from "@/components/public/footer"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

function PublicWebsite() {
  const [showLogin, setShowLogin] = useState(false)
  const [currentSection, setCurrentSection] = useState("home")

  const handleNavigate = (section: string) => {
    if (section === "dashboard") {
      setShowLogin(true)
    } else {
      setCurrentSection(section)
    }
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Button variant="ghost" onClick={() => setShowLogin(false)} className="mb-4">
              ← Back to Website
            </Button>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Staff Login</h1>
          </div>
          <LoginForm />
        </div>
      </div>
    )
  }

  if (currentSection === "restaurant") {
    return (
      <div className="min-h-screen">
        <Navbar onNavigate={handleNavigate} currentSection={currentSection} />
        <RestaurantMenuPage />
        <Footer />
      </div>
    )
  }

  if (currentSection === "cafe") {
    return (
      <div className="min-h-screen">
        <Navbar onNavigate={handleNavigate} currentSection={currentSection} />
        <CafeMenuPage />
        <Footer />
      </div>
    )
  }

  if (currentSection === "hall") {
    return (
      <div className="min-h-screen">
        <Navbar onNavigate={handleNavigate} currentSection={currentSection} />
        <HallBookingPage />
        <Footer />
      </div>
    )
  }

  if (currentSection === "bedroom") {
    return (
      <div className="min-h-screen">
        <Navbar onNavigate={handleNavigate} currentSection={currentSection} />
        <BedroomBookingPage />
        <Footer />
      </div>
    )
  }

  if (currentSection === "snacks") {
    return (
      <div className="min-h-screen">
        <Navbar onNavigate={handleNavigate} currentSection={currentSection} />
        <SnacksMenuPage />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={handleNavigate} currentSection={currentSection} />
      <HeroSection />
      <AboutSection />
      <RestaurantSection />

      {/* Hall Section */}
      <section id="hall" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Event Halls</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Host unforgettable events in our elegant halls, perfect for weddings, conferences, and special
              celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <img src="/elegant-event-hall.png" alt="Event Hall" className="rounded-2xl shadow-2xl" />
            </div>
            <div className="animate-slide-in-right">
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-6">Grand Ballroom</h3>
              <p className="text-lg text-gray-600 mb-6">
                Our magnificent Grand Ballroom accommodates up to 500 guests with crystal chandeliers, premium sound
                systems, and customizable lighting for any occasion.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Capacity: 500 guests</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Professional AV equipment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Dedicated event planning team</span>
                </div>
              </div>
              <Button className="gradient-primary text-white hover:opacity-90 transition-opacity">
                Book Event Hall
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Café Section */}
      <section id="cafe" className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Soreti Café</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start your day with artisan coffee, fresh pastries, and light meals in our cozy café atmosphere.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up">
              <img
                src="/artisan-coffee.png"
                alt="Coffee"
                className="w-full h-64 object-cover rounded-2xl shadow-lg mb-6"
              />
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Artisan Coffee</h3>
              <p className="text-gray-600">Premium single-origin beans expertly roasted and brewed to perfection</p>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <img
                src="/fresh-pastries.png"
                alt="Pastries"
                className="w-full h-64 object-cover rounded-2xl shadow-lg mb-6"
              />
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Fresh Pastries</h3>
              <p className="text-gray-600">
                Daily baked croissants, muffins, and artisan breads made with finest ingredients
              </p>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <img
                src="/healthy-meals.png"
                alt="Light Meals"
                className="w-full h-64 object-cover rounded-2xl shadow-lg mb-6"
              />
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Light Meals</h3>
              <p className="text-gray-600">Nutritious salads, sandwiches, and soups perfect for any time of day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Snacks Section */}
      <section id="snacks" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Gourmet Snacks</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Satisfy your cravings with our selection of premium snacks and treats available 24/7.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Truffle Popcorn", price: "$12", image: "/truffle-popcorn.png" },
              { name: "Artisan Nuts", price: "$15", image: "/artisan-nuts.png" },
              { name: "Chocolate Delights", price: "$18", image: "/chocolate-delights.png" },
              { name: "Fresh Fruit Bowl", price: "$14", image: "/fresh-fruit-bowl.png" },
            ].map((snack, index) => (
              <div
                key={snack.name}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={snack.image || "/placeholder.svg"}
                  alt={snack.name}
                  className="w-full h-48 object-cover rounded-xl shadow-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{snack.name}</h3>
                <p className="text-purple-600 font-bold">{snack.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Contact Us</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to experience luxury? Get in touch with us to make a reservation or learn more about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-4">Address</h3>
              <p className="text-gray-300">
                Bedelle Town Center
                <br />
                Bedelle, Oromia Region
                <br />
                Ethiopia
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">
                Phone: +251 911 123 456
                <br />
                Email: info@soretihotel.com
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Hours</h3>
              <p className="text-gray-300">
                24/7 Reception
                <br />
                Restaurant: 6 AM - 11 PM
                <br />
                Café: 6 AM - 10 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />

      {/* Staff Login Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setShowLogin(true)}
          className="gradient-primary text-white shadow-2xl hover:opacity-90 transition-opacity animate-pulse-glow"
          size="lg"
        >
          <LogIn className="mr-2 h-5 w-5" />
          Dashboard
        </Button>
      </div>
    </div>
  )
}

function DashboardContent() {
  const { user } = useAuth()

  if (user?.role === "admin") {
    return <AdminDashboard />
  }

  if (user?.role === "manager") {
    return <ManagerDashboard />
  }

  if (user?.role === "waiter") {
    return <WaiterDashboard />
  }

  if (user?.role === "receptionist") {
    return <ReceptionistDashboard />
  }

  if (user?.role === "customer") {
    return <CustomerDashboard />
  }

  if (user?.role === "cashier") {
    return <CashierDashboard />
  }

  if (user?.role === "chef") {
    return <ChefDashboard />
  }

  return <div>Dashboard content for {user?.role}</div>
}

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Soreti Hotel...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <PublicWebsite />
  }

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}
// lib/api.ts
export async function fetchJson<T = any>(
  url: string,
  init?: RequestInit & { body?: any }
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  };

  const res = await fetch(url, {
    ...init,
    headers,
    body:
      typeof init?.body === "string"
        ? init.body
        : init?.body
        ? JSON.stringify(init.body)
        : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

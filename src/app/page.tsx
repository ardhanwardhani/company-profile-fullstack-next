import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Company Profile
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
              <Link href="/careers" className="text-gray-600 hover:text-gray-900">
                Careers
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="bg-primary-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold mb-6">
              Building the Future Together
            </h1>
            <p className="text-xl mb-8 opacity-90">
              We create innovative solutions that make a difference.
            </p>
            <div className="flex space-x-4">
              <Link href="/careers" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Join Our Team
              </Link>
              <Link href="/about" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Web Development</h3>
                <p className="text-gray-600">
                  Modern web applications built with the latest technologies.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Cloud Solutions</h3>
                <p className="text-gray-600">
                  Scalable cloud infrastructure for growing businesses.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Consulting</h3>
                <p className="text-gray-600">
                  Expert advice to help you make better technical decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Company Profile. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

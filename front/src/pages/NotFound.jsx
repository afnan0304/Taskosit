import { Link } from 'react-router-dom'
import { FiCompass, FiSearch, FiHome } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 flex items-center">
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-3xl shadow-soft-lg overflow-hidden border border-surface-100">
          <div className="grid md:grid-cols-2">
            <div className="p-10 bg-gradient-to-br from-primary-600 to-primary-500 text-white flex flex-col justify-center items-start space-y-6">
              <div className="text-6xl font-extrabold tracking-tight">404</div>
              <h1 className="text-2xl font-display font-bold">Page not found</h1>
              <p className="text-surface-100/90 max-w-md">Looks like the page you're looking for has wandered off. It might be hiding, relocated, or never existed. Let's get you back on track.</p>
              <div className="flex items-center space-x-3">
                <Link to="/" className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-primary-600 font-semibold shadow-sm hover:translate-y-0.5 transition-transform">
                  <FiHome className="mr-2" /> Go home
                </Link>
                <Link to="/tasks" className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition-colors">
                  <FiCompass className="mr-2" /> Explore tasks
                </Link>
              </div>
            </div>

            <div className="p-10">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-surface-900">Here are a few helpful links</h2>
                <p className="text-sm text-surface-600 mt-2">You can search, go to the dashboard, or explore the tasks page to continue.</p>
              </div>

              <div className="space-y-4">
                <Link to="/" className="flex items-center justify-between p-4 rounded-xl border border-surface-100 hover:shadow-soft transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-primary-50 p-3">
                      <FiHome className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900">Dashboard</p>
                      <p className="text-sm text-surface-600">Return to the app home and see your overview</p>
                    </div>
                  </div>
                  <div className="text-sm text-surface-400">Open</div>
                </Link>

                <Link to="/tasks" className="flex items-center justify-between p-4 rounded-xl border border-surface-100 hover:shadow-soft transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-success-50 p-3">
                      <FiSearch className="text-success-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900">Tasks</p>
                      <p className="text-sm text-surface-600">Browse and manage your tasks</p>
                    </div>
                  </div>
                  <div className="text-sm text-surface-400">Open</div>
                </Link>

                <Link to="/analytics" className="flex items-center justify-between p-4 rounded-xl border border-surface-100 hover:shadow-soft transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-warning-50 p-3">
                      <FiCompass className="text-warning-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900">Analytics</p>
                      <p className="text-sm text-surface-600">View productivity insights</p>
                    </div>
                  </div>
                  <div className="text-sm text-surface-400">Open</div>
                </Link>
              </div>

              <div className="mt-8 text-sm text-surface-500">
                <p>If you think this is a mistake, check the URL or contact support.</p>
                <p className="mt-2">Tip: Press <span className="font-medium">Esc</span> to clear search or try the navigation menu.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

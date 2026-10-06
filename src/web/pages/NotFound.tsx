import { Link } from 'react-router-dom';
import { SEO } from '../../shared/components/ui/SEO';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-primary text-primary p-8">
      <SEO title="Page Not Found" description="The page you are looking for does not exist." path="/404" />
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Page not found.</p>
      <Link to="/" className="rounded-xl bg-accent-blue px-5 py-3 text-white font-medium hover:bg-blue-600">
        Go home
      </Link>
    </main>
  );
}

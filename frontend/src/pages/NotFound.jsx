import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="grid min-h-screen place-items-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-royal-900">Page not found</h1>
      <Link className="mt-3 inline-block text-royal-700" to="/login">Back to login</Link>
    </div>
  </div>
);

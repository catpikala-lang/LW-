import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FBEvents } from '../utils/facebookPixel';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Firebase email/password sign-in
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('adminEmail', email);
      FBEvents.completeRegistration();
      navigate('/admin');
    } catch (err) {
      setError('ইমেইল বা পাসওয়ার্ড ভুল!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-gray-600 mt-2">Leather Wallah Admin Panel</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="catpikala@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="btn-primary w-full py-3"
            >
              Login to Admin Panel
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            শুধুমাত্র Authorized Email দিয়ে Access করা যাবে
          </div>
        </div>
      </div>
    </div>
  );
}
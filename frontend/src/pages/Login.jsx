import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, Loader2, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const success = await login(data.email, data.password);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-stretch select-none">
      {/* LEFT COLUMN (40%): Premium Branding Panel */}
      <div className="hidden lg:flex w-[40%] bg-gray-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Subtle background lines/roads styling */}
        <div className="absolute inset-0 opacity-10 road-lane-pattern" />

        {/* Top Branding logo */}
        <div className="flex items-center space-x-2.5 z-10">
          <div className="bg-lifelink-green p-2.5 rounded-xl text-white shadow-lg shadow-green-700/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">LifeLink</span>
        </div>

        {/* Center Taglines */}
        <div className="space-y-6 z-10 max-w-sm">
          <div className="inline-flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full text-lifelink-green text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Telemetry Ecosystem</span>
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-tight">
            Protecting Lives on Every Road.
          </h2>
          <p className="text-xs font-semibold text-gray-400 leading-relaxed">
            LifeLink bridges the gap between mechanical sensor anomalies and paramedics networks to automate collision dispatches.
          </p>
        </div>

        {/* Bottom footer credit */}
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider z-10">
          © 2026 LifeLink Systems Inc.
        </p>
      </div>

      {/* RIGHT COLUMN (60%): Clean Login Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-premium">
          {/* Form Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
              Welcome back to LifeLink
            </h1>
            <p className="text-xs font-semibold text-gray-400 leading-none">
              Access your driver cockpit monitoring panel.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 pl-10 pr-4 py-3 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.email ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              </div>
              {errors.email && (
                <span className="text-[10px] font-bold text-lifelink-red tracking-wide">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 pl-10 pr-4 py-3 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.password ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              </div>
              {errors.password && (
                <span className="text-[10px] font-bold text-lifelink-red tracking-wide">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lifelink-green hover:bg-green-700 text-white border border-green-700 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-[0.98] select-none text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Access Cockpit</span>
              )}
            </button>
          </form>

          {/* Form Footer */}
          <p className="text-xs font-bold text-gray-400 text-center mt-6 tracking-wide leading-none">
            Don't have an account?{' '}
            <Link to="/register" className="text-lifelink-green hover:underline">
              Create Free Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

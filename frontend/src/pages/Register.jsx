import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, User, Mail, Phone, Lock, Loader2, Sparkles } from 'lucide-react';

const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const success = await signup(data.name, data.email, data.password, data.mobile);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/onboarding');
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
          <img src="/logo.png" alt="IntelSOS Logo" className="h-9 w-auto object-contain bg-white/10 p-1 rounded-lg border border-white/10" />
          <span className="font-extrabold text-xl tracking-tight">IntelSOS</span>
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
            IntelSOS bridges the gap between mechanical sensor anomalies and paramedics networks to automate collision dispatches.
          </p>
        </div>

        {/* Bottom footer credit */}
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider z-10">
          © 2026 IntelSOS Systems Inc.
        </p>
      </div>

      {/* RIGHT COLUMN (60%): Clean Register Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-lg bg-white border border-gray-100 p-8 rounded-3xl shadow-premium my-8">
          {/* Form Header */}
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
              Create IntelSOS Account
            </h1>
            <p className="text-xs font-semibold text-gray-400 leading-none">
              Register to synchronize your vehicle and emergency profiles.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name', { required: 'Full Name is required' })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 pl-10 pr-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.name ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.name && (
                <span className="text-[9px] font-bold text-lifelink-red tracking-wide leading-none">{errors.name.message}</span>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="john@company.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 pl-10 pr-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.email ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.email && (
                <span className="text-[9px] font-bold text-lifelink-red tracking-wide leading-none">{errors.email.message}</span>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Mobile Number (SOS Target)</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...register('mobile', { 
                    required: 'Mobile is required',
                    pattern: {
                      value: /^\+?[0-9\s-]{10,14}$/,
                      message: 'Invalid phone number format'
                    }
                  })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 pl-10 pr-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.mobile ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.mobile && (
                <span className="text-[9px] font-bold text-lifelink-red tracking-wide leading-none">{errors.mobile.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 pl-10 pr-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.password ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.password && (
                <span className="text-[9px] font-bold text-lifelink-red tracking-wide leading-none">{errors.password.message}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Repeat your password"
                  {...register('confirmPassword', { 
                    required: 'Confirm Password is required',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 pl-10 pr-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.confirmPassword ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.confirmPassword && (
                <span className="text-[9px] font-bold text-lifelink-red tracking-wide leading-none">{errors.confirmPassword.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lifelink-green hover:bg-green-700 text-white border border-green-700 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-[0.98] select-none mt-2 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register Platform</span>
              )}
            </button>
          </form>

          {/* Form Footer */}
          <p className="text-xs font-bold text-gray-400 text-center mt-5 tracking-wide leading-none">
            Already have an account?{' '}
            <Link to="/login" className="text-lifelink-green hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

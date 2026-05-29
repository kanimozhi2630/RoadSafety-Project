import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  Car, 
  Truck, 
  Bike, 
  Droplet, 
  FileText, 
  Camera, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  Languages
} from 'lucide-react';
import toast from 'react-hot-toast';

const Onboarding = () => {
  const { user, updateOnboarding } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(user?.onboardingStep || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Custom states for steps
  const [vehicleType, setVehicleType] = useState('Car');
  const [profilePicBase64, setProfilePicBase64] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      emergencyContact1: user?.emergencyContact1 || '',
      relationship1: user?.relationship1 || '',
      emergencyContact2: user?.emergencyContact2 || '',
      relationship2: user?.relationship2 || '',
      bloodGroup: user?.bloodGroup || 'O+',
      allergies: user?.allergies || '',
      medicalNotes: user?.medicalNotes || '',
      vehicleModel: user?.vehicleModel || '',
      vehicleColor: user?.vehicleColor || '',
      plateNumber: user?.plateNumber || '',
      age: user?.age || '',
      gender: user?.gender || 'Male',
      licenseNumber: user?.licenseNumber || '',
      preferredLanguage: user?.preferredLanguage || 'English'
    }
  });

  // Handle Profile Picture base64 conversion
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicBase64(reader.result);
        toast.success('📷 Profile picture uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicBase64(reader.result);
        toast.success('📷 Profile picture dragged & uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    let payload = { ...data };
    if (currentStep === 2) {
      payload.vehicleType = vehicleType;
    }
    if (currentStep === 3) {
      payload.profilePicture = profilePicBase64;
    }

    const success = await updateOnboarding(currentStep, payload);
    setIsSubmitting(false);

    if (success) {
      if (currentStep === 3) {
        setShowSuccessOverlay(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 select-none relative">
      {/* Top logo */}
      <div className="flex items-center space-x-2.5 mb-8">
        <img src="/logo.png" alt="IntelSOS Logo" className="h-9 w-auto object-contain" />
        <span className="font-extrabold text-xl text-gray-900 tracking-tight">IntelSOS</span>
      </div>

      {/* Main onboarding card container */}
      <div className="w-full max-w-2xl bg-white border border-gray-100 p-8 rounded-3xl shadow-premium relative">
        
        {/* Step Progress indicators */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
          <div className="flex items-center space-x-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 1 ? 'bg-lifelink-green text-white' : 'bg-gray-100 text-gray-400'
            }`}>1</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStep >= 1 ? 'text-gray-800' : 'text-gray-400'}`}>Emergency Vitals</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-100 mx-4" />
          <div className="flex items-center space-x-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 2 ? 'bg-lifelink-green text-white' : 'bg-gray-100 text-gray-400'
            }`}>2</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStep >= 2 ? 'text-gray-800' : 'text-gray-400'}`}>Vehicle Profile</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-100 mx-4" />
          <div className="flex items-center space-x-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 3 ? 'bg-lifelink-green text-white' : 'bg-gray-100 text-gray-400'
            }`}>3</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStep >= 3 ? 'text-gray-800' : 'text-gray-400'}`}>Driver Profile</span>
          </div>
        </div>

        {/* STEP 1: Emergency Contacts & Vitals */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1 mb-2">
              <h2 className="text-lg font-black text-gray-900 leading-none flex items-center gap-1.5">
                <Droplet className="w-5 h-5 text-lifelink-red fill-current animate-pulse" />
                Emergency Vitals Setup
              </h2>
              <p className="text-xs text-gray-400 font-semibold leading-none">Configure emergency contacts to ping in accident alerts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emergency Contact 1 */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Primary Contact Mobile</label>
                <input
                  type="text"
                  placeholder="+91 90000 00001"
                  {...register('emergencyContact1', { required: 'Emergency Contact is required' })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.emergencyContact1 ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                {errors.emergencyContact1 && (
                  <span className="text-[9px] font-bold text-lifelink-red leading-none">{errors.emergencyContact1.message}</span>
                )}
              </div>

              {/* Relationship 1 */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Relationship</label>
                <input
                  type="text"
                  placeholder="Spouse / Parent"
                  {...register('relationship1', { required: 'Relationship is required' })}
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              {/* Emergency Contact 2 */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Secondary Contact Mobile</label>
                <input
                  type="text"
                  placeholder="+91 90000 00002"
                  {...register('emergencyContact2')}
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              {/* Relationship 2 */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Relationship</label>
                <input
                  type="text"
                  placeholder="Friend / Sibling"
                  {...register('relationship2')}
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              {/* Blood Group Dropdown */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Blood Group</label>
                <select
                  {...register('bloodGroup')}
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200 bg-white"
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>

              {/* Allergies */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Known Allergies</label>
                <input
                  type="text"
                  placeholder="Penicillin, Peanuts (or None)"
                  {...register('allergies')}
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>
            </div>

            {/* Medical Notes */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block font-bold">Important Medical Notes</label>
              <textarea
                placeholder="List cardiac histories, medications, or surgical implants..."
                {...register('medicalNotes')}
                rows="2"
                className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lifelink-green hover:bg-green-700 text-white border border-green-700 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] select-none text-white"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Save & Continue'}
            </button>
          </form>
        )}

        {/* STEP 2: Vehicle Information */}
        {currentStep === 2 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1 mb-2">
              <h2 className="text-lg font-black text-gray-900 leading-none flex items-center gap-1.5">
                <Car className="w-5 h-5 text-lifelink-green" />
                Vehicle Profile Configurations
              </h2>
              <p className="text-xs text-gray-400 font-semibold leading-none">Register your transport properties to map crash impacts.</p>
            </div>

            {/* Vehicle Type Selection Cards */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Select Vehicle Type</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'Car', label: 'Passenger Car', icon: Car },
                  { id: 'Truck', label: 'Commercial Truck', icon: Truck },
                  { id: 'Motorcycle', label: 'Motorcycle', icon: Bike }
                ].map((type) => {
                  const Icon = type.icon;
                  const isActive = vehicleType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setVehicleType(type.id)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all ${
                        isActive
                          ? 'border-lifelink-green bg-green-50 text-lifelink-green ring-1 ring-lifelink-green/10 shadow-sm font-bold'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-500 font-medium'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-[10px] uppercase tracking-wider">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Model */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Vehicle Model</label>
                <input
                  type="text"
                  placeholder="Tesla Model 3"
                  {...register('vehicleModel', { required: 'Model is required' })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.vehicleModel ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                {errors.vehicleModel && (
                  <span className="text-[9px] font-bold text-lifelink-red leading-none">{errors.vehicleModel.message}</span>
                )}
              </div>

              {/* Color */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Vehicle Color</label>
                <input
                  type="text"
                  placeholder="Solid Black"
                  {...register('vehicleColor', { required: 'Color is required' })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.vehicleColor ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                {errors.vehicleColor && (
                  <span className="text-[9px] font-bold text-lifelink-red leading-none">{errors.vehicleColor.message}</span>
                )}
              </div>

              {/* Plate Number */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Plate Number</label>
                <input
                  type="text"
                  placeholder="TN-37-BY-1234"
                  {...register('plateNumber', { required: 'Plate Number is required' })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.plateNumber ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                {errors.plateNumber && (
                  <span className="text-[9px] font-bold text-lifelink-red leading-none">{errors.plateNumber.message}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lifelink-green hover:bg-green-700 text-white border border-green-700 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] select-none text-white"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Save & Continue'}
            </button>
          </form>
        )}

        {/* STEP 3: Driver Profiles */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1 mb-2">
              <h2 className="text-lg font-black text-gray-900 leading-none flex items-center gap-1.5">
                <User className="w-5 h-5 text-lifelink-green" />
                Driver Profile Alignment
              </h2>
              <p className="text-xs text-gray-400 font-semibold leading-none">Complete final driver credentials to activate cockpit dashboards.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Age */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Driver Age</label>
                <input
                  type="number"
                  placeholder="28"
                  {...register('age', { 
                    required: 'Age is required',
                    min: { value: 16, message: 'Must be 16+' }
                  })}
                  className={`w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none ${
                    errors.age ? 'border-lifelink-red' : 'border-gray-200'
                  }`}
                />
                {errors.age && (
                  <span className="text-[9px] font-bold text-lifelink-red leading-none">{errors.age.message}</span>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Driver License Number */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">License Number (Optional)</label>
                <input
                  type="text"
                  placeholder="DL-04202300056"
                  {...register('licenseNumber')}
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              {/* Preferred Language */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  Emergency Voice Language
                </label>
                <select
                  {...register('preferredLanguage')}
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200 bg-white"
                >
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            {/* Profile Picture Drag & Drop area */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Driver Profile Picture</label>
              
              <div 
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center space-y-2.5 relative select-none ${
                  dragActive ? 'border-lifelink-green bg-green-50/20' : 'border-gray-200 bg-gray-50/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {profilePicBase64 ? (
                  <div className="flex flex-col items-center space-y-2">
                    <img 
                      src={profilePicBase64} 
                      alt="Profile preview" 
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-lifelink-green/20"
                    />
                    <button 
                      type="button" 
                      onClick={() => setProfilePicBase64('')}
                      className="text-[9px] font-extrabold text-lifelink-red uppercase hover:underline"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">Drag & drop profile photo here</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Supports PNG, JPG up to 2MB</p>
                    </div>
                    
                    <label className="bg-white border px-3 py-1.5 rounded-xl text-[10px] font-bold text-gray-600 hover:bg-gray-50 cursor-pointer shadow-sm">
                      Browse Files
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lifelink-green hover:bg-green-700 text-white border border-green-700 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] select-none text-white"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Complete Setup Activation'}
            </button>
          </form>
        )}

      </div>

      {/* Completion Overlay success checkmark */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white backdrop-blur-md animate-float">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <CheckCircle2 className="w-16 h-16 text-lifelink-green animate-[pulseSafe_1.5s_infinite]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-lifelink-green rounded-full animate-ping" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none flex items-center gap-1 justify-center">
                <Sparkles className="w-6 h-6 text-lifelink-amber fill-current" />
                IntelSOS Interface Active
              </h2>
              <p className="text-xs font-semibold text-gray-400 max-w-xs mx-auto leading-relaxed">
                Authentication and physical telemetry nodes synchronized. Redirecting to driver cockpit cockpit...
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Onboarding;

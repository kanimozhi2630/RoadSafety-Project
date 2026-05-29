import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  Heart, 
  Droplet, 
  FileText, 
  AlertOctagon, 
  Car, 
  Truck, 
  Bike, 
  Tag, 
  Camera, 
  Save, 
  Loader2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  // Emergency & Medical
  const [emergencyContact1, setEmergencyContact1] = useState('');
  const [relationship1, setRelationship1] = useState('');
  const [emergencyContact2, setEmergencyContact2] = useState('');
  const [relationship2, setRelationship2] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  // Vehicle
  const [vehicleType, setVehicleType] = useState('Car');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  // Set default values from current user context
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
      setAge(user.age || '');
      setGender(user.gender || 'Male');
      setLicenseNumber(user.licenseNumber || '');
      setProfilePicture(user.profilePicture || '');

      setEmergencyContact1(user.emergencyContact1 || '');
      setRelationship1(user.relationship1 || '');
      setEmergencyContact2(user.emergencyContact2 || '');
      setRelationship2(user.relationship2 || '');
      setBloodGroup(user.bloodGroup || 'O+');
      setAllergies(user.allergies || '');
      setMedicalNotes(user.medicalNotes || '');

      setVehicleType(user.vehicleType || 'Car');
      setVehicleModel(user.vehicleModel || '');
      setVehicleColor(user.vehicleColor || '');
      setPlateNumber(user.plateNumber || '');
    }
  }, [user]);

  // Handle image upload and base64 conversion
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size exceeds 2MB limit!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        toast.success('📷 Profile photo loaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Full Name is required!');
    if (!email.trim()) return toast.error('Email Address is required!');
    if (!mobile.trim()) return toast.error('Mobile Number is required!');

    setIsSubmitting(true);
    const updatedData = {
      name,
      email,
      mobile,
      age: age ? Number(age) : null,
      gender,
      licenseNumber,
      profilePicture,
      emergencyContact1,
      relationship1,
      emergencyContact2,
      relationship2,
      bloodGroup,
      allergies,
      medicalNotes,
      vehicleType,
      vehicleModel,
      vehicleColor,
      plateNumber
    };

    const success = await updateProfile(updatedData);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-lifelink-green fill-current animate-pulse" />
            Profile & Settings Dashboard
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Manage your personal vitals, emergency contacts, and simulated hardware vehicle telemetry configurations.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 bg-lifelink-green hover:bg-green-700 disabled:bg-gray-300 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-green-50 transition-all transform active:scale-95 shrink-0 self-start md:self-center"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <>
              <Save className="w-4 h-4 text-white" />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center relative overflow-hidden group">
            {/* Top glassmorphic decoration */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-50" />
            
            <div className="relative mt-4 flex flex-col items-center">
              {/* Photo upload */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md group/img cursor-pointer">
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Driver Profile" 
                    className="w-full h-full object-cover transition-transform group-hover/img:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                  <Camera className="w-4 h-4 mb-1" />
                  <span>Update Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>

              <h2 className="text-base font-extrabold text-gray-900 mt-4 leading-none">{name || 'Driver Profile'}</h2>
              <p className="text-[10px] font-bold text-lifelink-green uppercase tracking-widest mt-1">IntelSOS Certified Driver</p>
              
              <div className="w-full border-t border-gray-100 my-4" />

              {/* Status details */}
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-400">License Number</span>
                  <span className="font-bold text-gray-700">{licenseNumber || 'Not Configured'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-400">System ID</span>
                  <span className="font-mono text-[10px] font-bold text-gray-500">{user?.id?.substring(0, 12) || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-400">Join Date</span>
                  <span className="font-bold text-gray-700">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Interface Telemetry</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50/50 p-3 rounded-xl text-center border border-green-100/50">
                <span className="text-[9px] font-black text-green-600 uppercase block tracking-wider">IoT Sim</span>
                <span className="text-base font-black text-green-700 mt-0.5 block">ACTIVE</span>
              </div>
              <div className="bg-blue-50/50 p-3 rounded-xl text-center border border-blue-100/50">
                <span className="text-[9px] font-black text-blue-600 uppercase block tracking-wider">SOS Link</span>
                <span className="text-base font-black text-blue-700 mt-0.5 block">READY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Main Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Core Personal Info */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-50 pb-3">
              <User className="w-4 h-4 text-lifelink-green" />
              Core Driver Credentials
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <User className="w-3 h-3 text-gray-400" /> Full Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" /> Mobile Number
                </label>
                <input 
                  type="text" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 90000 00000"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" /> Age
                  </label>
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="28"
                    className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    Gender
                  </label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Award className="w-3 h-3 text-gray-400" /> Driver License Number
                </label>
                <input 
                  type="text" 
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="DL-04202300056"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Emergency & Medical Info */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-50 pb-3">
              <Heart className="w-4 h-4 text-lifelink-red animate-pulse" />
              Emergency Vitals & Contacts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Primary Contact Mobile</label>
                <input 
                  type="text" 
                  value={emergencyContact1}
                  onChange={(e) => setEmergencyContact1(e.target.value)}
                  placeholder="+91 90000 00001"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Relationship</label>
                <input 
                  type="text" 
                  value={relationship1}
                  onChange={(e) => setRelationship1(e.target.value)}
                  placeholder="Spouse / Parent"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Secondary Contact Mobile</label>
                <input 
                  type="text" 
                  value={emergencyContact2}
                  onChange={(e) => setEmergencyContact2(e.target.value)}
                  placeholder="+91 90000 00002"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Relationship</label>
                <input 
                  type="text" 
                  value={relationship2}
                  onChange={(e) => setRelationship2(e.target.value)}
                  placeholder="Friend / Sibling"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-lifelink-red fill-current" /> Blood Group
                </label>
                <select 
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
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

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5 text-orange-500" /> Known Allergies
                </label>
                <input 
                  type="text" 
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Penicillin, Peanuts (or None)"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-gray-400" /> Important Medical Notes
                </label>
                <textarea 
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="List cardiac histories, medications, or surgical implants..."
                  rows="3"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Vehicle Info */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-50 pb-3">
              <Car className="w-4 h-4 text-lifelink-green" />
              Simulated Telemetry Vehicle Profile
            </h3>

            <div className="space-y-3">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Vehicle Type</label>
              <div className="grid grid-cols-3 gap-3">
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
                      className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all ${
                        isActive
                          ? 'border-lifelink-green bg-green-50 text-lifelink-green shadow-sm font-bold'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-500'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5" />
                      <span className="text-[9px] uppercase tracking-wider leading-none">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Vehicle Model</label>
                <input 
                  type="text" 
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="Tesla Model 3"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Vehicle Color</label>
                <input 
                  type="text" 
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  placeholder="Solid Black"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block flex items-center gap-1">
                  <Tag className="w-3 h-3 text-gray-400" /> Plate Number
                </label>
                <input 
                  type="text" 
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="TN-37-BY-1234"
                  className="w-full text-xs font-semibold border bg-gray-50/50 px-4 py-2.5 rounded-xl transition-all focus:bg-white focus:ring-1 focus:ring-lifelink-green outline-none border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Action Footer */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 bg-lifelink-green hover:bg-green-700 disabled:bg-gray-300 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md shadow-green-50 transition-all transform active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <Save className="w-4.5 h-4.5 text-white" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

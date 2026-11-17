'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCars } from '@/context/CarContext';
import { InventoryCar, SiteBranding, POPULAR_BANGLADESH_CATEGORIES, BANGLADESH_POPULAR_MODELS } from '@/types';
import { convertGoogleDriveUrl } from '@/lib/drive';
import { AVAILABLE_3D_MODELS } from '@/data/cars';
import { DEFAULT_USD_TO_BDT_RATE, formatBDT } from '@/lib/financeUtils';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Car,
  Users,
  Settings,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink,
  LogOut,
  UserPlus,
  Box,
  Eye,
  Palette,
  Sparkles,
  Shield,
  Zap,
  Flame,
  Crown,
  Upload,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPage() {
  const router = useRouter();
  const { t, isBn, toBnDigits } = useLanguage();
  const {
    cars,
    addCar,
    deleteCar,
    updateCar,
    featuredModelUrl,
    setFeaturedModelUrl,
    adminList,
    addAdmin,
    removeAdmin,
    loggedInUser,
    loginWithGoogle,
    logout,
    userLogs,
    bookings,
    branding,
    updateBranding,
  } = useCars();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'fleet' | 'model' | 'logs' | 'admins' | 'branding'>('fleet');

  // Form states for adding/editing a car
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);

  // Branding Form State
  const [brandingForm, setBrandingForm] = useState<SiteBranding>(branding);
  const [brandingSuccessMsg, setBrandingSuccessMsg] = useState('');

  const [carForm, setCarForm] = useState({
    name: '',
    tagline: '',
    category: 'Luxury SUV',
    price: 145000,
    formattedPrice: '$145,000',
    year: 2025,
    status: 'In Stock' as 'In Stock' | 'Rare Spec' | 'Arriving Soon' | 'Custom Order',
    image: '',
    model3dUrl: '/models/chevy-suv.glb',
    horsepower: 1000,
    zeroToSixty: '2.0s',
    topSpeed: '240 mph',
    range: '400 mi',
    powertrain: 'Quad-Motor Electric AWD',
    torque: '1,400 Nm',
    dragCoefficient: '0.210 Cd',
    curbWeight: '1,750 kg',
    description: '',
    features: 'Carbon Ceramic Brakes\nActive Aero Wing\nTelemetry HUD',
  });

  // Admin access state
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');

  // Custom Model URL state
  const [customModelUrl, setCustomModelUrl] = useState(featuredModelUrl);
  const [modelSuccessMsg, setModelSuccessMsg] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync brandingForm when branding loads
  useEffect(() => {
    if (branding) {
      setBrandingForm(branding);
    }
  }, [branding]);

  // Sync customModelUrl with featuredModelUrl
  useEffect(() => {
    if (featuredModelUrl) {
      setCustomModelUrl(featuredModelUrl);
    }
  }, [featuredModelUrl]);

  // Handle logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandingForm((prev) => ({
          ...prev,
          logoType: 'image',
          logoImageUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding(brandingForm);
    setBrandingSuccessMsg('Branding and Logo updated successfully! All navigation headers, footers, and badges are now live.');
    setTimeout(() => setBrandingSuccessMsg(''), 5000);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center font-mono text-xs text-neutral-400">
          Loading command center...
        </main>
        <Footer />
      </div>
    );
  }

  // If not logged in as admin, show login gate
  if (!loggedInUser || (loggedInUser.role !== 'admin' && loggedInUser.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-36 text-center">
          <div className="max-w-md w-full bg-[#0a0c13]/80 border border-white/15 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
            <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">
              {isBn ? 'অ্যাডমিন অনুমতি আবশ্যক' : 'Admin Authorization Required'}
            </h1>
            <p className="text-neutral-400 text-xs mt-2">
              {isBn
                ? 'এই কন্ট্রোল স্যুট অ্যাক্সেস করতে অনুমোদিত জিমেইল অ্যাকাউন্ট দিয়ে সাইন ইন করতে হবে।'
                : 'You must authenticate with an authorized Gmail account to access this control suite.'}
            </p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => {
                  loginWithGoogle('admin@apexmotors.com', 'Shihab (Super Admin)');
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black text-xs font-bold uppercase tracking-wider font-mono cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {isBn ? 'সুপার অ্যাডমিন হিসেবে প্রবেশ করুন' : 'Instant Enter as Super Admin'}
              </button>
              <Link
                href="/admin/login"
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 text-xs font-mono uppercase tracking-wider border border-white/10 flex items-center justify-center"
              >
                {isBn ? 'জিমেইল লগইন পেজে যান' : 'Go to Gmail Login'}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedImg = convertGoogleDriveUrl(carForm.image);

    const carData = {
      name: carForm.name,
      tagline: carForm.tagline,
      category: carForm.category,
      price: Number(carForm.price),
      formattedPrice: `$${Number(carForm.price).toLocaleString()}`,
      year: Number(carForm.year),
      status: carForm.status,
      image: formattedImg || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      model3dUrl: carForm.model3dUrl || '/models/car.glb',
      specs: {
        horsepower: Number(carForm.horsepower),
        zeroToSixty: carForm.zeroToSixty,
        topSpeed: carForm.topSpeed,
        range: carForm.range,
        powertrain: carForm.powertrain,
        torque: carForm.torque,
        dragCoefficient: carForm.dragCoefficient,
        curbWeight: carForm.curbWeight,
      },
      description: carForm.description || 'Bespoke engineered hypercar crafted for elite collectors.',
      features: carForm.features.split('\n').filter((f) => f.trim() !== ''),
    };

    if (editingCarId) {
      updateCar({ ...carData, id: editingCarId });
      setEditingCarId(null);
    } else {
      addCar(carData);
    }

    setIsAddingCar(false);
  };

  const handleEditClick = (car: InventoryCar) => {
    setEditingCarId(car.id);
    setCarForm({
      name: car.name,
      tagline: car.tagline,
      category: car.category,
      price: car.price,
      formattedPrice: car.formattedPrice,
      year: car.year,
      status: car.status,
      image: car.image,
      model3dUrl: car.model3dUrl || '/models/car.glb',
      horsepower: car.specs.horsepower,
      zeroToSixty: car.specs.zeroToSixty,
      topSpeed: car.specs.topSpeed,
      range: car.specs.range || '',
      powertrain: car.specs.powertrain,
      torque: car.specs.torque,
      dragCoefficient: car.specs.dragCoefficient,
      curbWeight: car.specs.curbWeight,
      description: car.description,
      features: car.features.join('\n'),
    });
    setIsAddingCar(true);
  };

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    const added = addAdmin(newAdminEmail);
    if (added) {
      setAdminSuccessMsg(`Successfully granted admin privileges to ${newAdminEmail}`);
      setNewAdminEmail('');
      setTimeout(() => setAdminSuccessMsg(''), 4000);
    } else {
      setAdminSuccessMsg(`Admin ${newAdminEmail} is already active.`);
      setTimeout(() => setAdminSuccessMsg(''), 4000);
    }
  };

  const handleModelUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setFeaturedModelUrl(customModelUrl);
    setModelSuccessMsg('3D Background Model updated successfully!');
    setTimeout(() => setModelSuccessMsg(''), 4000);
  };

  // Live preview URL for Google Drive photo
  const livePreviewUrl = convertGoogleDriveUrl(carForm.image);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between relative z-10">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Top Header / Status bar */}
        <div className="pb-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                {loggedInUser.role === 'superadmin' ? 'Super Administrator' : 'Administrator'}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                {loggedInUser.email}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
              {isBn ? 'অ্যাপেক্স এন্টারপ্রাইজ কমান্ড সেন্টার' : 'Apex Enterprise Command Center'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono uppercase flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isBn ? 'পাবলিক শোরুম দেখুন' : 'View Public Showroom'}</span>
            </Link>

            <button
              onClick={() => {
                logout();
                router.push('/admin/login');
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-red-500/20 text-neutral-300 hover:text-red-400 border border-white/10 text-xs font-mono uppercase flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isBn ? 'লগআউট' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mt-8 flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'fleet'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>
              {isBn
                ? `ফ্লিট ও গাড়ির তালিকা (${toBnDigits(cars.length)})`
                : `Fleet & Product Inventory (${cars.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('model')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'model'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>
              {isBn ? '৩ডি শোরুম ও ব্যাকগ্রাউন্ড মডেল' : '3D Showroom & Background Model'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'logs'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {isBn
                ? `ইউজার অ্যাক্টিভিটি ও বুকিং (${toBnDigits(bookings.length)})`
                : `User Activity & VIP Bookings (${bookings.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'admins'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isBn
                ? `অ্যাডমিন অ্যাক্সেস (${toBnDigits(adminList.length)})`
                : `Admin Access (${adminList.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'branding'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-xl'
                : 'border-transparent text-amber-300/80 hover:text-amber-300 hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              {isBn
                ? 'হোয়াইট-লেবেল ও ব্র্যান্ডিং (লোগো ও নাম)'
                : 'White-Label & Branding (Name & Logo)'}
            </span>
          </button>
        </div>

        {/* ================= TAB 1: FLEET & CARS CRUD ================= */}
        {activeTab === 'fleet' && (
          <div className="mt-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isBn ? 'ফ্লিট ইনভেন্টরি বরাদ্দসমূহ' : 'Fleet Inventory Allocations'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {isBn
                    ? 'গাড়ির তথ্য পরিচালনা করুন, গুগল ড্রাইভ ফটো যোগ করুন এবং লাইভ স্পেসিফিকেশন এডিট করুন।'
                    : 'Manage cars, add Google Drive photos, and edit live technical specifications.'}
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCarId(null);
                  setIsAddingCar(!isAddingCar);
                }}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isAddingCar
                    ? isBn
                      ? 'ফর্ম বন্ধ করুন'
                      : 'Close Form'
                    : isBn
                    ? 'নতুন গাড়ি যোগ করুন'
                    : 'Add New Hypercar'}
                </span>
              </button>
            </div>

            {/* ADD / EDIT CAR FORM */}
            {isAddingCar && (
              <form
                onSubmit={handleCarSubmit}
                className="bg-[#0a0c13]/80 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="text-base font-bold text-white uppercase font-mono">
                    {editingCarId ? 'Edit Vehicle Allocation' : 'Register New Machine'}
                  </h3>
                  <span className="text-xs font-mono text-cyan-400">
                    Google Drive Storage Enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                      {isBn ? 'মডেল / গাড়ির নাম *' : 'Model / Machine Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      list="bd-popular-models-list"
                      placeholder={isBn ? 'যেমন: Toyota Prado TX-L' : 'e.g. Toyota Land Cruiser Prado TX-L'}
                      value={carForm.name}
                      onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                    />
                    <datalist id="bd-popular-models-list">
                      {BANGLADESH_POPULAR_MODELS.map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                      {isBn ? 'ক্যাটাগরি *' : 'Category *'}
                    </label>
                    <select
                      value={carForm.category}
                      onChange={(e) => setCarForm({ ...carForm, category: e.target.value })}
                      className="w-full bg-[#0e111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                    >
                      {POPULAR_BANGLADESH_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {isBn ? `${cat.nameBn} - ${cat.modelsDescription}` : `${cat.nameEn} - ${cat.modelsDescription}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-mono uppercase text-neutral-400">
                        {isBn ? 'মূল্য (USD ও BDT ৳) *' : 'Price (USD $ & BDT ৳) *'}
                      </label>
                      <span className="text-[10px] font-mono text-cyan-400">
                        1$ ≈ {DEFAULT_USD_TO_BDT_RATE}৳
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">$</span>
                        <input
                          type="number"
                          required
                          min={1}
                          placeholder="USD ($)"
                          value={carForm.price || ''}
                          onChange={(e) => {
                            const usdVal = Number(e.target.value);
                            setCarForm({
                              ...carForm,
                              price: usdVal,
                              formattedPrice: `$${usdVal.toLocaleString()}`,
                            });
                          }}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-6 pr-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                          title="Price in US Dollars"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-amber-400 font-bold">৳</span>
                        <input
                          type="number"
                          min={1}
                          placeholder="BDT (৳)"
                          value={carForm.price ? Math.round(carForm.price * DEFAULT_USD_TO_BDT_RATE) : ''}
                          onChange={(e) => {
                            const bdtVal = Number(e.target.value);
                            const usdVal = Math.round(bdtVal / DEFAULT_USD_TO_BDT_RATE);
                            setCarForm({
                              ...carForm,
                              price: usdVal,
                              formattedPrice: `$${usdVal.toLocaleString()}`,
                            });
                          }}
                          className="w-full bg-white/[0.04] border border-amber-500/30 rounded-xl pl-6 pr-2 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-mono"
                          title="Price in Bangladeshi Taka"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-neutral-400">
                      <span>
                        BDT:{' '}
                        <strong className="text-amber-400">
                          ৳{(carForm.price * DEFAULT_USD_TO_BDT_RATE).toLocaleString()}
                        </strong>
                      </span>
                      <span className="text-cyan-400">
                        ({formatBDT(carForm.price, DEFAULT_USD_TO_BDT_RATE, true)})
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                      Interactive 3D Model *
                    </label>
                    <div className="space-y-2">
                      <select
                        value={
                          AVAILABLE_3D_MODELS.some((m) => m.url === carForm.model3dUrl)
                            ? carForm.model3dUrl
                            : 'custom'
                        }
                        onChange={(e) => {
                          if (e.target.value !== 'custom') {
                            setCarForm({ ...carForm, model3dUrl: e.target.value });
                          }
                        }}
                        className="w-full bg-[#0e111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        {AVAILABLE_3D_MODELS.map((m) => (
                          <option key={m.id} value={m.url}>
                            {m.name}
                          </option>
                        ))}
                        <option value="custom">Custom .GLB Model URL...</option>
                      </select>
                      {(!AVAILABLE_3D_MODELS.some((m) => m.url === carForm.model3dUrl) || carForm.model3dUrl.startsWith('http') || carForm.model3dUrl.includes('custom')) && (
                        <input
                          type="text"
                          placeholder="Enter .glb URL (e.g. /models/my-car.glb or https://...)"
                          value={carForm.model3dUrl === 'custom' ? '' : carForm.model3dUrl}
                          onChange={(e) => setCarForm({ ...carForm, model3dUrl: e.target.value })}
                          className="w-full bg-white/[0.04] border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono placeholder:text-neutral-600"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Google Drive Link input with Live Image Preview */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="flex-1 w-full">
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                        Google Drive Photo Link or Direct URL *
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/file/d/1BxiMVs.../view?usp=sharing"
                        value={carForm.image}
                        onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        💡 Tip: Just paste any Google Drive image sharing link. It is automatically converted into an instant embeddable stream without needing external storage!
                      </span>
                    </div>

                    {/* Live Preview Box */}
                    {livePreviewUrl && (
                      <div className="w-32 h-20 rounded-xl overflow-hidden border border-cyan-500/40 bg-neutral-900 shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={livePreviewUrl}
                          alt="Live Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <span className="absolute bottom-1 right-1 text-[8px] bg-black/70 px-1 rounded text-cyan-300 font-mono">
                          Live Drive Preview
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Technical specs inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Horsepower (HP)
                    </label>
                    <input
                      type="number"
                      value={carForm.horsepower}
                      onChange={(e) => setCarForm({ ...carForm, horsepower: Number(e.target.value) })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      0-60 MPH Acceleration
                    </label>
                    <input
                      type="text"
                      value={carForm.zeroToSixty}
                      onChange={(e) => setCarForm({ ...carForm, zeroToSixty: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Top Speed
                    </label>
                    <input
                      type="text"
                      value={carForm.topSpeed}
                      onChange={(e) => setCarForm({ ...carForm, topSpeed: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Range / Fuel
                    </label>
                    <input
                      type="text"
                      value={carForm.range}
                      onChange={(e) => setCarForm({ ...carForm, range: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pure electric supremacy."
                      value={carForm.tagline}
                      onChange={(e) => setCarForm({ ...carForm, tagline: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                      Powertrain Spec
                    </label>
                    <input
                      type="text"
                      value={carForm.powertrain}
                      onChange={(e) => setCarForm({ ...carForm, powertrain: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                    Engineering Narrative / Description
                  </label>
                  <textarea
                    rows={2}
                    value={carForm.description}
                    onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCar(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.06] text-neutral-300 text-xs uppercase font-mono cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    {editingCarId ? 'Update Machine' : 'Save & Publish Machine'}
                  </button>
                </div>
              </form>
            )}

            {/* CARS TABLE */}
            <div className="bg-[#0a0c13]/75 border border-white/15 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.02] border-b border-white/10 text-neutral-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-4 px-6">Vehicle</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Power & 0-60</th>
                      <th className="py-4 px-4">{isBn ? 'মূল্য (USD / BDT ৳)' : 'Price (USD / BDT ৳)'}</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-9 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="font-bold text-white block">{car.name}</span>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                Model {car.year}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            {car.category}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-mono text-neutral-300">
                          {car.specs?.horsepower ?? 1000} HP • {car.specs?.zeroToSixty ?? '2.0s'}
                        </td>

                        <td className="py-4 px-4 font-mono">
                          <span className="text-cyan-300 font-bold block">{car.formattedPrice}</span>
                          <span className="text-[11px] text-amber-400 block font-sans">
                            ≈ {formatBDT(car.price, DEFAULT_USD_TO_BDT_RATE, true)}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {car.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/inventory/${car.id}`}
                              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white"
                              title="View Dedicated Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => handleEditClick(car)}
                              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                              title="Edit Car"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${car.name}?`)) {
                                  deleteCar(car.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-red-400 cursor-pointer"
                              title="Delete Car"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: 3D MODEL CONTROLS ================= */}
        {activeTab === 'model' && (
          <div className="mt-8 space-y-8">
            <div className="bg-[#0a0c13]/75 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase mb-2">
                    <Box className="w-3.5 h-3.5" />
                    <span>Homepage 3D Background Engine</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Homepage 3D Background Car Switcher
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                    Select which 3D car model floats in the background canvas of the homepage and reacts smoothly as visitors scroll. You can switch to any exotic machine with 1 click.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/"
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono uppercase flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Homepage Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {modelSuccessMsg && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{modelSuccessMsg}</span>
                </div>
              )}

              {/* Grid of available 3D cars */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {AVAILABLE_3D_MODELS.map((model) => {
                  const isActive = featuredModelUrl === model.url;
                  return (
                    <div
                      key={model.id}
                      className={`relative bg-[#0a0c14]/75 border rounded-2xl overflow-hidden backdrop-blur-xl transition-all flex flex-col justify-between ${
                        isActive
                          ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/40'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        {/* Preview Image */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={model.previewImage}
                            alt={model.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c14]/90 via-transparent to-transparent" />

                          {/* Status Badge */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-cyan-300">
                              {model.category}
                            </span>

                            {isActive && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 backdrop-blur-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Active On Homepage
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5">
                          <h3 className="text-base font-bold text-white">{model.name}</h3>
                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                            {model.desc}
                          </p>

                          <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-white/[0.03] border border-white/5 font-mono text-[10px] text-neutral-400 truncate">
                            File: {model.url}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="p-5 pt-0">
                        {isActive ? (
                          <div className="w-full py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>Currently Active Model</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setFeaturedModelUrl(model.url);
                              setCustomModelUrl(model.url);
                              setModelSuccessMsg(`Homepage 3D background switched to ${model.name}!`);
                              setTimeout(() => setModelSuccessMsg(''), 4000);
                            }}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Box className="w-3.5 h-3.5" />
                            <span>Set as Homepage 3D Car</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Model Path / URL fallback */}
              <div className="mt-8 pt-8 border-t border-white/10 max-w-xl">
                <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-2">
                  Custom .glb Model URL or Storage Path
                </h4>
                <p className="text-xs text-neutral-400 mb-4">
                  Have a custom 3D model hosted on GitHub, CDN, or local folder? Paste its .glb URL here to load it into the homepage background.
                </p>

                <form onSubmit={handleModelUpdate} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={customModelUrl}
                    onChange={(e) => setCustomModelUrl(e.target.value)}
                    placeholder="/models/my-custom-car.glb"
                    className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Apply Custom URL
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: USER LOGS & BOOKINGS ================= */}
        {activeTab === 'logs' && (
          <div className="mt-8 space-y-8">
            {/* VIP Test Drive Bookings */}
            <div>
              <h2 className="text-xl font-bold text-white mb-1">VIP Test Drive Requests</h2>
              <p className="text-xs text-neutral-400 mb-4">
                Client test drive submissions, dates, machine allocations, and direct phone contact.
              </p>

              <div className="bg-[#0a0c13]/75 border border-white/15 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.02] border-b border-white/10 text-neutral-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-6">Ref ID</th>
                      <th className="py-3.5 px-4">Client Name</th>
                      <th className="py-3.5 px-4">Machine</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Schedule</th>
                      <th className="py-3.5 px-4">Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-neutral-500">
                          No test drive reservations recorded yet.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02]">
                          <td className="py-3.5 px-6 font-bold text-cyan-400">{b.referenceId}</td>
                          <td className="py-3.5 px-4 text-white font-sans font-semibold">
                            {b.booking?.fullName ?? 'Client'}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-200">{b.booking?.selectedCar ?? 'Apex Hyperion GT'}</td>
                          <td className="py-3.5 px-4 text-neutral-400">
                            {b.booking?.phone ?? 'N/A'} • {b.booking?.email ?? 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-300">
                            {b.booking?.date || 'TBD'} ({b.booking?.timeSlot ? b.booking.timeSlot.split('-')[0] : 'Anytime'})
                          </td>
                          <td className="py-3.5 px-4 uppercase text-[10px] text-amber-400">
                            {b.booking?.deliveryType ?? 'Standard'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Authentication & User Logs */}
            <div>
              <h2 className="text-xl font-bold text-white mb-1">User & Admin Authentication History</h2>
              <p className="text-xs text-neutral-400 mb-4">
                Real-time security audit trails for logins and actions.
              </p>

              <div className="bg-[#0a0c13]/75 border border-white/15 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.02] border-b border-white/10 text-neutral-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-3.5 px-6">User / Email</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Action</th>
                      <th className="py-3.5 px-6 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-neutral-300">
                    {userLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-neutral-500">
                          No audit activity logs recorded yet.
                        </td>
                      </tr>
                    ) : (
                      userLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-6 font-semibold text-white">{log.email}</td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                              {log.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-sans text-neutral-400">{log.action}</td>
                          <td className="py-3 px-6 text-right text-neutral-500 text-[11px]">
                            {log.timestamp}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: ADMIN ACCESS CONTROL ================= */}
        {activeTab === 'admins' && (
          <div className="mt-8 max-w-3xl space-y-8">
            {/* Add New Admin */}
            <div className="bg-[#0a0c13]/75 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold text-white">Grant Administrator Access</h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Authorize any executive or staff Gmail address to access this console and manage fleet allocations.
              </p>

              {adminSuccessMsg && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{adminSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddAdminSubmit} className="flex gap-3">
                <input
                  type="email"
                  required
                  placeholder="new-admin@gmail.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Grant Access</span>
                </button>
              </form>
            </div>

            {/* Current Admins List */}
            <div className="bg-[#0a0c13]/75 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white mb-4">
                Active Authorized Administrators
              </h3>

              <div className="divide-y divide-white/5">
                {adminList.map((email) => {
                  const isCurrent = loggedInUser?.email === email;
                  const isOwner = email === 'admin@apexmotors.com';
                  return (
                    <div key={email} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs">
                          {email[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-mono font-semibold text-white block">
                            {email}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {isOwner ? 'Master Super Admin' : 'Full Admin Privileges'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                            You
                          </span>
                        )}
                        {!isOwner && (
                          <button
                            onClick={() => removeAdmin(email)}
                            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Revoke Admin Access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: WHITE-LABEL & BRANDING STUDIO ================= */}
        {activeTab === 'branding' && (
          <div className="mt-8 max-w-4xl space-y-8">
            {/* Header / Intro Card */}
            <div className="bg-[#0a0c13]/75 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  White-Label Dealership Engine
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                White-Label Brand & Logo Studio (ব্র্যান্ডিং ও লোগো কাস্টমাইজেশন)
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed mt-2 max-w-2xl">
                এই ওয়েবসাইটটি যে কোনো গাড়ি কোম্পানির কাছে বিক্রয় করার জন্য সম্পূর্ণ হোয়াইট-লেবেল প্রস্তুত। 
                এখান থেকে যেকোনো ক্লায়েন্ট বা কোম্পানি তাদের নিজস্ব **কোম্পানির নাম** এবং **লোগো** সেট করতে পারবেন। 
                সেভ করার সাথে সাথে ওয়েবসাইটের হেডার, ফুটার এবং ব্রাউজার টাইটেল সব জায়গায় রিয়েল-টাইমে আপডেট হয়ে যাবে।
              </p>

              {brandingSuccessMsg && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{brandingSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Live Header Showroom Preview Card */}
            <div className="bg-[#070910]/80 border border-white/15 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" /> Live Showroom Navbar Preview (লাইভ প্রিভিউ)
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Header Display</span>
              </div>

              {/* Render Simulated Navbar */}
              <div className="p-4 rounded-2xl bg-black/90 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {brandingForm.logoType === 'image' && brandingForm.logoImageUrl ? (
                    <img
                      src={brandingForm.logoImageUrl}
                      alt="Logo preview"
                      className="w-10 h-10 object-contain rounded-xl border border-cyan-500/40 p-1 bg-[#0a0c14]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20">
                      <div className="w-full h-full bg-[#0a0c14] rounded-xl flex items-center justify-center">
                        {brandingForm.logoIcon === 'shield' && <Shield className="w-5 h-5 text-cyan-400" />}
                        {brandingForm.logoIcon === 'flame' && <Flame className="w-5 h-5 text-cyan-400" />}
                        {brandingForm.logoIcon === 'crown' && <Crown className="w-5 h-5 text-cyan-400" />}
                        {brandingForm.logoIcon === 'sparkles' && <Sparkles className="w-5 h-5 text-cyan-400" />}
                        {brandingForm.logoIcon === 'zap' && <Zap className="w-5 h-5 text-cyan-400" />}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-lg font-black tracking-wider text-white uppercase font-sans flex items-center gap-1.5">
                      {brandingForm.brandName.split(' ')[0]}{' '}
                      <span className="text-cyan-400">
                        {brandingForm.brandName.split(' ').slice(1).join(' ') || ''}
                      </span>
                    </span>
                    <span className="block text-[9px] tracking-[0.25em] text-neutral-400 uppercase font-mono">
                      {brandingForm.tagline || 'GLOBAL LUXURY & PERFORMANCE AUTOMOTIVE'}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-neutral-400">
                  <span className="text-cyan-400 font-bold">OVERVIEW</span>
                  <span>CUSTOMIZER</span>
                  <span>INVENTORY</span>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Global Brand Presets */}
            <div className="bg-[#0a0c13]/75 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>1-Click Global Presets (রেডিমেড গ্লোবাল নাম পছন্দ করুন)</span>
              </h3>
              <p className="text-xs text-neutral-400">
                নিচের যেকোনো অপশনে ক্লিক করলেই সাথে সাথে সেই ব্র্যান্ড নেম ও প্রিমিয়াম আইকন সেট হয়ে যাবে:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {[
                  {
                    name: 'VELOCITY MOTORS',
                    tagline: 'GLOBAL LUXURY & PERFORMANCE AUTOMOTIVE',
                    icon: 'shield' as const,
                    badge: 'Recommended Global',
                  },
                  {
                    name: 'AUTOVAULT GLOBAL',
                    tagline: 'CURATED EXOTIC & HYPERCAR COLLECTION',
                    icon: 'crown' as const,
                    badge: 'Exotic Showroom',
                  },
                  {
                    name: 'PRESTIGE MOTORS',
                    tagline: 'BESPOKE LUXURY AUTOMOTIVE TRADING',
                    icon: 'sparkles' as const,
                    badge: 'VIP Elite',
                  },
                  {
                    name: 'HORIZON MOTORS',
                    tagline: 'NEXT-GENERATION PERFORMANCE VEHICLES',
                    icon: 'flame' as const,
                    badge: 'Supercar GT',
                  },
                  {
                    name: 'APEX MOTORS',
                    tagline: 'ULTRA-LUXURY & ELECTRIC GT',
                    icon: 'zap' as const,
                    badge: 'Electric Tech',
                  },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setBrandingForm((prev) => ({
                        ...prev,
                        brandName: preset.name,
                        tagline: preset.tagline,
                        logoType: 'icon',
                        logoIcon: preset.icon,
                      }));
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      brandingForm.brandName === preset.name
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {preset.badge}
                      </span>
                      {preset.icon === 'shield' && <Shield className="w-4 h-4 text-cyan-400" />}
                      {preset.icon === 'crown' && <Crown className="w-4 h-4 text-amber-400" />}
                      {preset.icon === 'sparkles' && <Sparkles className="w-4 h-4 text-purple-400" />}
                      {preset.icon === 'flame' && <Flame className="w-4 h-4 text-red-400" />}
                      {preset.icon === 'zap' && <Zap className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div className="font-bold text-sm text-white">{preset.name}</div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">{preset.tagline}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Brand Customization Form */}
            <form onSubmit={handleSaveBranding} className="bg-[#0a0c13]/75 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                Custom Identity Settings (নিজস্ব নাম ও লোগো নির্ধারণ)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Brand Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-neutral-400 block font-semibold">
                    Website Brand Name (কোম্পানির নাম)
                  </label>
                  <input
                    type="text"
                    required
                    value={brandingForm.brandName}
                    onChange={(e) => setBrandingForm({ ...brandingForm, brandName: e.target.value })}
                    placeholder="e.g. VELOCITY MOTORS or YOUR COMPANY NAME"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60 transition-colors uppercase font-sans font-bold"
                  />
                  <p className="text-[10px] text-neutral-400 font-mono">
                    হেডার এবং লোগোর পাশে বড় অক্ষরে এই নামটি প্রদর্শিত হবে।
                  </p>
                </div>

                {/* Tagline Input */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-neutral-400 block font-semibold">
                    Showroom Subtitle / Tagline (স্লোগান / ট্যাগলাইন)
                  </label>
                  <input
                    type="text"
                    required
                    value={brandingForm.tagline}
                    onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                    placeholder="e.g. GLOBAL LUXURY & PERFORMANCE AUTOMOTIVE"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60 transition-colors uppercase font-mono"
                  />
                  <p className="text-[10px] text-neutral-400 font-mono">
                    নামের নিচে ছোট অক্ষরে স্লোগান হিসেবে থাকবে।
                  </p>
                </div>
              </div>

              {/* Logo Selection Section */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <label className="text-xs font-mono uppercase text-neutral-400 block font-semibold">
                  Logo Presentation Type (লোগোর ধরন নির্বাচন)
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBrandingForm({ ...brandingForm, logoType: 'icon' })}
                    className={`px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                      brandingForm.logoType === 'icon'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400'
                        : 'border-white/10 bg-white/[0.04] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Luxury Emblem Icon (আধুনিক আইকন)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrandingForm({ ...brandingForm, logoType: 'image' })}
                    className={`px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                      brandingForm.logoType === 'image'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400'
                        : 'border-white/10 bg-white/[0.04] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Custom Logo Upload (নিজস্ব লোগো ছবি)</span>
                  </button>
                </div>

                {/* If Icon Mode Selected */}
                {brandingForm.logoType === 'icon' && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <span className="text-xs font-mono text-neutral-300 block">
                      আইকনটি পছন্দ করুন:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { id: 'shield' as const, label: 'Velocity Shield', icon: Shield },
                        { id: 'zap' as const, label: 'Hyper Lightning', icon: Zap },
                        { id: 'crown' as const, label: 'Royal Crown', icon: Crown },
                        { id: 'flame' as const, label: 'Apex Turbo Flame', icon: Flame },
                        { id: 'sparkles' as const, label: 'Prestige Diamond', icon: Sparkles },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = brandingForm.logoIcon === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setBrandingForm({ ...brandingForm, logoIcon: item.id })}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400'
                                : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/30'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                            <span className="text-[10px] font-mono text-center">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* If Custom Image Mode Selected */}
                {brandingForm.logoType === 'image' && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      {/* Direct Upload Button */}
                      <div>
                        <span className="text-xs font-mono text-neutral-300 block mb-2 font-semibold">
                          Upload Logo File (লোগো ফাইল আপলোড):
                        </span>
                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 hover:border-cyan-400 rounded-2xl cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                          <Upload className="w-6 h-6 text-cyan-400 mb-2" />
                          <span className="text-xs text-white font-mono">Click to upload image</span>
                          <span className="text-[10px] text-neutral-400 font-mono mt-1">
                            PNG, SVG, JPG, WebP supported
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Or URL input */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-neutral-300 block font-semibold">
                          Or Paste Logo Image URL / Google Drive Link:
                        </label>
                        <input
                          type="text"
                          value={brandingForm.logoImageUrl || ''}
                          onChange={(e) =>
                            setBrandingForm({
                              ...brandingForm,
                              logoImageUrl: convertGoogleDriveUrl(e.target.value),
                            })
                          }
                          placeholder="https://example.com/logo.png or Google Drive link"
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60 transition-colors font-mono"
                        />
                        {brandingForm.logoImageUrl && (
                          <div className="flex items-center gap-3 p-2 rounded-xl bg-black/60 border border-white/10 mt-2">
                            <img
                              src={brandingForm.logoImageUrl}
                              alt="Thumbnail preview"
                              className="w-10 h-10 object-contain rounded-lg border border-white/20 bg-white/5"
                            />
                            <span className="text-[11px] font-mono text-emerald-400">
                              ✓ Logo loaded successfully
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit / Save Button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  পরিবর্তনগুলো সেভ করার সাথে সাথে ব্রাউজারে লাইভ হয়ে যাবে।
                </span>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save & Publish Branding (ব্র্যান্ডিং সেভ করুন)</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

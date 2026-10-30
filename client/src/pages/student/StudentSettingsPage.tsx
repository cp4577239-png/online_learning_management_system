import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, ImagePlus, LogIn, LogOut, UserRoundPlus } from 'lucide-react';
import { describeApiError } from '../../lib/api';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';
const MAX_AVATAR_LENGTH = 700_000;

interface StudentSettingsPageProps {
  navigate: (path: string) => void;
}

async function prepareAvatar(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose an image file to use as your profile picture.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Choose an image smaller than 5 MB.');
  }

  const imageUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = imageUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('This image could not be opened.'));
    });

    const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not process this image.');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const avatar = canvas.toDataURL('image/jpeg', 0.82);
    if (avatar.length > MAX_AVATAR_LENGTH) {
      throw new Error('This image is too large to save. Choose a smaller image.');
    }
    return avatar;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export const StudentSettingsPage: React.FC<StudentSettingsPageProps> = ({ navigate }) => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [headline, setHeadline] = useState(user?.headline ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreparingAvatar, setIsPreparingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name ?? '');
    setHeadline(user?.headline ?? '');
    setBio(user?.bio ?? '');
    setAvatar(null);
  }, [user?.id]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError(null);
    setSaved(false);
    setIsPreparingAvatar(true);
    try {
      setAvatar(await prepareAvatar(file));
    } catch (avatarError) {
      setError(describeApiError(avatarError));
    } finally {
      setIsPreparingAvatar(false);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        headline,
        bio,
        avatar: avatar ?? user?.avatar ?? '',
      });
      setAvatar(null);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (saveError) {
      setError(describeApiError(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account & Profile Settings
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Update your profile photo and account details.
        </p>
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            user
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
              : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
          }`}>
            {user ? <Check className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {user ? 'You are logged in' : 'You are browsing as a guest'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {user ? user.email : 'Sign in to access your courses, progress, and certificates.'}
            </p>
          </div>
        </div>
        {user ? (
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-900 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <UserRoundPlus className="w-4 h-4" />
              Create account
            </button>
          </div>
        )}
      </section>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <img
              src={avatar === null ? user?.avatar || DEFAULT_AVATAR : avatar || DEFAULT_AVATAR}
              alt={user?.name || 'User'}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user?.email}</p>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 capitalize">
                Role: {user?.role}
              </div>
              <label className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                <ImagePlus className="w-3.5 h-3.5" />
                {isPreparingAvatar ? 'Preparing photo...' : 'Change profile photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => void handleAvatarChange(event)}
                  disabled={isPreparingAvatar || isSaving}
                  className="sr-only"
                />
              </label>
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar('')}
                  className="ml-3 text-xs text-slate-500 hover:text-rose-600"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address (Managed)
              </label>
              <input
                type="email"
                disabled
                value={user?.email ?? ''}
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              maxLength={160}
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Academic & Professional Bio
            </label>
            <textarea
              rows={3}
              maxLength={2000}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white leading-relaxed"
            />
          </div>

          {error && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {saved ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={isSaving || isPreparingAvatar}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

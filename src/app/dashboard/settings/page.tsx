'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

interface SettingsData {
  general: Record<string, string>;
  company: Record<string, string>;
  seo: Record<string, string>;
  features: Record<string, string>;
}

const SETTINGS_LABELS: Record<string, Record<string, string>> = {
  general: {
    company_name: 'Company Name',
    site_title: 'Site Title',
    site_tagline: 'Site Tagline',
    contact_email: 'Contact Email',
    timezone: 'Timezone',
    date_format: 'Date Format',
  },
  company: {
    about_excerpt: 'About Excerpt',
    facebook_url: 'Facebook URL',
    twitter_url: 'Twitter URL',
    linkedin_url: 'LinkedIn URL',
    instagram_url: 'Instagram URL',
    address: 'Address',
    phone: 'Phone Number',
  },
  seo: {
    meta_title_template: 'Meta Title Template',
    meta_description_default: 'Default Meta Description',
    og_image_url: 'OG Image URL',
    robots_default: 'Default Robots Setting',
  },
  features: {
    blog_enabled: 'Enable Blog',
    careers_enabled: 'Enable Careers',
    contact_form_enabled: 'Enable Contact Form',
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/settings`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch settings');
      const response = await res.json();
      if (!response.success) throw new Error(response.error || 'Failed to fetch settings');
      setSettings(response.data);
    } catch {
      showToast('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const response = await res.json();
      if (!response.success) throw new Error(response.error || 'Failed to save settings');
      showToast('success', 'Settings saved successfully');
    } catch {
      showToast('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (category: keyof SettingsData, key: string, value: string) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value,
        },
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return <div className="text-center py-8">Failed to load settings</div>;
  }

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'company', label: 'Company Info', icon: '🏢' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'features', label: 'Features', icon: '🚀' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your site configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
              {Object.entries(SETTINGS_LABELS.general).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={settings.general[key] || ''}
                    onChange={(e) => handleChange('general', key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Excerpt</label>
                <textarea
                  value={settings.company.about_excerpt || ''}
                  onChange={(e) => handleChange('company', 'about_excerpt', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {Object.entries(SETTINGS_LABELS.company)
                .filter(([key]) => key !== 'about_excerpt')
                .map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type="text"
                      value={settings.company[key] || ''}
                      onChange={(e) => handleChange('company', key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>
              {Object.entries(SETTINGS_LABELS.seo).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={settings.seo[key] || ''}
                    onChange={(e) => handleChange('seo', key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Feature Flags</h2>
              {Object.entries(SETTINGS_LABELS.features).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <label className="text-sm font-medium text-gray-700">{label}</label>
                  <button
                    onClick={() => handleChange('features', key, settings.features[key] === 'true' ? 'false' : 'true')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.features[key] === 'true' ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.features[key] === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

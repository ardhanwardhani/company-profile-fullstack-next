'use client';

import { useState, useEffect } from 'react';
import { FileText, Briefcase, Users, TrendingUp, Eye, UserPlus, Calendar, BarChart3, RotateCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  stats: {
    blogPublished: number;
    blogDraft: number;
    blogArchived: number;
    jobActive: number;
    jobClosed: number;
    jobDraft: number;
    jobArchived: number;
    totalUsers: number;
    totalApplications: number;
  };
  recentActivity: {
    postsCreated: number;
    postsPublished: number;
    jobsCreated: number;
    jobsOpened: number;
    jobsClosed: number;
  };
  blogViews: {
    perDay: { date: string; views: number }[];
    perMonth: { month: string; views: number }[];
    perYear: { year: number; views: number }[];
  };
  jobViews: {
    perDay: { date: string; views: number }[];
    perMonth: { month: string; views: number }[];
    perYear: { year: number; views: number }[];
  };
}

export default function AnalyticsWidget() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'blog' | 'jobs'>('blog');
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/analytics/dashboard`);
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      setData(result);
    } catch {
      console.error('Failed to load analytics');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-10 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const stats = [
    {
      label: 'Blog Published',
      value: data.stats.blogPublished,
      icon: FileText,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Active Jobs',
      value: data.stats.jobActive,
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Applications',
      value: data.stats.totalApplications,
      icon: UserPlus,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const chartData =
    activeTab === 'blog'
      ? viewMode === 'day'
        ? data.blogViews.perDay.map((d) => ({ ...d, name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }))
        : viewMode === 'month'
          ? data.blogViews.perMonth.map((d) => ({ ...d, name: d.month }))
          : data.blogViews.perYear.map((d) => ({ ...d, name: d.year.toString() }))
      : viewMode === 'day'
        ? data.jobViews.perDay.map((d) => ({ ...d, name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }))
        : viewMode === 'month'
          ? data.jobViews.perMonth.map((d) => ({ ...d, name: d.month }))
          : data.jobViews.perYear.map((d) => ({ ...d, name: d.year.toString() }));

  const totalViews =
    activeTab === 'blog'
      ? (viewMode === 'day' ? data.blogViews.perDay : viewMode === 'month' ? data.blogViews.perMonth : data.blogViews.perYear).reduce((sum, d) => sum + d.views, 0)
      : (viewMode === 'day' ? data.jobViews.perDay : viewMode === 'month' ? data.jobViews.perMonth : data.jobViews.perYear).reduce((sum, d) => sum + d.views, 0);

  const ChartComponent = viewMode === 'day' ? LineChart : viewMode === 'month' ? BarChart : AreaChart;
  const ChartElement =
    viewMode === 'day' ? (
      <Line type="monotone" dataKey="views" stroke="#16a34a" strokeWidth={2} dot={false} />
    ) : viewMode === 'month' ? (
      <Bar dataKey="views" fill="#16a34a" radius={[4, 4, 0, 0]} />
    ) : (
      <Area type="monotone" dataKey="views" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveTab('blog')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'blog' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Eye size={16} className="inline mr-2" />
                Blog Analytics
              </button>
              <button onClick={() => setActiveTab('jobs')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'jobs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Briefcase size={16} className="inline mr-2" />
                Jobs Analytics
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setViewMode('day')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'day' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Calendar size={14} className="inline mr-1" />
                Day
              </button>
              <button onClick={() => setViewMode('month')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'month' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <BarChart3 size={14} className="inline mr-1" />
                Month
              </button>
              <button onClick={() => setViewMode('year')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'year' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                Year
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                title="Refresh"
              >
                <RotateCw size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'blog' ? 'Blog' : 'Jobs'} Views - {viewMode === 'day' ? 'Last 30 Days' : viewMode === 'month' ? 'Last 12 Months' : 'All Time'}
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {totalViews.toLocaleString()} <span className="text-sm font-normal text-gray-500">total views</span>
            </p>
          </div>

          {chartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  {ChartElement}
                </ChartComponent>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Eye size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No views recorded yet</p>
                <p className="text-sm">Views will appear here once tracking is enabled</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

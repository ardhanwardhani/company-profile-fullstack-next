import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getJobById } from '@/lib/jobs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Edit, Calendar, MapPin, Building2, Clock, Briefcase, ExternalLink } from 'lucide-react';
import DeleteJobButton from './DeleteJobButton';

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const role = (session.user as any)?.role;
  
  if (!['admin', 'hr_manager', 'hr_staff'].includes(role)) {
    redirect('/dashboard');
  }

  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
        <Link href="/dashboard/careers/jobs" className="text-primary-600 hover:underline">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const isAdmin = role === 'admin';
  const canManageStatus = ['admin', 'hr_manager'].includes(role);

  const renderRichContent = (content: any) => {
    if (!content) return null;
    const html = typeof content === 'string' ? content : content.html || JSON.stringify(content);
    return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/careers/jobs"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/careers/jobs/${id}/edit`}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </Link>
          {isAdmin && (
            <DeleteJobButton jobId={id} />
          )}
        </div>
      </div>

      <article className="card">
        <header className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <StatusBadge status={job.status} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            {job.department && (
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                <span>{job.department.name}</span>
              </div>
            )}
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>
                  {job.location.name}
                  {job.location.is_remote && ' (Remote)'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="capitalize">{job.employment_type?.replace('-', ' ')}</span>
            </div>
            {job.level && (
              <div className="flex items-center gap-2">
                <Briefcase size={16} />
                <span className="capitalize">{job.level}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Created: {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
            {job.published_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Published: {new Date(job.published_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </header>

        {job.apply_url && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Apply URL:</strong>
            </p>
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              {job.apply_url}
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {(job.description || job.responsibilities || job.requirements || job.benefits) && (
          <div className="space-y-8">
            {job.description && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                  Description
                </h2>
                {renderRichContent(job.description)}
              </section>
            )}

            {job.responsibilities && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                  Responsibilities
                </h2>
                {renderRichContent(job.responsibilities)}
              </section>
            )}

            {job.requirements && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                  Requirements
                </h2>
                {renderRichContent(job.requirements)}
              </section>
            )}

            {job.benefits && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                  Benefits
                </h2>
                {renderRichContent(job.benefits)}
              </section>
            )}
          </div>
        )}

        {(job.seo_title || job.seo_description) && (
          <footer className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">SEO Information</h3>
            {job.seo_title && (
              <p className="text-sm text-gray-700 mb-2">
                <strong>Meta Title:</strong> {job.seo_title}
              </p>
            )}
            {job.seo_description && (
              <p className="text-sm text-gray-700">
                <strong>Meta Description:</strong> {job.seo_description}
              </p>
            )}
          </footer>
        )}
      </article>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-700',
    closed: 'bg-red-100 text-red-700',
    archived: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <span className={`inline-flex px-3 py-1 text-sm rounded-full ${
      styles[status] || 'bg-gray-100 text-gray-700'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

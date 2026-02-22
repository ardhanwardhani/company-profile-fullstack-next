import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getProjectById } from '@/lib/projects';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Edit, Calendar, ExternalLink, Folder, Tag, User } from 'lucide-react';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const role = (session.user as any)?.role;
  
  if (!['admin', 'editor', 'content_manager'].includes(role)) {
    redirect('/dashboard');
  }

  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
        <Link href="/dashboard/projects" className="text-blue-600 hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/projects/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Edit size={16} />
            Edit
          </Link>
        </div>
      </div>

      <article className="bg-white rounded-xl border border-gray-200 p-6">
        <header className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex px-3 py-1 text-sm rounded-full ${
              project.status === 'published' ? 'bg-green-100 text-green-700' :
              project.status === 'draft' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }`}>
              {project.status}
            </span>
            {project.category && (
              <span className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                {project.category}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            {project.client_name && (
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{project.client_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            {project.updated_at && project.updated_at !== project.created_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </header>

        {project.featured_image ? (
          <div className="mb-6">
            <img
              src={project.featured_image}
              alt={project.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="mb-6">
            <img
              src="https://placehold.co/800x400/e2e8f0/64748b?text=No+Image"
              alt={project.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {project.description && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">{project.description}</p>
          </div>
        )}

        {project.content && (
          <div
            className="prose prose-lg max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Technologies</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.images && project.images.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Project Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${project.title} - Image ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <footer className="pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <ExternalLink size={16} />
                View Live Site
              </a>
            )}
            {project.case_study_url && (
              <a
                href={project.case_study_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <Folder size={16} />
                View Case Study
              </a>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}

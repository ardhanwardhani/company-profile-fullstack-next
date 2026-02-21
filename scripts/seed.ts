import pool from '../src/lib/db';
import bcrypt from 'bcrypt';

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    await client.query(`
      INSERT INTO users (username, email, password_hash, name, role, status)
      VALUES ('admin', 'admin@company.com', $1, 'Admin User', 'admin', 'active')
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword]);

    console.log('Creating blog categories...');
    const categories = [
      { name: 'Technology', slug: 'technology' },
      { name: 'Company News', slug: 'company-news' },
      { name: 'Engineering', slug: 'engineering' },
      { name: 'Design', slug: 'design' },
      { name: 'Culture', slug: 'culture' },
    ];
    
    for (const cat of categories) {
      await client.query(`
        INSERT INTO blog_categories (name, slug, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO NOTHING
      `, [cat.name, cat.slug, `All posts about ${cat.name.toLowerCase()}`]);
    }

    console.log('Creating blog tags...');
    const tags = [
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'PostgreSQL', slug: 'postgresql' },
    ];
    
    for (const tag of tags) {
      await client.query(`
        INSERT INTO blog_tags (name, slug)
        VALUES ($1, $2)
        ON CONFLICT (slug) DO NOTHING
      `, [tag.name, tag.slug]);
    }

    console.log('Creating blog author...');
    await client.query(`
      INSERT INTO blog_authors (name, bio, role, is_active)
      VALUES ('Editorial Team', 'Our dedicated editorial team shares insights about our company and industry.', 'Content Team', true)
      ON CONFLICT DO NOTHING
    `);

    console.log('Creating departments...');
    const departments = [
      { name: 'Engineering', slug: 'engineering' },
      { name: 'Product', slug: 'product' },
      { name: 'Design', slug: 'design' },
      { name: 'Marketing', slug: 'marketing' },
      { name: 'Human Resources', slug: 'hr' },
    ];
    
    for (const dept of departments) {
      await client.query(`
        INSERT INTO departments (name, is_active)
        VALUES ($1, true)
        ON CONFLICT DO NOTHING
      `, [dept.name]);
    }

    console.log('Creating locations...');
    const locations = [
      { name: 'Jakarta', remote: false },
      { name: 'Bali', remote: false },
      { name: 'Remote', remote: true },
    ];
    
    for (const loc of locations) {
      await client.query(`
        INSERT INTO locations (name, is_remote, is_active)
        VALUES ($1, $2, true)
        ON CONFLICT DO NOTHING
      `, [loc.name, loc.remote]);
    }

    console.log('Creating sample blog post...');
    await client.query(`
      INSERT INTO blog_posts (title, slug, excerpt, content, category_id, author_id, status, seo_index)
      SELECT 
        'Welcome to Our New Company Blog',
        'welcome-company-blog',
        'We are excited to launch our new blog where we will share insights, updates, and stories from our team.',
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is the beginning of our blogging journey. Stay tuned for more updates!"}]}]}',
        id, 
        (SELECT id FROM blog_authors LIMIT 1),
        'published',
        true
      FROM blog_categories WHERE slug = 'company-news'
      ON CONFLICT (slug) DO NOTHING
    `);

    console.log('Creating sample job posting...');
    await client.query(`
      INSERT INTO jobs (title, slug, description, responsibilities, requirements, apply_url, department_id, location_id, employment_type, status, seo_index)
      SELECT 
        'Senior Frontend Developer',
        'senior-frontend-developer',
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"We are looking for a Senior Frontend Developer to join our team."}]}]}',
        '{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Build and maintain web applications"}]}]}]}]}',
        '{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"5+ years of experience"}]}]}]}]}',
        'mailto:careers@company.com',
        (SELECT id FROM departments WHERE slug = 'engineering'),
        (SELECT id FROM locations WHERE slug = 'jakarta'),
        'full-time',
        'open',
        true
      ON CONFLICT (slug) DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('Seed data created successfully!');
    console.log('\nAdmin login credentials:');
    console.log('Email: admin@company.com');
    console.log('Password: admin123');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

seed().catch(console.error);

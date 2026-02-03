import pool from './db';

export interface BlogPostWithRelations {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  status: string;
  created_at: Date;
  published_at?: Date;
  category?: { id: string; name: string; slug: string };
  author?: { id: string; name: string; avatar?: string };
  tags?: { id: string; name: string; slug: string }[];
}

export async function getBlogPosts(options: {
  status?: string;
  limit?: number;
  offset?: number;
  categoryId?: string;
  authorId?: string;
  search?: string;
} = {}): Promise<BlogPostWithRelations[]> {
  const { status, limit = 10, offset = 0, categoryId, authorId, search } = options;

  let whereConditions = ['1=1'];
  const params: any[] = [];
  let paramIndex = 1;

  if (status) {
    whereConditions.push(`bp.status = $${paramIndex++}`);
    params.push(status);
  }

  if (categoryId) {
    whereConditions.push(`bp.category_id = $${paramIndex++}`);
    params.push(categoryId);
  }

  if (authorId) {
    whereConditions.push(`bp.author_id = $${paramIndex++}`);
    params.push(authorId);
  }

  if (search) {
    whereConditions.push(`(bp.title ILIKE $${paramIndex} OR bp.excerpt ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = whereConditions.join(' AND ');

  const result = await pool.query(
    `SELECT bp.*, 
            bc.name as category_name, bc.slug as category_slug,
            ba.name as author_name, ba.avatar_id as author_avatar
     FROM blog_posts bp
     LEFT JOIN blog_categories bc ON bp.category_id = bc.id
     LEFT JOIN blog_authors ba ON bp.author_id = ba.id
     WHERE ${whereClause}
     ORDER BY bp.created_at DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    [...params, limit, offset]
  );

  return result.rows.map(row => ({
    ...row,
    category: { id: row.category_id, name: row.category_name, slug: row.category_slug },
    author: { id: row.author_id, name: row.author_name, avatar: row.author_avatar },
  }));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  const result = await pool.query(
    `SELECT bp.*, 
            bc.name as category_name, bc.slug as category_slug,
            ba.name as author_name, ba.bio as author_bio, ba.avatar_id as author_avatar
     FROM blog_posts bp
     LEFT JOIN blog_categories bc ON bp.category_id = bc.id
     LEFT JOIN blog_authors ba ON bp.author_id = ba.id
     WHERE bp.slug = $1 AND bp.status = 'published'`,
    [slug]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];

  const tagsResult = await pool.query(
    `SELECT bt.id, bt.name, bt.slug 
     FROM blog_tags bt 
     JOIN blog_post_tags bpt ON bt.id = bpt.tag_id 
     WHERE bpt.post_id = $1`,
    [row.id]
  );

  return {
    ...row,
    category: { id: row.category_id, name: row.category_name, slug: row.category_slug },
    author: { id: row.author_id, name: row.author_name, bio: row.author_bio, avatar: row.author_avatar },
    tags: tagsResult.rows,
  };
}

export async function getBlogCategories() {
  const result = await pool.query(
    'SELECT * FROM blog_categories WHERE is_active = true ORDER BY name'
  );
  return result.rows;
}

export async function getBlogAuthors() {
  const result = await pool.query(
    'SELECT * FROM blog_authors WHERE is_active = true ORDER BY name'
  );
  return result.rows;
}

export async function getBlogTags() {
  const result = await pool.query(
    'SELECT * FROM blog_tags ORDER BY name'
  );
  return result.rows;
}

// types/blog.ts - Типы для блога

import type { User } from "./user";

// ========================================
// ОСНОВНЫЕ ТИПЫ БЛОГА
// ========================================

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: User;
  category: BlogCategory;
  tags: BlogTag[];
  status: BlogPostStatus;
  publishedAt?: string;
  readTime?: number;
  views: number;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BlogPostStatus = "draft" | "published" | "archived";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  postsCount: number;
  createdAt: string;
}

// ========================================
// ФИЛЬТРЫ И ПОИСК
// ========================================

export interface BlogFilter {
  category?: string;
  tags?: string[];
  author?: number;
  status?: BlogPostStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  published?: boolean;
}

export interface BlogSearchParams {
  query?: string;
  filters?: BlogFilter;
  sortBy?: "date" | "views" | "likes" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ========================================
// СОЗДАНИЕ И ОБНОВЛЕНИЕ
// ========================================

export interface CreateBlogPostData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  categoryId: number;
  tagIds?: number[];
  status?: BlogPostStatus;
  publishedAt?: string;
}

export type UpdateBlogPostData = Partial<CreateBlogPostData>;

export interface CreateBlogCategoryData {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface CreateBlogTagData {
  name: string;
  slug?: string;
  color?: string;
}

// ========================================
// СТАТИСТИКА БЛОГА
// ========================================

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  popularPosts: BlogPost[];
  recentPosts: BlogPost[];
  topCategories: Array<{
    category: BlogCategory;
    postsCount: number;
  }>;
  topTags: Array<{
    tag: BlogTag;
    postsCount: number;
  }>;
}

// ========================================
// КОММЕНТАРИИ (если нужны)
// ========================================

export interface BlogComment {
  id: number;
  postId: number;
  author: User;
  content: string;
  parentId?: number;
  replies?: BlogComment[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogCommentData {
  postId: number;
  content: string;
  parentId?: number;
}

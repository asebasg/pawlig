/**
 * @fileoverview Servicio centralizado para la gestión del módulo de Blog.
 * Proporciona métodos para CRUD de artículos, validación de slugs y paginación.
 */

import { prisma } from "@/lib/utils/db";
import { AuditCategory, Prisma } from "@prisma/client";
import { CreateBlogInput, UpdateBlogInput, BlogQueryInput } from "@/lib/validations/blog.schema";

/**
 * Normaliza y genera un slug único a partir de un texto.
 * Si el slug ya existe, añade un sufijo numérico (-1, -2, etc).
 * 
 * @param {string} title Título del cual generar el slug.
 * @returns {Promise<string>} Slug generado y garantizado único.
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existingPost) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    } else {
      exists = false;
    }
  }

  return slug;
}

/**
 * Crea un nuevo artículo de blog.
 * 
 * @param {CreateBlogInput} data Datos del artículo.
 * @param {string} authorId ID del usuario creador.
 * @param {string} authorEmail Email del creador (para auditoría).
 * @param {string} [ipAddress] IP de origen (opcional).
 * @param {string} [userAgent] User agent de origen (opcional).
 * @returns {Promise<any>} El artículo creado.
 */
export async function createBlogPost(
  data: CreateBlogInput, 
  authorId: string, 
  authorEmail: string,
  ipAddress?: string,
  userAgent?: string
) {
  const slug = await generateUniqueSlug(data.title);
  
  const post = await prisma.$transaction(async (tx) => {
    const createdPost = await tx.blogPost.create({
      data: {
        ...data,
        slug,
        authorId,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    await tx.systemAuditLog.create({
      data: {
        category: AuditCategory.BLOG_MANAGEMENT,
        action: "CREATE",
        actorId: authorId,
        actorEmail: authorEmail,
        resourceType: "BLOG_POST",
        resourceId: createdPost.id,
        before: null,
        after: JSON.stringify({ title: createdPost.title, status: createdPost.status }),
        reason: "Creación de artículo de blog",
        ipAddress,
        userAgent,
      }
    });

    return createdPost;
  });

  return post;
}

/**
 * Obtiene una lista paginada de artículos.
 * 
 * @param {BlogQueryInput} query Filtros, paginación y orden.
 * @param {boolean} admin Si es true, retorna artículos sin filtrar por estado (salvo que se pida).
 * @returns {Promise<any>} Objeto con datos y metadata de paginación.
 */
export async function getBlogPosts(query: BlogQueryInput, admin = false) {
  const { page = 1, limit = 10, tag, status, search, sort = "recent" } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.BlogPostWhereInput = {};

  if (!admin) {
    where.status = "PUBLISHED";
  } else if (status) {
    where.status = status;
  }

  if (tag) {
    where.tags = { has: tag };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.BlogPostOrderByWithRelationInput = {};
  if (sort === "recent") {
    orderBy.createdAt = "desc";
  } else if (sort === "views") {
    orderBy.views = "desc";
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        author: {
          select: { name: true, id: true },
        },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    data: posts,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Obtiene un artículo por su slug y aumenta su contador de vistas.
 * 
 * @param {string} slug Slug del artículo.
 * @returns {Promise<any>} El artículo encontrado o null.
 */
export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: {
        author: {
          select: { name: true, id: true },
        },
      },
    });
    return post;
  } catch (error: unknown) {
    // RecordNotFound error code in Prisma is P2025
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return null;
    }
    throw error;
  }
}

/**
 * Obtiene un artículo por su ID.
 * 
 * @param {string} id ID del artículo.
 * @returns {Promise<any>} El artículo encontrado o null.
 */
export async function getBlogPostById(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true, id: true },
      },
    },
  });

  return post;
}

/**
 * Actualiza un artículo existente.
 * 
 * @param {string} id ID del artículo.
 * @param {UpdateBlogInput} data Datos a actualizar.
 * @param {string} actorId ID del usuario que actualiza.
 * @param {string} actorEmail Email del usuario que actualiza.
 * @param {string} [ipAddress] IP de origen (opcional).
 * @param {string} [userAgent] User agent de origen (opcional).
 * @returns {Promise<any>} El artículo actualizado.
 */
export async function updateBlogPost(
  id: string, 
  data: UpdateBlogInput,
  actorId: string,
  actorEmail: string,
  ipAddress?: string,
  userAgent?: string
) {
  const currentPost = await prisma.blogPost.findUnique({ where: { id } });
  if (!currentPost) {
    throw new Error("Artículo no encontrado");
  }

  let newSlug = currentPost.slug;
  if (data.title && data.title !== currentPost.title) {
    newSlug = await generateUniqueSlug(data.title);
  }

  let publishedAt = currentPost.publishedAt;
  if (data.status === "PUBLISHED" && currentPost.status !== "PUBLISHED") {
    publishedAt = new Date();
  }

  const updatedPost = await prisma.$transaction(async (tx) => {
    const post = await tx.blogPost.update({
      where: { id },
      data: {
        ...data,
        slug: newSlug,
        publishedAt,
      },
    });

    await tx.systemAuditLog.create({
      data: {
        category: AuditCategory.BLOG_MANAGEMENT,
        action: "UPDATE",
        actorId,
        actorEmail,
        resourceType: "BLOG_POST",
        resourceId: post.id,
        before: JSON.stringify({ title: currentPost.title, status: currentPost.status }),
        after: JSON.stringify({ title: post.title, status: post.status }),
        reason: "Actualización de artículo de blog",
        ipAddress,
        userAgent,
      }
    });

    return post;
  });

  return updatedPost;
}

/**
 * Elimina un artículo.
 * 
 * @param {string} id ID del artículo.
 * @param {string} actorId ID del usuario que elimina.
 * @param {string} actorEmail Email del usuario que elimina.
 * @param {string} [ipAddress] IP de origen (opcional).
 * @param {string} [userAgent] User agent de origen (opcional).
 * @returns {Promise<void>}
 */
export async function deleteBlogPost(
  id: string,
  actorId: string,
  actorEmail: string,
  ipAddress?: string,
  userAgent?: string
) {
  const currentPost = await prisma.blogPost.findUnique({ where: { id } });
  if (!currentPost) return;

  await prisma.$transaction(async (tx) => {
    await tx.blogPost.delete({ where: { id } });

    await tx.systemAuditLog.create({
      data: {
        category: AuditCategory.BLOG_MANAGEMENT,
        action: "DELETE",
        actorId,
        actorEmail,
        resourceType: "BLOG_POST",
        resourceId: id,
        before: JSON.stringify({ title: currentPost.title, status: currentPost.status }),
        after: null,
        reason: "Eliminación de artículo de blog",
        ipAddress,
        userAgent,
      }
    });
  });
}

/**
 * Obtiene etiquetas únicas y su conteo.
 * 
 * @returns {Promise<any>} Lista de etiquetas y conteos.
 */
export async function getBlogTags() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { tags: true },
  });

  const tagCounts: Record<string, number> = {};
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Obtiene artículos relacionados basados en etiquetas comunes.
 * 
 * @param {string} slug Slug del artículo base.
 * @param {number} limit Cantidad máxima de artículos a retornar.
 * @returns {Promise<any[]>} Lista de artículos relacionados.
 */
export async function getRelatedBlogPosts(slug: string, limit: number = 3) {
  const currentPost = await prisma.blogPost.findUnique({
    where: { slug },
    select: { tags: true, id: true },
  });

  if (!currentPost || currentPost.tags.length === 0) {
    return [];
  }

  const related = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: currentPost.id },
      tags: { hasSome: currentPost.tags },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true, id: true },
      },
    },
  });

  return related;
}

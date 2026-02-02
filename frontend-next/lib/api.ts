// API клиент для серверных компонентов Next.js

const API_URL = process.env.API_URL || 'http://localhost:5000';

export async function fetchNews(take: number = 10) {
  const res = await fetch(`${API_URL}/api/posts/news?take=${take}`, {
    next: { revalidate: 60 }, // Кеширование на 60 секунд
  });

  if (!res.ok) {
    throw new Error('Failed to fetch news');
  }

  return res.json();
}

export async function fetchCompanyLife(take: number = 10) {
  const res = await fetch(`${API_URL}/api/posts/company-life?take=${take}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch company life');
  }

  return res.json();
}

export async function fetchPromotions(take: number = 10) {
  const res = await fetch(`${API_URL}/api/posts/promotions?take=${take}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch promotions');
  }

  return res.json();
}

export async function fetchEvents(take: number = 10) {
  const res = await fetch(`${API_URL}/api/posts/events?take=${take}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }

  return res.json();
}

export async function fetchReadySolutions(limit: number = 4) {
  const res = await fetch(`${API_URL}/api/posts/ready-solutions?limit=${limit}`, {
    next: { revalidate: 300 }, // Кеширование на 5 минут
  });

  if (!res.ok) {
    throw new Error('Failed to fetch ready solutions');
  }

  return res.json();
}

export async function fetchTestimonials() {
  const res = await fetch(`${API_URL}/api/posts/testimonials`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch testimonials');
  }

  return res.json();
}

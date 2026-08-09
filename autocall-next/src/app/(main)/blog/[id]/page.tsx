import { getImageUrl } from '@/lib/utils';
import { Props } from '@/types/blog';
import { Metadata } from 'next';
import BlogDetailsClient from './BlogDetailsClient';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/${id}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      return { title: 'Blog Details | Auto Call' }
    }
    
    const blog = await res.json();
    
    if (!blog) return { title: 'Blog Not Found | Auto Call' };

    const title = blog.meta_title || blog.title;
    const description = blog.meta_description || blog.description;
    
    // Fallback to thumbnail if meta_image is missing
    const imagePath = blog.meta_image || blog.thumbnail;
    const images = imagePath ? [getImageUrl(imagePath)] : [];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images,
      }
    }
  } catch (error) {
    return { title: 'Blog Details | Auto Call' }
  }
}

export default function BlogDetailsPage() {
  return <BlogDetailsClient />
}

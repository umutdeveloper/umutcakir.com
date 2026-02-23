import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Umut Çakır Blog',
    description: 'Yazılım mühendisliği, Angular, TypeScript, performans ve mimari hakkında yazılar.',
    site: context.site!.toString(),
    items: sortedPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id.replace(/\.mdx?$/, '')}/`,
    })),
    customData: '<language>tr-TR</language>',
  });
}

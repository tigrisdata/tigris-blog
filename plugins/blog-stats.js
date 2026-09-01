/**
 * Exposes aggregate blog stats (post count, unique author count, and the date
 * of the earliest post) as global data so the blog masthead can render them.
 */
module.exports = function blogStatsPlugin() {
  return {
    name: "blog-stats",
    async allContentLoaded({ allContent, actions }) {
      const blog = allContent["docusaurus-plugin-content-blog"];
      const instance = blog && (blog.default || Object.values(blog)[0]);
      const posts = (instance && instance.blogPosts) || [];

      const authors = new Set();
      let firstDate = null;

      for (const post of posts) {
        const metadata = (post && post.metadata) || {};
        (metadata.authors || []).forEach((author) => {
          const key = author.key || author.name;
          if (key) authors.add(key);
        });
        if (metadata.date) {
          const date = new Date(metadata.date);
          if (!firstDate || date < firstDate) firstDate = date;
        }
      }

      actions.setGlobalData({
        postCount: posts.length,
        authorCount: authors.size,
        firstPostDate: firstDate ? firstDate.toISOString() : null,
      });
    },
  };
};

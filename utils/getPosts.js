import filter from 'lodash/collection/filter';
import sortBy from 'lodash/collection/sortBy';

export default function getPosts(allPages) {
  const posts = filter(allPages, function(page) {
    const data = page.data;
    return page.path && page.path !== '/' && data && !data.draft;
  });

  return sortBy(posts, page => page.data.data).reverse();
};
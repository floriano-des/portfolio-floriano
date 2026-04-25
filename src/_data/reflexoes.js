/**
 * Busca os artigos do Medium via RSS no momento do build.
 * Os dados ficam disponíveis em todos os templates como `reflexoes.items`.
 */
module.exports = async function () {
  const FEED_URL = 'https://medium.com/feed/@floriano-des';
  const FETCH_TIMEOUT_MS = 5000;
  const fallback = normalizeFeed(require('./reflexoes-fallback.json'));

  try {
    const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = parseRSS(xml);
    return items.length ? { items } : fallback;
  } catch (err) {
    console.warn(`[reflexoes] Falha ao buscar feed do Medium: ${err.message}`);
    return fallback;
  }
};

/* -------------------------------------------------------
   Parser de RSS
------------------------------------------------------- */
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;

  while ((m = itemRegex.exec(xml)) !== null) {
    const raw = m[1];

    const title     = getCDATA(raw, 'title') || getTag(raw, 'title');
    const link      = getTag(raw, 'link') || getCDATA(raw, 'guid') || getTag(raw, 'guid');
    const pubDate   = getTag(raw, 'pubDate');
    const content   = getCDATA(raw, 'content:encoded');
    const desc      = getCDATA(raw, 'description');

    if (!title || !link) continue;

    // Primeira imagem do conteúdo como thumbnail
    const imgMatch  = content.match(/src="(https?:\/\/[^"]+)"/);
    const thumbnail = imgMatch ? imgMatch[1] : null;

    const plainText = toPlainText(desc || content);
    const excerpt = makeExcerpt(plainText, 160);

    // Formata data para exibição em pt-BR
    let dateDisplay = '';
    let dateAttr    = '';
    let dateIso     = '';
    if (pubDate) {
      const d = new Date(pubDate);
      if (!isNaN(d.getTime())) {
        dateAttr    = d.toISOString().slice(0, 10);
        dateIso     = d.toISOString();
        dateDisplay = d.toLocaleDateString('pt-BR', {
          day: 'numeric', month: 'long', year: 'numeric'
        });
      }
    }

    let contentHtml = sanitizeMediumHtml(content);
    if (thumbnail) {
      contentHtml = removeFirstThumbnailFigure(contentHtml, thumbnail);
    }

    items.push(normalizePost({
      title,
      link,
      thumbnail,
      excerpt,
      plainText,
      dateDisplay,
      dateAttr,
      dateIso,
      contentHtml,
    }));
  }

  return items;
}

function normalizeFeed(feed) {
  return {
    items: Array.isArray(feed.items) ? feed.items.map(normalizePost) : [],
  };
}

function normalizePost(post) {
  const title = post.title || 'Reflexão';
  const sourceUrl = post.sourceUrl || post.link || '';
  const slug = post.slug || slugFromMediumUrl(sourceUrl) || slugify(title);
  const plainText = post.plainText || toPlainText(post.contentHtml || post.excerpt || '');
  const excerpt = makeExcerpt(post.excerpt || plainText, 160);
  const canonicalUrl = `https://floriano.des.br/reflexoes/${slug}/`;
  const dateIso = post.dateIso || normalizeDateIso(post.dateAttr);
  const dateAttr = post.dateAttr || (dateIso ? dateIso.slice(0, 10) : '');
  const dateDisplay = post.dateDisplay || formatDateDisplay(dateIso);

  return {
    ...post,
    title,
    link: sourceUrl,
    sourceUrl,
    slug,
    url: `/reflexoes/${slug}/`,
    canonicalUrl,
    excerpt,
    plainText,
    dateAttr,
    dateDisplay,
    dateIso,
    contentHtml: post.contentHtml || fallbackContentHtml(excerpt, sourceUrl),
    jsonLd: buildBlogPostingJsonLd({
      title,
      excerpt,
      canonicalUrl,
      sourceUrl,
      thumbnail: post.thumbnail,
      dateIso,
      dateModifiedIso: post.dateModifiedIso || dateIso,
      plainText,
    }),
  };
}

function fallbackContentHtml(excerpt, sourceUrl) {
  const parts = [];

  if (excerpt) {
    parts.push(`<p>${escapeHtml(excerpt)}</p>`);
  }

  if (sourceUrl) {
    parts.push(`<p>Conteúdo completo disponível no <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">Medium</a>.</p>`);
  }

  return parts.join('');
}

function slugFromMediumUrl(url) {
  try {
    const { pathname } = new URL(url);
    const lastSegment = pathname.split('/').filter(Boolean).pop() || '';
    const decodedSegment = decodeURIComponent(lastSegment);
    return slugify(decodedSegment.replace(/-[a-f0-9]{10,}$/i, ''));
  } catch (_) {
    return '';
  }
}

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function toPlainText(value) {
  return decodeHtmlEntities(String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function makeExcerpt(value, maxLength) {
  const text = toPlainText(value);

  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength + 1);
  const lastSpace = truncated.lastIndexOf(' ');
  const cut = lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated.slice(0, maxLength);

  return `${cut.replace(/[.,;:!?]+$/, '')}...`;
}

function normalizeDateIso(value) {
  if (!value) return '';

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function formatDateDisplay(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildBlogPostingJsonLd(post) {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: post.canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.canonicalUrl,
    },
    author: {
      '@type': 'Person',
      name: 'Floriano Silva',
      url: 'https://floriano.des.br/sobre/',
    },
    publisher: {
      '@type': 'Person',
      name: 'Floriano Silva',
      url: 'https://floriano.des.br/',
    },
    inLanguage: 'pt-BR',
    isBasedOn: post.sourceUrl,
    wordCount: post.plainText ? post.plainText.split(/\s+/).filter(Boolean).length : undefined,
  };

  if (post.thumbnail) payload.image = [post.thumbnail];
  if (post.dateIso) payload.datePublished = post.dateIso;
  if (post.dateModifiedIso) payload.dateModified = post.dateModifiedIso;

  return JSON.stringify(removeUndefined(payload));
}

function removeUndefined(value) {
  if (Array.isArray(value)) return value.map(removeUndefined);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => item !== undefined && item !== '')
      .map(([key, item]) => [key, removeUndefined(item)])
  );
}

function sanitizeMediumHtml(html) {
  if (!html) return '';

  const withoutUnsafeBlocks = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '');

  const allowedTags = new Set([
    'a',
    'blockquote',
    'br',
    'code',
    'em',
    'figcaption',
    'figure',
    'h2',
    'h3',
    'h4',
    'hr',
    'img',
    'li',
    'ol',
    'p',
    'pre',
    'strong',
    'ul',
  ]);

  return withoutUnsafeBlocks.replace(/<\/?([a-z0-9:-]+)([^>]*)>/gi, (match, tagName, attrs = '') => {
    const tag = tagName.toLowerCase();
    const isClosing = match.startsWith('</');

    if (!allowedTags.has(tag)) return '';
    if (isClosing) return `</${tag}>`;

    if (tag === 'a') return `<a${safeAnchorAttrs(attrs)}>`;
    if (tag === 'img') {
      const imageAttrs = safeImageAttrs(attrs);
      return imageAttrs ? `<img${imageAttrs}>` : '';
    }
    if (tag === 'br' || tag === 'hr') return `<${tag}>`;

    return `<${tag}>`;
  });
}

function safeAnchorAttrs(attrs) {
  const href = getAttr(attrs, 'href');
  const safeHref = isSafeUrl(href) ? href : '';

  if (!safeHref) return '';

  return ` href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer"`;
}

function safeImageAttrs(attrs) {
  const src = getAttr(attrs, 'src');
  if (!isSafeUrl(src) || isBlockedImageUrl(src)) return '';

  const alt = getAttr(attrs, 'alt');
  const title = getAttr(attrs, 'title');
  const width = getAttr(attrs, 'width');
  const height = getAttr(attrs, 'height');
  const out = [
    ` src="${escapeHtml(src)}"`,
    ` alt="${escapeHtml(alt)}"`,
    ' loading="lazy"',
    ' decoding="async"',
  ];

  if (/^\d+$/.test(width)) out.push(` width="${width}"`);
  if (/^\d+$/.test(height)) out.push(` height="${height}"`);
  if (title) out.push(` title="${escapeHtml(title)}"`);

  return out.join('');
}

function removeFirstThumbnailFigure(html, thumbnail) {
  const escapedThumbnail = escapeRegExp(escapeHtml(thumbnail));
  const figureWithThumbnail = new RegExp(`<figure>\\s*<img[^>]+src="${escapedThumbnail}"[^>]*>[\\s\\S]*?<\\/figure>`, 'i');

  if (figureWithThumbnail.test(html)) {
    return html.replace(figureWithThumbnail, '').trim();
  }

  const imageWithThumbnail = new RegExp(`<img[^>]+src="${escapedThumbnail}"[^>]*>`, 'i');
  return html.replace(imageWithThumbnail, '').trim();
}

function isBlockedImageUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith('medium.com') && parsed.pathname.startsWith('/_/stat');
  } catch (_) {
    return false;
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAttr(attrs, name) {
  const re = new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
  const match = attrs.match(re);
  return match ? (match[2] || match[3] || match[4] || '').trim() : '';
}

function isSafeUrl(url) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch (_) {
    return url.startsWith('/');
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decodeHtmlEntities(value) {
  const entities = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  };

  return String(value || '').replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const isHex = entity[1]?.toLowerCase() === 'x';
      const codePoint = Number.parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return entities[entity.toLowerCase()] || match;
  });
}

/* -------------------------------------------------------
   Helpers de extração de XML
------------------------------------------------------- */
function getCDATA(str, tag) {
  const re = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, 'i'
  );
  const m = str.match(re);
  return m ? m[1].trim() : '';
}

function getTag(str, tag) {
  const re = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i');
  const m = str.match(re);
  return m ? m[1].trim() : '';
}

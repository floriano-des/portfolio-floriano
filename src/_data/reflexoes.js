/**
 * Busca os artigos do Medium via RSS no momento do build.
 * Os dados ficam disponíveis em todos os templates como `reflexoes.items`.
 */
module.exports = async function () {
  const FEED_URL = 'https://medium.com/feed/@floriano-des';
  const FETCH_TIMEOUT_MS = 5000;
  const fallback = require('./reflexoes-fallback.json');

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

    // Resumo: stripa HTML do description ou do content
    const raw_excerpt = (desc || content).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const excerpt = raw_excerpt.length > 200
      ? raw_excerpt.slice(0, 197) + '...'
      : raw_excerpt;

    // Formata data para exibição em pt-BR
    let dateDisplay = '';
    let dateAttr    = '';
    if (pubDate) {
      const d = new Date(pubDate);
      if (!isNaN(d.getTime())) {
        dateAttr    = d.toISOString().slice(0, 10);
        dateDisplay = d.toLocaleDateString('pt-BR', {
          day: 'numeric', month: 'long', year: 'numeric'
        });
      }
    }

    items.push({ title, link, thumbnail, excerpt, dateDisplay, dateAttr });
  }

  return items;
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

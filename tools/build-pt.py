#!/usr/bin/env python3
"""Build the Portuguese site in pt/ from the English pages.

    python3 tools/build-pt.py

English is the source of truth. Every page is read from the root, its text
nodes and text attributes are swapped through tools/pt.txt, and the result is
written to pt/ with paths, language tags and URLs adjusted. Anything English
that has no translation (and is not a name in KEEP) stops the build and is
listed, so an untranslated sentence can never ship by accident.

Edit English, add or change its line in tools/pt.txt, run this again."""
import html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from i18n_lib import norm, worth, ATTRS, META_NAMES, META_PROPS, SKIP_TAGS, SKIP_CLASSES

SITE = 'https://www.axvitor.com'
PAGES = ['index', 'careers-page', 'wcag-study', 'creatorhub', 'element-dashboard',
         'digital-signage', 'gym-and-bet', 'design-system', 'muni']
HTML_PAGES = {f'{p}.html' for p in PAGES}

# Pages whose Portuguese is left exactly as it is: the English text was
# rewritten and the Portuguese has not been (yet), so the build neither
# regenerates nor checks them. Remove a page from here to translate it again.
FROZEN = {'wcag-study', 'creatorhub', 'element-dashboard', 'digital-signage', 'gym-and-bet'}

# names and labels that read the same in Portuguese
KEEP = {
    'Vitor Xavier', 'LinkedIn', 'MUNI', 'OnSign', 'CreatorHub', 'Gym&Bet', 'UFSC',
    'Twitter', 'Social Wall', 'News RSS', 'Exchange Rate', 'Countdown',
    'Checklist Fácil · 2021 – 2022', 'OnSign · 2017 – 2021',
    # the language switch, rewritten to point back to English in localise()
    'PT', 'Ver em português',
}
# people's titles under their recommendations ("at" becomes "na")
TITLES = {
    'PM at Commas (Awesomic)': 'PM na Commas (Awesomic)',
    'Senior Product Manager at Starian (Checklist Fácil)': 'Senior Product Manager na Starian (Checklist Fácil)',
    'Director, Multiplatform Signage Solutions at OnSign': 'Director, Multiplatform Signage Solutions na OnSign',
}

def load_dict():
    d, en = {}, None
    for line in open(os.path.join(ROOT, 'tools', 'pt.txt'), encoding='utf-8'):
        line = line.rstrip('\n')
        if line.startswith('EN: '): en = norm(line[4:])
        elif line.startswith('PT: ') and en is not None:
            d[en] = line[4:].strip(); en = None
    d.update(TITLES)
    return d

D = load_dict()
missing = {}

def tr(text, page):
    """translate one string, keeping its surrounding whitespace"""
    key = norm(text)
    if not worth(key): return text
    if key in D: out = D[key]
    elif key in KEEP: return text
    else:
        missing.setdefault(key, set()).add(page); return text
    lead = text[:len(text) - len(text.lstrip())]; trail = text[len(text.rstrip()):]
    return lead + out + trail

def fix_url(u):
    """pt/ pages: other pages stay alongside, everything else is one level up"""
    if not u or re.match(r'^(https?:|mailto:|tel:|#|data:|//|\.\./)', u): return u
    page = u.split('#')[0].split('?')[0]
    if page in HTML_PAGES or page == '': return u
    return '../' + u

TOKEN = re.compile(r'<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>|<[^>]+>|[^<]+', re.S)
ATTR = re.compile(r'''([\w:-]+)(\s*=\s*)("[^"]*"|'[^']*')''')
VOID = {'img', 'meta', 'link', 'input', 'br', 'hr', 'source', 'area', 'base', 'col', 'wbr', 'track'}

def translate_page(src, page):
    out, stack, skip = [], [], 0
    for m in TOKEN.finditer(src):
        tok = m.group(0)
        if tok.startswith('<!--'):
            out.append(tok); continue
        if tok.startswith('<script') or tok.startswith('<style'):
            # the contents stay untouched; only a script's own src moves up a level
            head_end = tok.index('>') + 1
            opening = re.sub(r'(\ssrc\s*=\s*")([^"]*)(")', lambda a: a.group(1) + fix_url(a.group(2)) + a.group(3), tok[:head_end])
            out.append(opening + tok[head_end:]); continue
        if tok.startswith('</'):
            name = re.match(r'</\s*([\w-]+)', tok).group(1).lower()
            if name not in VOID and stack:
                skip -= stack.pop()
            out.append(tok); continue
        if tok.startswith('<'):
            mt = re.match(r'<\s*([\w!-]+)', tok)
            name = mt.group(1).lower() if mt else ''
            if name.startswith('!'):
                out.append(tok); continue
            cls = re.search(r'\bclass\s*=\s*"([^"]*)"', tok)
            cls = cls.group(1).split() if cls else []
            selfclose = tok.endswith('/>') or name in VOID
            skipping = name in SKIP_TAGS or any(c in cls for c in SKIP_CLASSES)
            meta_name = re.search(r'\bname\s*=\s*"([^"]*)"', tok)
            meta_prop = re.search(r'\bproperty\s*=\s*"([^"]*)"', tok)
            def attr(am):
                k, eq, v = am.group(1), am.group(2), am.group(3)
                q, val = v[0], html.unescape(v[1:-1])
                kl = k.lower()
                if kl in ('href', 'src', 'poster'):
                    val = fix_url(val)
                elif kl == 'srcset':
                    val = ', '.join(fix_url(p.strip().split(' ')[0]) + ''.join(' ' + x for x in p.strip().split(' ')[1:]) for p in val.split(','))
                elif not skip and not skipping and kl in ATTRS:
                    val = tr(val, page)
                elif not skip and kl == 'content' and name == 'meta' and (
                        (meta_name and meta_name.group(1) in META_NAMES) or (meta_prop and meta_prop.group(1) in META_PROPS)):
                    val = tr(val, page)
                return f'{k}{eq}{q}{html.escape(val, quote=True) if q == chr(34) else html.escape(val, quote=False)}{q}'
            tok = ATTR.sub(attr, tok)
            if not selfclose:
                stack.append(skipping); skip += skipping
            out.append(tok); continue
        # text
        if skip or not worth(tok):
            out.append(tok); continue
        raw = html.unescape(tok)
        new = tr(raw, page)
        out.append(tok if new == raw else html.escape(new, quote=False))
    return ''.join(out)

def localise(doc, page):
    url_en = f'{SITE}/' if page == 'index' else f'{SITE}/{page}.html'
    url_pt = f'{SITE}/pt/' if page == 'index' else f'{SITE}/pt/{page}.html'
    doc = doc.replace('<html lang="en">', '<html lang="pt-BR">', 1)
    doc = doc.replace(f'<link rel="canonical" href="{url_en}" />', f'<link rel="canonical" href="{url_pt}" />', 1)
    doc = doc.replace(f'<meta property="og:url" content="{url_en}" />',
                      f'<meta property="og:url" content="{url_pt}" />\n<meta property="og:locale" content="pt_BR" />\n<meta property="og:locale:alternate" content="en_US" />', 1)
    # the language switch: on pt pages it points back to English
    sw = f'../{page}.html' if page != 'index' else '../'
    doc = re.sub(r'<a class="nav__lang([^"]*)" href="[^"]*" hreflang="pt-BR" lang="pt-BR" aria-label="Ver em português">PT</a>',
                 lambda m: f'<a class="nav__lang{m.group(1)}" href="{sw}" hreflang="en" lang="en" aria-label="View in English">EN</a>', doc)
    doc = re.sub(r'<a class="drawer__lang" href="[^"]*" hreflang="pt-BR" lang="pt-BR">Ver em português</a>',
                 f'<a class="drawer__lang" href="{sw}" hreflang="en" lang="en">View in English</a>', doc)
    # structured data on the home page
    def ld(m):
        data = json.loads(m.group(2))
        for k in ('description',):
            if k in data and norm(data[k]) in D: data[k] = D[norm(data[k])]
        data['url'] = url_pt
        data['knowsLanguage'] = ['pt-BR', 'en']
        return m.group(1) + json.dumps(data, ensure_ascii=False, indent=2) + m.group(3)
    doc = re.sub(r'(<script type="application/ld\+json">\s*)(\{.*?\})(\s*</script>)', ld, doc, flags=re.S)
    return doc

def main():
    os.makedirs(os.path.join(ROOT, 'pt'), exist_ok=True)
    built = {}
    for p in PAGES:
        if p in FROZEN: continue
        src = open(os.path.join(ROOT, f'{p}.html'), encoding='utf-8').read()
        built[p] = localise(translate_page(src, p), p)
    if missing:
        print('Untranslated English (add to tools/pt.txt or KEEP):')
        for k, v in sorted(missing.items()): print(f'  [{", ".join(sorted(v))}] {k}')
        sys.exit(1)
    for p, doc in built.items():
        open(os.path.join(ROOT, 'pt', f'{p}.html'), 'w', encoding='utf-8').write(doc)
    print(f'built {len(built)} pages into pt/ (left as they are: {", ".join(sorted(FROZEN)) or "none"})')

if __name__ == '__main__':
    main()

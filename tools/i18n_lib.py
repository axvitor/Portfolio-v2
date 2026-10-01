"""Shared helpers for the Portuguese build: find every translatable string in a
page (text nodes and text attributes), and rewrite a page through a dictionary.

Text is matched on its whitespace-normalised form; the original's leading and
trailing whitespace is kept, so the markup's indentation survives."""
import re
from html.parser import HTMLParser

ATTRS = {'alt', 'aria-label', 'title', 'placeholder'}
META_NAMES = {'description', 'twitter:title', 'twitter:description', 'twitter:image:alt'}
META_PROPS = {'og:title', 'og:description', 'og:image:alt'}
SKIP_TAGS = {'script', 'style', 'svg', 'code'}
# the recommendations stay in the words their authors wrote
SKIP_CLASSES = ('tsk__q', 'tsk__n')

def norm(s):
    return re.sub(r'\s+', ' ', s).strip()

def worth(s):
    t = norm(s)
    return bool(t) and re.search(r'[A-Za-z]', t) is not None

class Collector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []; self.skip = 0; self.found = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); cls = a.get('class') or ''
        skipping = tag in SKIP_TAGS or any(c in cls.split() for c in SKIP_CLASSES)
        void = tag in ('img','meta','link','input','br','hr','source')
        if not void:
            self.stack.append(skipping); self.skip += skipping
        if self.skip: return
        for k, v in a.items():
            if v and k in ATTRS and worth(v): self.found.append(norm(v))
        if tag == 'meta' and a.get('content') and (a.get('name') in META_NAMES or a.get('property') in META_PROPS):
            if worth(a['content']): self.found.append(norm(a['content']))
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in ('img','meta','link','input','br','hr','source') and self.stack:
            self.skip -= self.stack.pop()
    def handle_endtag(self, tag):
        if tag in ('img','meta','link','input','br','hr','source'): return
        if self.stack: self.skip -= self.stack.pop()
    def handle_data(self, d):
        if not self.skip and worth(d): self.found.append(norm(d))

def strings(html):
    c = Collector(); c.feed(html); return c.found

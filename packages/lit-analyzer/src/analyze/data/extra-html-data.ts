import { SimpleType, SimpleTypeStringLiteral, SimpleTypeUnion } from 'ts-simple-type'

import { makePrimitiveArrayType } from '../util/type-util.js'

const HTML_5_ATTR_TYPES: { [key: string]: string | string[] | [string[]] } = {
  'onafterprint': 'string',
  'onbeforeprint': 'string',
  'onbeforeunload': 'string',
  'onhashchange': 'string',
  'onlanguagechange': 'string',
  'onmessage': 'string',
  'onoffline': 'string',
  'ononline': 'string',
  'onpagehide': 'string',
  'onpageshow': 'string',
  'onpopstate': 'string',
  'onstorage': 'string',
  'onunload': 'string',
  'onslotchange': 'string',
  // Standard event handlers
  'onabort': 'string',
  'onblur': 'string',
  'oncanplay': 'string',
  'oncanplaythrough': 'string',
  'onchange': 'string',
  'onclick': 'string',
  'oncontextmenu': 'string',
  'ondblclick': 'string',
  'ondrag': 'string',
  'ondragend': 'string',
  'ondragenter': 'string',
  'ondragleave': 'string',
  'ondragover': 'string',
  'ondrop': 'string',
  'ondurationchange': 'string',
  'onemptied': 'string',
  'onended': 'string',
  'onerror': 'string',
  'onfocus': 'string',
  'oninput': 'string',
  'oninvalid': 'string',
  'onkeydown': 'string',
  'onkeypress': 'string',
  'onkeyup': 'string',
  'onload': 'string',
  'onloadeddata': 'string',
  'onloadedmetadata': 'string',
  'onloadstart': 'string',
  'onmousedown': 'string',
  'onmouseenter': 'string',
  'onmouseleave': 'string',
  'onmousemove': 'string',
  'onmouseout': 'string',
  'onmouseover': 'string',
  'onmouseup': 'string',
  'onmousewheel': 'string',
  'onpaste': 'string',
  'onpause': 'string',
  'onplay': 'string',
  'onplaying': 'string',
  'onprogress': 'string',
  'onreset': 'string',
  'onresize': 'string',
  'onscroll': 'string',
  'onseeked': 'string',
  'onseeking': 'string',
  'onselect': 'string',
  'onshow': 'string',
  'onstalled': 'string',
  'onsubmit': 'string',
  'onsuspend': 'string',
  'ontimeupdate': 'string',
  'ontoggle': 'string',
  'onvolumechange': 'string',
  'onwaiting': 'string',
  'aria-activedescendant': '',
  'aria-colcount': '',
  'aria-colindex': '',
  'aria-colspan': '',
  'aria-controls': '',
  'aria-describedat': '',
  'aria-describedby': '',
  'aria-errormessage': '',
  'aria-flowto': '',
  'aria-kbdshortcuts': '',
  'aria-label': '',
  'aria-labelledby': '',
  'aria-level': '',
  'aria-owns': '',
  'aria-placeholder': '',
  'aria-posinset': '',
  'aria-roledescription': '',
  'aria-rowcount': '',
  'aria-rowindex': '',
  'aria-rowspan': '',
  'aria-setsize': '',
  'aria-valuemax': '',
  'aria-valuemin': '',
  'aria-valuenow': '',
  'aria-valuetext': '',
  'aria-atomic': ['true', 'false'],
  'aria-autocomplete': ['none', 'inline', 'list', 'both'],
  'aria-braillelabel': '',
  'aria-brailleroledescription': '',
  'aria-busy': ['true', 'false'],
  'aria-checked': ['true', 'false', 'mixed'],
  'aria-colindextext': '',
  'aria-current': ['page', 'step', 'location', 'date', 'time', 'true', 'false'],
  'aria-details': '',
  'aria-disabled': ['true', 'false'],
  'aria-dropeffect': [['copy', 'execute', 'link', 'move', 'none', 'popup']],
  'aria-expanded': ['true', 'false'],
  'aria-grabbed': ['true', 'false'],
  'aria-haspopup': ['true', 'false', 'menu', 'listbox', 'tree', 'grid', 'dialog'],
  'aria-hidden': ['true', 'false'],
  'aria-invalid': ['true', 'false', 'grammar', 'spelling'],
  'aria-keyshortcuts': '',
  'aria-live': ['off', 'polite', 'assertive'],
  'aria-modal': ['true', 'false'],
  'aria-multiline': ['true', 'false'],
  'aria-multiselectable': ['true', 'false'],
  'aria-orientation': ['horizontal', 'vertical'],
  'aria-pressed': ['true', 'false', 'mixed'],
  'aria-readonly': ['true', 'false'],
  'aria-relevant': [['additions', 'removals', 'text', 'all']],
  'aria-required': ['true', 'false'],
  'aria-rowindextext': '',
  'aria-selected': ['true', 'false'],
  'aria-sort': ['ascending', 'descending', 'none', 'other'],
  'accesskey': 'string',
  'autocomplete': [
    'on',
    'off',
    'name',
    'honorific-prefix',
    'given-name',
    'additional-name',
    'family-name',
    'honorific-suffix',
    'nickname',
    'email',
    'username',
    'new-password',
    'current-password',
    'one-time-code',
    'organization-title',
    'organization',
    'street-address',
    'address-line1',
    'address-line2',
    'address-line3',
    'address-level4',
    'address-level3',
    'address-level2',
    'address-level1',
    'country',
    'country-name',
    'postal-code',
    'cc-name',
    'cc-given-name',
    'cc-additional-name',
    'cc-family-name',
    'cc-number',
    'cc-exp',
    'cc-exp-month',
    'cc-exp-year',
    'cc-csc',
    'cc-type',
    'transaction-currency',
    'transaction-amount',
    'language',
    'bday',
    'bday-day',
    'bday-month',
    'bday-year',
    'sex',
    'tel',
    'tel-country-code',
    'tel-national',
    'tel-area-code',
    'tel-local',
    'tel-extension',
    'impp',
    'url',
    'photo',
  ],
  'autofocus': 'boolean',
  'contenteditable': ['true', 'false', 'plaintext-only'],
  'dir': ['ltr', 'rtl', 'auto'],
  'draggable': ['true', 'false'],
  'enterkeyhint': ['enter', 'done', 'go', 'next', 'previous', 'search', 'send'],
  'hidden': 'boolean',
  'inert': 'boolean',
  'inputmode': ['none', 'text', 'decimal', 'numeric', 'tel', 'search', 'email', 'url'],
  'is': 'string',
  'itemscope': 'boolean',
  'spellcheck': ['true', 'false'],
  'translate': ['yes', 'no', ''],
  'autocapitalize': ['off', 'none', 'on', 'sentences', 'words', 'characters'],
  'class': 'string',
  'contextmenu': 'string',
  'dropzone': ['copy', 'move', 'link'],
  'id': 'string',
  'itemid': '',
  'itemprop': '',
  'itemref': '',
  'itemtype': '',
  'lang': 'string',
  'style': 'string',
  'tabindex': 'number',
  'title': 'string',
  'manifest': '',
  'href': 'string',
  'target': 'string|"_blank"|"_parent"|"_self"|"_top"',
  'rel': '',
  'media': '',
  'hreflang': '',
  'type': '',
  // Form attributes
  'checked': 'boolean',
  'disabled': 'boolean',
  'multiple': 'boolean',
  'readonly': 'boolean',
  'required': 'boolean',
  'selected': 'boolean',
  'formenctype': ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'],
  'formmethod': ['get', 'post'],
  'formnovalidate': 'boolean',
  'novalidate': 'boolean',
  // Media attributes
  'autoplay': 'boolean',
  'controls': 'boolean',
  'loop': 'boolean',
  'muted': 'boolean',
  'preload': ['none', 'metadata', 'auto'],
  'crossorigin': ['anonymous', 'use-credentials'],
  'playsinline': 'boolean',
  // Security and loading attributes
  'integrity': 'string',
  'referrerpolicy': [
    'no-referrer',
    'no-referrer-when-downgrade',
    'origin',
    'origin-when-cross-origin',
    'same-origin',
    'strict-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url',
  ],
  'loading': ['eager', 'lazy'],
  'decoding': ['sync', 'async', 'auto'],
  'fetchpriority': ['high', 'low', 'auto'],
  // Modern attributes
  'popover': ['auto', 'manual'],
  'popovertarget': 'string',
  'popovertargetaction': ['hide', 'show', 'toggle'],
  'virtualkeyboardpolicy': ['auto', 'manual'],
  // Legacy and misc attributes
  'align': ['left', 'center', 'right', 'justify'],
  'bgcolor': 'string',
  'color': 'string',
  'face': 'string',
  'background': 'string',
  'clear': ['left', 'right', 'all', 'none'],
  'hspace': 'number',
  'vspace': 'number',
  'marginheight': 'number',
  'marginwidth': 'number',
  'scrolling': ['yes', 'no', 'auto'],
  'frameborder': ['0', '1'],
  'sizes': '',
  // Additional attributes
  'as': [
    'audio',
    'document',
    'embed',
    'fetch',
    'font',
    'image',
    'object',
    'script',
    'style',
    'track',
    'video',
    'worker',
  ],
  'async': 'boolean',
  'capture': ['user', 'environment'],
  'defer': 'boolean',
  'enctype': ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'],
  'method': ['get', 'post', 'dialog'],
  'open': 'boolean',
  'reversed': 'boolean',
  'sandbox': [
    ['allow-forms', 'allow-pointer-lock', 'allow-popups', 'allow-same-origin', 'allow-scripts', 'allow-top-navigation'],
  ],
  'scope': ['row', 'col', 'rowgroup', 'colgroup'],
  'seamless': 'boolean',
  'wrap': ['soft', 'hard'],
  'name': 'string',
  'http-equiv': '',
  'content': '',
  'charset': '',
  'nonce': '',
  'cite': '',
  'start': '',
  'value': 'string',
  'download': 'boolean|string',
  'ping': '',
  'datetime': '',
  'alt': 'string',
  'src': 'string',
  'srcset': '',
  'usemap': '',
  'width': 'number|string',
  'height': 'number|string',
  'srcdoc': '',
  'data': '',
  'form': 'string',
  'poster': 'string',
  'mediagroup': '',
  'label': 'string',
  'srclang': 'string',
  'coords': 'string',
  'border': ['0', '1'],
  'span': 'number',
  'colspan': 'number',
  'rowspan': 'number',
  'headers': 'string',
  'sorted': '',
  'abbr': 'string',
  'accept-charset': 'string',
  'action': 'string',
  'for': 'string',
  'accept': 'string',
  'dirname': 'string',
  'formaction': 'string',
  'formtarget': ['_self', '_blank', '_parent', '_top'],
  'list': 'string',
  'max': 'number|string',
  'maxlength': 'number',
  'min': 'number|string',
  'minlength': 'number',
  'pattern': 'string',
  'placeholder': 'string',
  'size': 'number',
  'step': 'number',
  'cols': 'number',
  'rows': 'number',
  'low': 'number',
  'high': 'number',
  'optimum': 'number',
  'slot': 'string',
  'part': 'string',
  'exportparts': 'string',
  'theme': 'string',
  // Additional missing attributes
  'kind': ['subtitles', 'captions', 'descriptions', 'chapters', 'metadata'],
  'default': 'boolean',
  'buffered': 'string',
  'challenge': 'string',
  'keytype': ['rsa', 'dsa', 'ec'],
  'language': 'string',
  'results': 'number',
  'security': ['restricted', 'unrestricted'],
  'unselectable': ['on', 'off'],
  'autocorrect': ['on', 'off'],
  'incremental': 'boolean',
  'webkitdirectory': 'boolean',
  'allowfullscreen': 'boolean',
  'allowpaymentrequest': 'boolean',
  'allowusermedia': 'boolean',
  'controlslist': [['nodownload', 'nofullscreen', 'noremoteplayback']],
  'role': [
    [
      'alert',
      'alertdialog',
      'button',
      'checkbox',
      'dialog',
      'gridcell',
      'link',
      'log',
      'marquee',
      'menuitem',
      'menuitemcheckbox',
      'menuitemradio',
      'option',
      'progressbar',
      'radio',
      'scrollbar',
      'searchbox',
      'slider',
      'spinbutton',
      'status',
      'switch',
      'tab',
      'tabpanel',
      'textbox',
      'timer',
      'tooltip',
      'treeitem',
      'combobox',
      'grid',
      'listbox',
      'menu',
      'menubar',
      'radiogroup',
      'tablist',
      'tree',
      'treegrid',
      'application',
      'article',
      'cell',
      'columnheader',
      'definition',
      'directory',
      'document',
      'feed',
      'figure',
      'group',
      'heading',
      'img',
      'list',
      'listitem',
      'math',
      'none',
      'note',
      'presentation',
      'region',
      'row',
      'rowgroup',
      'rowheader',
      'separator',
      'table',
      'term',
      'text',
      'toolbar',
      'banner',
      'complementary',
      'contentinfo',
      'form',
      'main',
      'navigation',
      'region',
      'search',
      'doc-abstract',
      'doc-acknowledgments',
      'doc-afterword',
      'doc-appendix',
      'doc-backlink',
      'doc-biblioentry',
      'doc-bibliography',
      'doc-biblioref',
      'doc-chapter',
      'doc-colophon',
      'doc-conclusion',
      'doc-cover',
      'doc-credit',
      'doc-credits',
      'doc-dedication',
      'doc-endnote',
      'doc-endnotes',
      'doc-epigraph',
      'doc-epilogue',
      'doc-errata',
      'doc-example',
      'doc-footnote',
      'doc-foreword',
      'doc-glossary',
      'doc-glossref',
      'doc-index',
      'doc-introduction',
      'doc-noteref',
      'doc-notice',
      'doc-pagebreak',
      'doc-pagelist',
      'doc-part',
      'doc-preface',
      'doc-prologue',
      'doc-pullquote',
      'doc-qna',
      'doc-subtitle',
      'doc-tip',
      'doc-toc',
    ],
  ],
}

export function hasTypeForAttrName(attrName: string): boolean {
  return HTML_5_ATTR_TYPES[attrName] != null && HTML_5_ATTR_TYPES[attrName].length > 0
}

export function html5TagAttrType(attrName: string): SimpleType {
  return stringToSimpleType(HTML_5_ATTR_TYPES[attrName] || '', attrName)
}

function stringToSimpleType(typeString: string | string[] | [string[]], name?: string): SimpleType {
  if (Array.isArray(typeString)) {
    if (Array.isArray(typeString[0])) {
      return makePrimitiveArrayType(stringToSimpleType(typeString[0]) as SimpleTypeUnion)
    }

    return {
      kind: 'UNION',
      types: (typeString as string[]).map((value) => ({ kind: 'STRING_LITERAL', value }) as SimpleTypeStringLiteral),
    }
  }

  if (typeString.includes('|')) {
    return {
      kind: 'UNION',
      types: typeString.split('|').map((typeStr) => stringToSimpleType(typeStr)),
    }
  }

  switch (typeString) {
    case 'number':
      return { kind: 'NUMBER', name }
    case 'boolean':
      return { kind: 'BOOLEAN', name }
    case 'string':
      return { kind: 'STRING', name }
    default:
      return { kind: 'ANY', name }
  }
}

/**
 * Data from vscode-html-languageservice
 */
export const EXTRA_HTML5_EVENTS = [
  {
    name: 'onanimationend',
    description: 'A CSS animation has completed.',
  },
  {
    name: 'onanimationiteration',
    description: 'A CSS animation is repeated.',
  },
  {
    name: 'onanimationstart',
    description: 'A CSS animation has started.',
  },
  {
    name: 'oncopy',
    description: 'The text selection has been added to the clipboard.',
  },
  {
    name: 'oncut',
    description: 'The text selection has been removed from the document and added to the clipboard.',
  },
  {
    name: 'ondragstart',
    description: 'The user starts dragging an element or text selection.',
  },
  {
    name: 'onfocusin',
    description: 'An element is about to receive focus (bubbles).',
  },
  {
    name: 'onfocusout',
    description: 'An element is about to lose focus (bubbles).',
  },
  {
    name: 'onfullscreenchange',
    description: 'An element was turned to fullscreen mode or back to normal mode.',
  },
  {
    name: 'onfullscreenerror',
    description:
      'It was impossible to switch to fullscreen mode for technical reasons or because the permission was denied.',
  },
  {
    name: 'ongotpointercapture',
    description: 'Element receives pointer capture.',
  },
  {
    name: 'onlostpointercapture',
    description: 'Element lost pointer capture.',
  },
  {
    name: 'onoffline',
    description: 'The browser has lost access to the network.',
  },
  {
    name: 'ononline',
    description: 'The browser has gained access to the network (but particular websites might be unreachable).',
  },
  {
    name: 'onpaste',
    description: 'Data has been transferred from the system clipboard to the document.',
  },
  {
    name: 'onpointercancel',
    description: 'The pointer is unlikely to produce any more events.',
  },
  {
    name: 'onpointerdown',
    description: 'The pointer enters the active buttons state.',
  },
  {
    name: 'onpointerenter',
    description: 'Pointing device is moved inside the hit-testing boundary.',
  },
  {
    name: 'onpointerleave',
    description: 'Pointing device is moved out of the hit-testing boundary.',
  },
  {
    name: 'onpointerlockchange',
    description: 'The pointer was locked or released.',
  },
  {
    name: 'onpointerlockerror',
    description: 'It was impossible to lock the pointer for technical reasons or because the permission was denied.',
  },
  {
    name: 'onpointermove',
    description: 'The pointer changed coordinates.',
  },
  {
    name: 'onpointerout',
    description: 'The pointing device moved out of hit-testing boundary or leaves detectable hover range.',
  },
  {
    name: 'onpointerover',
    description: 'The pointing device is moved into the hit-testing boundary.',
  },
  {
    name: 'onpointerup',
    description: 'The pointer leaves the active buttons state.',
  },
  {
    name: 'onratechange',
    description: 'The playback rate has changed.',
  },
  {
    name: 'onselectstart',
    description: 'A selection just started.',
  },
  {
    name: 'onselectionchange',
    description: 'The selection in the document has been changed.',
  },
  {
    name: 'ontouchcancel',
    description:
      'A touch point has been disrupted in an implementation-specific manners (too many touch points for example).',
  },
  {
    name: 'ontouchend',
    description: 'A touch point is removed from the touch surface.',
  },
  {
    name: 'ontouchmove',
    description: 'A touch point is moved along the touch surface.',
  },
  {
    name: 'ontouchstart',
    description: 'A touch point is placed on the touch surface.',
  },
  {
    name: 'ontransitionend',
    description: 'A CSS transition has completed.',
  },
  {
    name: 'onwheel',
    description: 'A wheel button of a pointing device is rotated in any direction.',
  },
]

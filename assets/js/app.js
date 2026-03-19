(function(){
  'use strict';

  function esc(s){ return (s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  function highlightCpp(src){
    const KW = new Set([
      'alignas','alignof','and','and_eq','asm','auto','bitand','bitor','break','case','catch','class','compl','const',
      'consteval','constexpr','constinit','const_cast','continue','co_await','co_return','co_yield','decltype','default',
      'delete','do','dynamic_cast','else','enum','explicit','export','extern','false','final','for','friend','goto','if',
      'inline','mutable','namespace','new','noexcept','not','not_eq','nullptr','operator','or','or_eq','override','private',
      'protected','public','reflexpr','register','reinterpret_cast','requires','return','sizeof','static','static_assert',
      'static_cast','struct','switch','template','this','thread_local','throw','true','try','typedef','typeid','typename',
      'union','using','virtual','volatile','while','xor','xor_eq'
    ]);
    const TYPES = new Set([
      'bool','char','char8_t','char16_t','char32_t','wchar_t','short','int','long','signed','unsigned','float','double','void',
      'size_t','ptrdiff_t','nullptr_t','string','u8string','u16string','u32string','vector','map','set','unordered_map',
      'unordered_set','pair','tuple','array','deque','list','stack','queue','priority_queue'
    ]);

    let i = 0, out = '', n = src.length;
    const peek = (k=0)=> src[i+k] || '';

    while(i < n){
      const ch = peek();
      if((i===0 || src[i-1]==='\n') && ch === '#'){
        let j=i; while(j<n && src[j] !== '\n') j++;
        out += '<span class="tok-pp">' + esc(src.slice(i,j)) + '</span>'; i=j; continue;
      }
      if(ch === '/' && peek(1) === '*'){
        let j=i+2; while(j<n && !(src[j]==='*' && src[j+1]==='/')) j++; j=Math.min(n,j+2);
        out += '<span class="tok-comm">' + esc(src.slice(i,j)) + '</span>'; i=j; continue;
      }
      if(ch === '/' && peek(1) === '/'){
        let j=i; while(j<n && src[j] !== '\n') j++;
        out += '<span class="tok-comm">' + esc(src.slice(i,j)) + '</span>'; i=j; continue;
      }
      if(ch === '"' || ch === "'"){
        const q = ch;
        let j=i+1, flag=false;
        while(j<n){ const cj=src[j]; if(flag){ flag=false; j++; continue; } if(cj==='\\'){ flag=true; j++; continue; } if(cj===q){ j++; break; } j++; }
        out += `<span class="${q==='"'?'tok-str':'tok-char'}">${esc(src.slice(i,j))}</span>`; i=j; continue;
      }
      const num = /^(?:0x[0-9a-fA-F]+|0b[01]+|\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)(?:[uUlLfF]*)/.exec(src.slice(i))?.[0];
      if(num){ out += '<span class="tok-num">' + esc(num) + '</span>'; i += num.length; continue; }
      if(/[A-Za-z_]/.test(ch)){
        const id = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i))[0];
        if(KW.has(id)) out += '<span class="tok-kw">' + esc(id) + '</span>';
        else if(TYPES.has(id)) out += '<span class="tok-type">' + esc(id) + '</span>';
        else out += esc(id);
        i += id.length; continue;
      }
      out += esc(ch); i++;
    }
    return out;
  }

  function highlightPython(src){
    const KW = new Set([
      'False','None','True','and','as','assert','async','await','break','class','continue','def','del','elif','else','except',
      'finally','for','from','global','if','import','in','is','lambda','nonlocal','not','or','pass','raise','return','try','while','with','yield','match','case'
    ]);
    const BUILTIN = new Set([
      'print','input','len','range','int','float','str','list','dict','set','tuple','abs','min','max','sum','map','filter','enumerate','zip','open','sorted','reversed','type','isinstance'
    ]);
    const DEC = new Set(['staticmethod','classmethod','property','dataclass']);

    let i = 0, out = '', n = src.length;
    const peek = (k=0)=> src[i+k] || '';

    while(i < n){
      const ch = peek();

      if(ch === '#'){
        let j=i; while(j<n && src[j] !== '\n') j++;
        out += '<span class="tok-comm">' + esc(src.slice(i,j)) + '</span>'; i=j; continue;
      }

      const triple = src.slice(i, i+3);
      if(triple === '"""' || triple === "'''"){
        const q = triple;
        let j = i + 3;
        while(j < n && src.slice(j, j+3) !== q) j++;
        j = Math.min(n, j + 3);
        out += '<span class="tok-str">' + esc(src.slice(i,j)) + '</span>'; i = j; continue;
      }

      if(ch === '"' || ch === "'"){
        const q = ch;
        let j=i+1, flag=false;
        while(j<n){ const cj=src[j]; if(flag){ flag=false; j++; continue; } if(cj==='\\'){ flag=true; j++; continue; } if(cj===q){ j++; break; } j++; }
        out += '<span class="tok-str">' + esc(src.slice(i,j)) + '</span>'; i=j; continue;
      }

      const num = /^(?:\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?j?)/.exec(src.slice(i))?.[0];
      if(num){ out += '<span class="tok-num">' + esc(num) + '</span>'; i += num.length; continue; }

      if(ch === '@'){
        const m = /^@[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i));
        if(m){ out += '<span class="tok-dec">' + esc(m[0]) + '</span>'; i += m[0].length; continue; }
      }

      if(/[A-Za-z_]/.test(ch)){
        const id = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i))[0];
        const nextNonSpace = src.slice(i + id.length).match(/^\s*(.)/)?.[1] || '';
        if(KW.has(id)) out += '<span class="tok-kw">' + esc(id) + '</span>';
        else if(BUILTIN.has(id)) out += '<span class="tok-builtin">' + esc(id) + '</span>';
        else if(DEC.has(id)) out += '<span class="tok-dec">' + esc(id) + '</span>';
        else if(nextNonSpace === '(') out += '<span class="tok-fn">' + esc(id) + '</span>';
        else out += esc(id);
        i += id.length; continue;
      }

      out += esc(ch); i++;
    }

    return out;
  }

  function highlightCode(src, lang){
    const t = String(lang || '').toLowerCase().trim();
    if(t.includes('python') || t === 'py' || t.includes('py ')) return highlightPython(src || '');
    return highlightCpp(src || '');
  }

  function renderCodeWithLineNumbers(src, lang){
    const lines = String(src || '').split('\n');
    if(!lines.length) lines.push('');
    return `<span class="code-lines">${lines.map((line, idx)=>`<span class="code-line"><span class="line-no">${idx+1}</span><span class="line-content">${highlightCode(line, lang) || '&nbsp;'}</span></span>`).join('')}</span>`;
  }

  function languageLabel(item){ return item.language || data.defaultLanguage || 'Python'; }

  function fileExtension(item){
    const lang = languageLabel(item).toLowerCase();
    if(lang.includes('python') || lang === 'py') return 'py';
    if(lang.includes('javascript') || lang === 'js') return 'js';
    if(lang.includes('java')) return 'java';
    return 'cpp';
  }

  function ensureToastWrap(){
    let el = document.querySelector('.toast-wrap');
    if(!el){
      el = document.createElement('div');
      el.className = 'toast-wrap';
      el.setAttribute('aria-live','polite');
      document.body.appendChild(el);
    }
    return el;
  }

  function showToast(msg){
    const wrap = ensureToastWrap();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    wrap.appendChild(t);
    requestAnimationFrame(()=> t.classList.add('show'));
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=> t.remove(), 200); }, 1600);
  }

  function pressFeedback(el){
    if(!el) return;
    el.classList.remove('btn-press'); void el.offsetWidth; el.classList.add('btn-press');
    setTimeout(()=> el.classList.remove('btn-press'), 160);
  }

  const state = { q:'', category:'all', sort:'updated_desc' };
  const data = window.CODE_LIBRARY_DATA || window.CPP_CODE_DATA || { defaultLanguage:'Python', categories:[], items:[] };

  function computeCategoryCounts(items){ const counts = {}; for(const item of items){ counts[item.category] = (counts[item.category]||0)+1; } return counts; }
  function idPrefix(catId){ return (catId || 'CAT').toUpperCase(); }
  function isMobile(){ return window.matchMedia('(max-width: 760px)').matches; }

  function syncSidebarState(forceOpen){
    const sidebar = document.getElementById('sidebar');
    const btn = document.getElementById('toggleSidebar');
    const opened = typeof forceOpen === 'boolean' ? forceOpen : sidebar.classList.contains('open');
    sidebar.classList.toggle('open', opened);
    if(btn) btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
  }

  function autoNumber(){
    const byCat = {};
    for(const it of data.items) (byCat[it.category]||(byCat[it.category]=[])).push(it);
    const lookup = new Map();
    for(const [cat, arr] of Object.entries(byCat)){
      arr.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
      arr.forEach((it, idx)=> lookup.set(it._id, idPrefix(cat)+'-'+String(idx+1).padStart(3,'0')));
    }
    return lookup;
  }

  function formatDate(str){
    if(!str) return '';
    try{
      const d = new Date(str);
      if(!isFinite(d)) return str;
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }catch(_){ return str; }
  }

  function matches(item, q){
    if(!q) return true;
    const hay = [ item.title||'', item.description||'', item.language||'', (item.tags||[]).join(' '), item.code||'' ].join(' ').toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function sortItems(items){
    const key = state.sort;
    if(key==='updated_desc') return items.sort((a,b)=> new Date(b.updated||0) - new Date(a.updated||0));
    if(key==='title_asc') return items.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
    if(key==='title_desc') return items.sort((a,b)=> (b.title||'').localeCompare(a.title||''));
    return items;
  }

  function filterByTag(tag){
    const t = tag || '';
    const sb = document.getElementById('searchBox');
    sb.value = t;
    state.q = t;
    update();
    if(isMobile()) syncSidebarState(false);
    showToast('以標籤搜尋：' + t);
  }

  function renderCategories(){
    const list = document.getElementById('categoryList');
    list.innerHTML = '';
    const counts = computeCategoryCounts(data.items);

    const options = [{ id:'all', name:'全部', count:data.items.length }].concat(
      data.categories.map(cat => ({ id:cat.id, name:cat.name, count:counts[cat.id]||0 }))
    );

    for(const option of options){
      const c = document.createElement('div');
      c.className = 'cat-item' + (state.category===option.id ? ' active':'');
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
      c.innerHTML = `<span class="name">${esc(option.name)}</span><span class="count">${option.count}</span>`;
      const activate = ()=>{
        state.category = option.id;
        update();
        if(isMobile()) syncSidebarState(false);
      };
      c.addEventListener('click', activate);
      c.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(); } });
      list.appendChild(c);
    }
  }

  function fallbackCopyText(text){
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', 'readonly');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try{
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    }catch(_){
      document.body.removeChild(ta);
      return false;
    }
  }

  function copyCode(item){
    const text = item.code || '';
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text)
        .then(()=> showToast('已複製到剪貼簿'))
        .catch(()=>{ if(fallbackCopyText(text)) showToast('已複製到剪貼簿'); else showToast('複製失敗，請手動複製'); });
      return;
    }
    if(fallbackCopyText(text)) showToast('已複製到剪貼簿');
    else showToast('複製失敗，請手動複製');
  }

  function inferFilename(item){
    const title = (item.title||'code').replace(/[\\/:*?"<>|]/g,'_').slice(0,60);
    return `${title}.${fileExtension(item)}`;
  }

  function downloadCode(item){
    const blob = new Blob([item.code||''], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const fname = inferFilename(item);
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); showToast('已下載 ' + fname); }, 120);
  }

  function closeModal(){
    const m = document.getElementById('modal');
    m.classList.add('hidden');
    m.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  function openModal(item, code, catObj){
    document.getElementById('modalId').textContent = code;
    document.getElementById('modalTitle').textContent = item.title || '未命名';
    document.getElementById('modalCategory').textContent = catObj ? catObj.name : item.category;
    document.getElementById('modalUpdated').textContent = '更新：' + formatDate(item.updated || '');
    document.getElementById('modalLanguage').textContent = languageLabel(item);
    const mt = document.getElementById('modalTags');
    mt.innerHTML = (item.tags||[]).map(t=>`<span class="chip tag" data-role="tag" data-tag="${esc(t)}">${esc(t)}</span>`).join(' ');
    document.getElementById('modalDesc').textContent = item.description || '';
    document.getElementById('modalCode').innerHTML = renderCodeWithLineNumbers(item.code || '', languageLabel(item));
    document.getElementById('modalPre').scrollTop = 0;
    document.getElementById('modalPre').scrollLeft = 0;

    const modal = document.getElementById('modal');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';

    document.getElementById('btnCopy').onclick = (e)=>{ pressFeedback(e.currentTarget); copyCode(item); };
    document.getElementById('btnDownload').onclick = (e)=>{ pressFeedback(e.currentTarget); downloadCode(item); };

    mt.querySelectorAll('[data-role="tag"]').forEach(tagEl=>{
      tagEl.addEventListener('click', ()=>{
        filterByTag(tagEl.getAttribute('data-tag') || '');
        closeModal();
        pressFeedback(tagEl);
      });
    });
  }

  function render(){
    const q = state.q.trim();
    const filtered = data.items.slice().filter(it => (state.category === 'all' || it.category === state.category) && matches(it, q));
    sortItems(filtered);
    const numbering = autoNumber();
    document.getElementById('resultCount').textContent = String(filtered.length);
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryLanguage = document.getElementById('summaryLanguage');
    if(summaryTotal) summaryTotal.textContent = String(data.items.length);
    if(summaryLanguage) summaryLanguage.textContent = data.defaultLanguage || 'Python';

    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    for(const it of filtered){
      const code = numbering.get(it._id) || 'CAT-000';
      const catObj = data.categories.find(c=>c.id===it.category);
      const card = document.createElement('article');
      card.className = 'card panel';
      card.setAttribute('role','listitem');
      const lang = languageLabel(it);
      const tags = (it.tags||[]).map(t=>`<span class="chip tag" data-role="tag" data-tag="${esc(t)}">${esc(t)}</span>`).join(' ');

      card.innerHTML = `
        <div class="top">
          <div>
            <div class="code-id">${code}</div>
            <h3 class="title">${esc(it.title || '未命名')}</h3>
          </div>
          <div class="card-top-right">
            <span class="chip chip-lang">${esc(lang)}</span>
            <div class="muted">${esc(catObj ? catObj.name : it.category)}</div>
          </div>
        </div>
        <p class="desc">${esc(it.description || '（無說明）')}</p>
        <div class="tags">${tags}</div>
        <div class="meta-row">
          <div class="muted">更新：${esc(formatDate(it.updated))}</div>
          <div class="muted">副檔名：.${fileExtension(it)}</div>
        </div>
        <div class="actions">
          <button class="line-btn" data-role="view">檢視</button>
          <button class="line-btn" data-role="copy" title="複製">複製</button>
          <button class="line-btn" data-role="download" title="下載檔案">下載</button>
        </div>`;

      card.querySelector('[data-role="view"]').addEventListener('click', (e)=>{ pressFeedback(e.currentTarget); openModal(it, code, catObj); });
      card.querySelector('[data-role="copy"]').addEventListener('click', (e)=>{ pressFeedback(e.currentTarget); copyCode(it); });
      card.querySelector('[data-role="download"]').addEventListener('click', (e)=>{ pressFeedback(e.currentTarget); downloadCode(it); });
      card.querySelectorAll('[data-role="tag"]').forEach(tagEl=>{
        tagEl.addEventListener('click', ()=>{ pressFeedback(tagEl); filterByTag(tagEl.getAttribute('data-tag') || ''); });
      });

      grid.appendChild(card);
    }

    if(!filtered.length){
      const empty = document.createElement('article');
      empty.className = 'panel empty-state';
      empty.innerHTML = `
        <div style="display:grid;gap:8px;justify-items:start;">
          <span class="chip chip-lang">No Result</span>
          <h3>找不到符合條件的程式碼</h3>
          <p class="desc">可以調整搜尋關鍵字、切換類別，或按下「重置篩選」恢復全部項目。</p>
        </div>`;
      grid.appendChild(empty);
    }
  }

  function debounce(fn, ms){ let t = null; return function(...args){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), ms); }; }

  function update(){
    render();
    const list = document.getElementById('categoryList');
    Array.from(list.querySelectorAll('.cat-item')).forEach(el=> el.classList.remove('active'));
    const target = Array.from(list.querySelectorAll('.cat-item')).find(el => {
      const name = el.querySelector('.name')?.textContent || '';
      if(state.category === 'all') return name === '全部';
      const cat = data.categories.find(c=> c.id === state.category);
      return cat && name === cat.name;
    });
    if(target) target.classList.add('active');
  }

  data.items.forEach((it, idx)=>{
    it._id = idx + '-' + (it.title || '').slice(0,12);
    if(!it.language) it.language = data.defaultLanguage || 'Python';
  });

  document.getElementById('searchBox').addEventListener('input', debounce(e=>{ state.q = e.target.value; update(); }, 120));
  document.getElementById('clearSearch').addEventListener('click', ()=>{ const sb = document.getElementById('searchBox'); sb.value=''; state.q=''; update(); sb.focus(); });
  document.getElementById('sortSelect').addEventListener('change', e=>{ state.sort = e.target.value; update(); });
  document.getElementById('resetFilters').addEventListener('click', ()=>{
    state.category='all'; state.q=''; state.sort='updated_desc';
    document.getElementById('searchBox').value=''; document.getElementById('sortSelect').value='updated_desc';
    renderCategories(); update();
    if(isMobile()) syncSidebarState(false);
  });
  const toggleSidebarBtn = document.getElementById('toggleSidebar');
  if(toggleSidebarBtn){
    toggleSidebarBtn.addEventListener('click', ()=>{ syncSidebarState(!document.getElementById('sidebar').classList.contains('open')); });
  }
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', (e)=>{ if(e.target.classList.contains('modal-backdrop')) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });
  window.addEventListener('resize', ()=>{ if(!isMobile()) syncSidebarState(false); });

  renderCategories();
  syncSidebarState(false);
  update();
})();

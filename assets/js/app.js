/* Code Library — C++ only, pastel theme */
(function(){
  'use strict';

  const Q = (sel, ctx=document)=>ctx.querySelector(sel);
  const QA = (sel, ctx=document)=>Array.from(ctx.querySelectorAll(sel));

  // ===== Lightweight C++ syntax highlighter (no deps) =====
  function highlightCpp(src){
    const KW = new Set([
      'alignas','alignof','and','and_eq','asm','auto','bitand','bitor','break','case','catch','class',
      'compl','const','consteval','constexpr','constinit','const_cast','continue','co_await','co_return','co_yield',
      'decltype','default','delete','do','dynamic_cast','else','enum','explicit','export','extern','false','final',
      'for','friend','goto','if','inline','mutable','namespace','new','noexcept','not','not_eq','nullptr','operator',
      'or','or_eq','override','private','protected','public','reflexpr','register','reinterpret_cast','requires','return',
      'sizeof','static','static_assert','static_cast','struct','switch','synchronized','template','this','thread_local',
      'throw','true','try','typedef','typeid','typename','union','using','virtual','volatile','while','xor','xor_eq'
    ]);
    const TYPES = new Set([
      'bool','char','char8_t','char16_t','char32_t','wchar_t','short','int','long','signed','unsigned','float','double','void',
      'size_t','ptrdiff_t','nullptr_t','string','u8string','u16string','u32string','vector','map','set','unordered_map','unordered_set','pair','tuple','array','deque','list','stack','queue','priority_queue'
    ]);

    function esc(s){ return s.replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

    let i = 0, out = '', n = src.length;
    function peek(k=0){ return src[i+k] || ''; }

    while(i < n){
      const ch = peek();

      if((i===0 || src[i-1]==='\n') && ch === '#'){
        let j = i; while(j<n && src[j] !== '\n') j++;
        out += '<span class="tok-pp">' + esc(src.slice(i,j)) + '</span>'; i = j; continue;
      }
      if(ch === '/' && peek(1) === '*'){
        let j = i+2; while(j<n && !(src[j]==='*' && src[j+1] === '/')) j++; j = Math.min(n, j+2);
        out += '<span class="tok-comm">' + esc(src.slice(i,j)) + '</span>'; i = j; continue;
      }
      if(ch === '/' && peek(1) === '/'){
        let j = i; while(j<n && src[j] !== '\n') j++;
        out += '<span class="tok-comm">' + esc(src.slice(i,j)) + '</span>'; i = j; continue;
      }
      if(ch === '"'){
        let j = i+1, escFlag=false; while(j<n){ const cj = src[j]; if(escFlag){ escFlag=false; j++; continue; } if(cj==='\\'){ escFlag=true; j++; continue; } if(cj==='"'){ j++; break; } j++; }
        out += '<span class="tok-str">' + esc(src.slice(i,j)) + '</span>'; i = j; continue;
      }
      if(ch === "'"){
        let j = i+1, escFlag=false; while(j<n){ const cj = src[j]; if(escFlag){ escFlag=false; j++; continue; } if(cj==='\\'){ escFlag=true; j++; continue; } if(cj === "'"){ j++; break; } j++; }
        out += '<span class="tok-char">' + esc(src.slice(i,j)) + '</span>'; i = j; continue;
      }
      let num = null; { const m = /^(?:0x[0-9a-fA-F]+|0b[01]+|\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)(?:[uUlLfF]*)/.exec(src.slice(i)); if(m) num = m[0]; }
      if(num){ out += '<span class="tok-num">' + esc(num) + '</span>'; i += num.length; continue; }
      if(/[A-Za-z_]/.test(ch)){
        const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i)); const id = m[0];
        if(KW.has(id)) out += '<span class="tok-kw">' + esc(id) + '</span>';
        else if(TYPES.has(id)) out += '<span class="tok-type">' + esc(id) + '</span>';
        else out += esc(id);
        i += id.length; continue;
      }
      out += esc(ch); i++;
    }
    return out;
  }

  // --- Toast notifications & press feedback ---
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
    setTimeout(()=>{
      t.classList.remove('show');
      setTimeout(()=> t.remove(), 200);
    }, 1600);
  }
  function pressFeedback(el){
    if(!el) return;
    el.classList.remove('btn-press'); void el.offsetWidth; el.classList.add('btn-press');
    setTimeout(()=> el.classList.remove('btn-press'), 160);
  }

  // App state
  const state = { q:'', category:'all', sort:'updated_desc' };
  const data = window.CPP_CODE_DATA || { categories: [], items: [] };

  function computeCategoryCounts(items){
    const counts = {}; for(const item of items){ counts[item.category] = (counts[item.category]||0)+1; } return counts;
  }
  function idPrefix(catId){ return (catId || 'CAT').toUpperCase(); }

  function autoNumber(){
    const byCat = {}; for(const it of data.items){ (byCat[it.category]||(byCat[it.category]=[])).push(it); }
    const lookup = new Map();
    for(const [cat, arr] of Object.entries(byCat)){
      arr.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
      arr.forEach((it, idx)=> lookup.set(it._id, idPrefix(cat)+'-'+String(idx+1).padStart(3,'0')) );
    }
    return lookup;
  }

  function formatDate(str){
    if(!str) return '';
    try{ const d = new Date(str); if(!isFinite(d)) return str;
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }catch(e){ return str }
  }

  function renderCategories(){
    const list = document.getElementById('categoryList'); list.innerHTML = '';
    const allBtn = document.createElement('div');
    allBtn.className = 'cat-item' + (state.category==='all' ? ' active':'');
    allBtn.innerHTML = `<span class="name">全部</span><span class="count">${data.items.length}</span>`;
    allBtn.addEventListener('click', ()=>{ state.category='all'; update(); });
    list.appendChild(allBtn);

    const counts = computeCategoryCounts(data.items);
    for(const cat of data.categories){
      const c = document.createElement('div');
      c.className = 'cat-item' + (state.category===cat.id ? ' active':'');
      c.innerHTML = `<span class="name">${cat.name}</span><span class="count">${counts[cat.id]||0}</span>`;
      c.addEventListener('click', ()=>{ state.category = cat.id; update(); });
      list.appendChild(c);
    }
  }

  function matches(item, q){
    if(!q) return true;
    const hay = [ item.title||'', item.description||'', (item.tags||[]).join(' '), item.code||'' ].join(' ').toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function sortItems(items){
    const key = state.sort;
    if(key==='updated_desc') return items.sort((a,b)=> new Date(b.updated||0) - new Date(a.updated||0));
    if(key==='title_asc') return items.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
    if(key==='title_desc') return items.sort((a,b)=> (b.title||'').localeCompare(a.title||''));
    return items;
  }

  function escapeHTML(s){ return (s||'').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

  function render(){
    const q = state.q.trim();
    const all = data.items.slice();
    const filtered = all.filter(it=> (state.category==='all' || it.category===state.category) && matches(it, q));
    sortItems(filtered);
    const numbering = autoNumber();

    document.getElementById('resultCount').textContent = String(filtered.length);
    const grid = document.getElementById('grid'); grid.innerHTML = '';

    for(const it of filtered){
      const code = numbering.get(it._id) || 'CAT-000';
      const catObj = data.categories.find(c=>c.id===it.category);
      const card = document.createElement('article'); card.className = 'card'; card.setAttribute('role','listitem');

      const tags = (it.tags||[]).map(t=>`<span class="chip tag" data-role="tag" data-tag="${escapeHTML(t)}">${escapeHTML(t)}</span>`).join(' ');

      card.innerHTML = `
        <div class="top">
          <div><div class="code-id">${code}</div><h3 class="title">${escapeHTML(it.title||'未命名')}</h3></div>
          <div class="muted">${escapeHTML(catObj?catObj.name:it.category)}</div>
        </div>
        <p class="desc">${escapeHTML(it.description||'（無說明）')}</p>
        <div class="tags">${tags}</div>
        <div class="muted">更新：${escapeHTML(formatDate(it.updated))}</div>
        <div class="actions">
          <button class="primary" data-role="view">檢視</button>
          <button class="icon" data-role="copy" title="複製">複製</button>
          <button class="icon" data-role="download" title="下載 .cpp">下載</button>
        </div>`;

      card.querySelector('[data-role="view"]').addEventListener('click', (e)=>{ pressFeedback(e.currentTarget); openModal(it, code, catObj); });
      card.querySelector('[data-role="copy"]').addEventListener('click', (e)=>{ pressFeedback(e.currentTarget); copyCode(it); });
      card.querySelector('[data-role="download"]').addEventListener('click', (e)=>{ pressFeedback(e.currentTarget); downloadCode(it); });

      // tag click in card
      card.querySelectorAll('[data-role="tag"]').forEach(tagEl=>{
        tagEl.addEventListener('click', ()=>{
          const t = tagEl.getAttribute('data-tag') || '';
          const sb = document.getElementById('searchBox');
          sb.value = t; state.q = t; update();
          pressFeedback(tagEl);
          showToast('以標籤搜尋：' + t);
        });
      });

      grid.appendChild(card);
    }
  }

  function openModal(item, code, catObj){
    document.getElementById('modalId').textContent = code;
    document.getElementById('modalTitle').textContent = item.title || '未命名';
    document.getElementById('modalCategory').textContent = catObj?catObj.name:item.category;
    document.getElementById('modalUpdated').textContent = '更新：' + formatDate(item.updated||'');
    const tagsHTML = (item.tags||[]).map(t=>`<span class="chip tag" data-role="tag" data-tag="${escapeHTML(t)}">${escapeHTML(t)}</span>`).join(' ');
    const mt = document.getElementById('modalTags'); mt.innerHTML = tagsHTML;
    document.getElementById('modalDesc').textContent = item.description||'';
    const modalCode = document.getElementById('modalCode'); modalCode.innerHTML = highlightCpp(item.code || '');
    const modal = document.getElementById('modal'); modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');

    document.getElementById('btnCopy').onclick = (e)=> { pressFeedback(e.currentTarget); copyCode(item); };
    document.getElementById('btnDownload').onclick = (e)=> { pressFeedback(e.currentTarget); downloadCode(item); };

    // tag click in modal
    mt.querySelectorAll('[data-role="tag"]').forEach(tagEl=>{
      tagEl.addEventListener('click', ()=>{
        const t = tagEl.getAttribute('data-tag') || '';
        const sb = document.getElementById('searchBox');
        sb.value = t; state.q = t; update();
        closeModal();
        pressFeedback(tagEl);
        showToast('以標籤搜尋：' + t);
      });
    });
  }

  function closeModal(){ const m = document.getElementById('modal'); m.classList.add('hidden'); m.setAttribute('aria-hidden','true'); }

  function copyCode(item){
    navigator.clipboard.writeText(item.code||'').then(()=>{ showToast('已複製到剪貼簿'); });
  }
  function inferFilename(item){ const title = (item.title||'code').replace(/[\/:*?"<>|]/g,'_').slice(0,60); return `${title}.cpp`; }
  function downloadCode(item){
    const blob = new Blob([item.code||''], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    const fname = inferFilename(item); a.download = fname; document.body.appendChild(a); a.click();
    setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); showToast('已下載 '+fname); }, 120);
  }

  function debounce(fn, ms){ let t = null; return function(...args){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), ms); } }

  document.getElementById('searchBox').addEventListener('input', debounce(e=>{ state.q = e.target.value; update(); }, 120));
  document.getElementById('clearSearch').addEventListener('click', ()=>{ const sb = document.getElementById('searchBox'); sb.value=''; state.q=''; update(); sb.focus(); });
  document.getElementById('sortSelect').addEventListener('change', e=>{ state.sort = e.target.value; update(); });
  document.getElementById('resetFilters').addEventListener('click', ()=>{ state.category='all'; state.q=''; document.getElementById('searchBox').value=''; document.getElementById('sortSelect').value='updated_desc'; update(); renderCategories(); });
  document.getElementById('toggleSidebar').addEventListener('click', ()=>{ document.getElementById('sidebar').classList.toggle('open'); });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', (e)=>{ if(e.target.classList.contains('modal-backdrop')) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

  function update(){
    render();
    const list = document.getElementById('categoryList');
    Array.from(list.querySelectorAll('.cat-item')).forEach(el=> el.classList.remove('active'));
    const target = Array.from(list.querySelectorAll('.cat-item')).find(el => {
      const name = el.querySelector('.name')?.textContent || '';
      if(state.category==='all') return name==='全部';
      const cat = data.categories.find(c=>c.id===state.category);
      return cat && name===cat.name;
    });
    if(target) target.classList.add('active');
  }

  data.items.forEach((it, idx)=> it._id = idx + '-' + (it.title||'').slice(0,12));
  renderCategories(); update();
})();
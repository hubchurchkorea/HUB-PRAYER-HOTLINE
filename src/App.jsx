import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { supabase } from './lib/supabaseClient'
import { getDeviceId } from './lib/deviceId'

const THEMES = [
  { name: '심야 라인', bg:'#12141C', surface:'#1B1E29', primaryTint:'rgba(255,107,74,0.14)', primary:'#FF6B4A', text:'#F2F0EA', textMuted:'#8B93A7', border:'#2B2F3D' },
  { name: '온기 라인', bg:'#FBF3E7', surface:'#FFFFFF', primaryTint:'rgba(198,65,91,0.10)', primary:'#C6415B', text:'#2B2320', textMuted:'#8A7A6B', border:'#E9DCC9' },
  { name: '은혜 라인', bg:'#F5F1F8', surface:'#FFFFFF', primaryTint:'rgba(108,79,161,0.10)', primary:'#6C4FA1', text:'#2E2438', textMuted:'#8D82A0', border:'#E4DCEC' },
  { name: '새싹 라인', bg:'#F2F7F1', surface:'#FFFFFF', primaryTint:'rgba(63,122,82,0.10)', primary:'#3F7A52', text:'#223326', textMuted:'#7D9482', border:'#DCE8DC' },
]

const deviceId = getDeviceId()

function formatDate(iso) {
  const d = new Date(iso)
  const date = d.getFullYear() + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + String(d.getDate()).padStart(2,'0')
  const time = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0')
  return date + ' ' + time
}

export default function App() {
  const [themeIndex, setThemeIndex] = useState(0)
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPw, setLoginPw] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newText, setNewText] = useState('')
  const [prayers, setPrayers] = useState([])
  const [reactions, setReactions] = useState([])
  const [replies, setReplies] = useState([])
  const [shares, setShares] = useState([])
  const [openReplies, setOpenReplies] = useState({})
  const [replyDrafts, setReplyDrafts] = useState({})
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)
  const exportRef = useRef(null)

  const t = THEMES[themeIndex]

  useEffect(() => {
    document.documentElement.style.setProperty('--bg', t.bg)
    document.documentElement.style.setProperty('--surface', t.surface)
    document.documentElement.style.setProperty('--primary', t.primary)
    document.documentElement.style.setProperty('--primary-tint', t.primaryTint)
    document.documentElement.style.setProperty('--text', t.text)
    document.documentElement.style.setProperty('--text-muted', t.textMuted)
    document.documentElement.style.setProperty('--border', t.border)
  }, [themeIndex])

  async function fetchAll() {
    const [{ data: p }, { data: r }, { data: rp }, { data: s }] = await Promise.all([
      supabase.from('prayers').select('*').order('created_at', { ascending: false }),
      supabase.from('reactions').select('*'),
      supabase.from('replies').select('*').order('created_at', { ascending: true }),
      supabase.from('shares').select('*'),
    ])
    setPrayers(p || [])
    setReactions(r || [])
    setReplies(rp || [])
    setShares(s || [])
  }

  async function checkAdmin(currentSession) {
    if (!currentSession) { setIsAdmin(false); return }
    const { data } = await supabase.from('admins').select('user_id').eq('user_id', currentSession.user.id).maybeSingle()
    setIsAdmin(!!data)
  }

  useEffect(() => {
    fetchAll()
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      checkAdmin(data.session)
    })
    const { data: authSub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      checkAdmin(s)
    })

    const channel = supabase
      .channel('hotline-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prayers' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'replies' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shares' }, fetchAll)
      .subscribe()

    return () => {
      authSub.subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [])

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 1800)
  }

async function signInWithKakao() {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { scopes: 'profile_nickname profile_image' }
    })
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPw })
    if (error) { setLoginError('로그인에 실패했습니다. 이메일/비밀번호를 확인해 주세요.'); return }
    setShowLogin(false)
    setLoginEmail(''); setLoginPw('')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsAdmin(false)
    setShowAddForm(false)
  }

  async function submitAdd() {
    if (!newName.trim() || !newText.trim()) { showToast('이름과 기도제목을 모두 입력해 주세요'); return }
    const { error } = await supabase.from('prayers').insert({ name: newName.trim(), content: newText.trim() })
    if (error) { showToast('등록에 실패했습니다'); return }
    setNewName(''); setNewText(''); setShowAddForm(false)
    showToast('기도제목이 등록되었습니다')
  }

  async function deletePrayer(id) {
    await supabase.from('prayers').delete().eq('id', id)
    showToast('기도제목이 삭제되었습니다')
  }

  async function toggleReaction(prayerId, kind) {
    const existing = reactions.find(r => r.prayer_id === prayerId && r.device_id === deviceId && r.kind === kind)
    if (existing) {
      setReactions(rs => rs.filter(r => r.id !== existing.id))
      await supabase.from('reactions').delete().eq('id', existing.id)
    } else {
      const tempId = 'temp-' + Date.now()
      setReactions(rs => [...rs, { id: tempId, prayer_id: prayerId, device_id: deviceId, kind }])
      await supabase.from('reactions').insert({ prayer_id: prayerId, device_id: deviceId, kind })
      fetchAll()
    }
  }

  async function sendReply(prayerId) {
    const text = (replyDrafts[prayerId] || '').trim()
    if (!text) return
    await supabase.from('replies').insert({ prayer_id: prayerId, content: text })
    setReplyDrafts(d => ({ ...d, [prayerId]: '' }))
    showToast('응원의 메시지가 등록되었습니다')
  }

  async function deleteReply(id) {
    await supabase.from('replies').delete().eq('id', id)
    showToast('답글이 삭제되었습니다')
  }

  async function handleShare(p) {
    await supabase.from('shares').insert({ prayer_id: p.id })
    showToast('기도카드 이미지를 저장합니다')
    exportPrayerImage(p)
  }

  async function exportPrayerImage(p) {
    const el = exportRef.current
    el.innerHTML = `
      <div style="background:${t.surface}; border:1px solid ${t.border}; border-radius:20px; padding:32px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:20px;">
          <div style="width:8px;height:8px;border-radius:50%;background:${t.primary};"></div>
          <div style="font-family:'Black Han Sans',sans-serif; font-size:15px; color:${t.textMuted}; letter-spacing:0.5px;">허브 중보기도 HOTLINE</div>
        </div>
        <div style="font-size:22px; font-weight:700; color:${t.text}; margin-bottom:4px;">${p.name}</div>
        <div style="font-family:'Space Mono',monospace; font-size:12px; color:${t.textMuted}; margin-bottom:18px;">${formatDate(p.created_at)}</div>
        <div style="font-size:15.5px; line-height:1.8; color:${t.text}; margin-bottom:28px;">${p.content}</div>
        <div style="border-top:1px solid ${t.border}; padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:12px; color:${t.textMuted};">함께 기도해 주세요</div>
          <div style="font-family:'Black Han Sans',sans-serif; font-size:13px; color:${t.primary};">허브교회</div>
        </div>
      </div>
    `
    const canvas = await html2canvas(el, { backgroundColor: t.bg, scale: 2 })
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '허브중보기도_' + p.name.replace(/\s/g, '') + '.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    })
  }

  function countFor(prayerId, kind) {
    return reactions.filter(r => r.prayer_id === prayerId && r.kind === kind).length
  }
  function reactedFor(prayerId, kind) {
    return reactions.some(r => r.prayer_id === prayerId && r.device_id === deviceId && r.kind === kind)
  }
  function repliesFor(prayerId) {
    return replies.filter(r => r.prayer_id === prayerId)
  }
  function shareCountFor(prayerId) {
    return shares.filter(s => s.prayer_id === prayerId).length
  }

  return (
    <div id="app">
      <div className="header">
        <div className="header-top">
          <div className="brand-text">
            <div className="line1">허브 중보기도</div>
            <div className="line2">HOTLINE</div>
          </div>
<div className="header-controls">
            <button className="icon-btn" title="새로고침" onClick={() => { fetchAll(); showToast('최신 내용으로 갱신했습니다') }}>
              ⟳
            </button>
            <button className="icon-btn" title={'테마 변경 (' + t.name + ')'} onClick={() => { setThemeIndex((themeIndex+1) % THEMES.length); showToast(THEMES[(themeIndex+1)%THEMES.length].name + ' 적용됨') }}>
              ◐
            </button>
            <button className={'icon-btn' + (isAdmin ? ' active' : '')} title="관리자 모드" onClick={() => { isAdmin ? handleLogout() : setShowLogin(true) }}>
              🛡
            </button>
          </div>
        </div>
        <div className="tagline">누구든, 어디서든 — 하나님과 다이렉트로 연결되는 중보의 자리</div>
        <div className="live-row"><div className="live-dot"></div><div className="live-text">지금 이 순간에도 연결되어 있습니다</div></div>
        <div className="kakao-row">
          {session && !isAdmin ? (
            <button className="kakao-btn logged-in" onClick={handleLogout}>
              카카오 로그인됨 · 로그아웃
            </button>
          ) : !session ? (
            <button className="kakao-btn" onClick={signInWithKakao}>
              카카오로 로그인
            </button>
          ) : null}
        </div>
      </div>

      {isAdmin && (
        <div className="add-bar">
          {!showAddForm ? (
            <button className="add-toggle-btn" onClick={() => setShowAddForm(true)}>+ 새 중보기도 제목 등록</button>
          ) : (
            <div className="add-form">
              <label>환우 이름 (예: 김OO 집사님)</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="이름을 입력하세요" />
              <label>기도 제목</label>
              <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="기도 제목을 입력하세요" />
              <div className="add-form-actions">
                <button className="btn-ghost" onClick={() => setShowAddForm(false)}>취소</button>
                <button className="btn-primary" onClick={submitAdd}>등록하기</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="feed">
        <div className="cable"></div>
        {prayers.map(p => (
          <div className="card-wrap" key={p.id}>
            <div className="jack"></div>
            <div className="card">
              <div className="card-top">
                <div className="card-name">{p.name}</div>
                <div className="card-date">{formatDate(p.created_at)}</div>
              </div>
              <div className="card-text">{p.content}</div>
              <div className="reaction-row">
                {['heart','pray','like'].map(kind => (
                  <button key={kind} className={'reaction-btn' + (reactedFor(p.id, kind) ? ' active' : '')} onClick={() => toggleReaction(p.id, kind)}>
                    <span className="emoji">{kind === 'heart' ? '❤️' : kind === 'pray' ? '🙏' : '👍'}</span>
                    <span>{countFor(p.id, kind)}</span>
                  </button>
                ))}
              </div>
              <div className="util-row">
                <button className="reply-toggle" onClick={() => setOpenReplies(o => ({ ...o, [p.id]: !o[p.id] }))}>
                  💬 답글 {repliesFor(p.id).length}개
                </button>
                <div style={{ display: 'flex', gap: 12 }}>
                  {isAdmin && <button className="delete-prayer-btn" onClick={() => deletePrayer(p.id)}>삭제</button>}
                  <button className="share-btn" onClick={() => handleShare(p)}>↗ 공유 {shareCountFor(p.id)}</button>
                </div>
              </div>
              {openReplies[p.id] && (
                <div className="replies-panel">
                  {repliesFor(p.id).map(r => (
                    <div className="reply-item" key={r.id}>
                      <div className="reply-avatar"></div>
                      <div className="reply-body">{r.content}</div>
                      {isAdmin && <button className="reply-delete" onClick={() => deleteReply(r.id)}>삭제</button>}
                    </div>
                  ))}
                  <div className="reply-input-row">
                    <input
                      value={replyDrafts[p.id] || ''}
                      onChange={e => setReplyDrafts(d => ({ ...d, [p.id]: e.target.value }))}
                      placeholder="함께 기도한다는 응원의 한마디..."
                    />
                    <button className="reply-send" onClick={() => sendReply(p.id)}>➤</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={'toast' + (toast ? ' show' : '')}>{toast}</div>

      <div ref={exportRef} style={{ position: 'absolute', left: -9999, top: 0, width: 420 }}></div>

      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}>
          <form className="login-box" onClick={e => e.stopPropagation()} onSubmit={handleLogin}>
            <h3>관리자 로그인</h3>
            {loginError && <div className="login-error">{loginError}</div>}
            <input type="email" placeholder="이메일" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
            <input type="password" placeholder="비밀번호" value={loginPw} onChange={e => setLoginPw(e.target.value)} required />
            <div className="add-form-actions">
              <button type="button" className="btn-ghost" onClick={() => setShowLogin(false)}>취소</button>
              <button type="submit" className="btn-primary">로그인</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

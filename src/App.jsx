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

const PRAYER_VERSES = [
  { text: '아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라', ref: '빌립보서 4:6' },
  { text: '그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라', ref: '빌립보서 4:7' },
  { text: '구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요 문을 두드리라 그리하면 너희에게 열릴 것이니', ref: '마태복음 7:7' },
  { text: '구하라 그러면 너희에게 주실 것이요 찾으라 그러면 찾아낼 것이요 문을 두드리라 그러면 너희에게 열릴 것이니', ref: '누가복음 11:9' },
  { text: '의인의 간구는 역사하는 힘이 큼이니라', ref: '야고보서 5:16' },
  { text: '너희 중에 누구든지 지혜가 부족하거든 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라', ref: '야고보서 1:5' },
  { text: '너희 중에 누가 고난을 당하느냐 그는 기도할 것이요 즐거워하는 자가 있느냐 그는 찬송할지니라', ref: '야고보서 5:13' },
  { text: '쉬지 말고 기도하라', ref: '데살로니가전서 5:17' },
  { text: '기도를 계속하고 기도에 감사함으로 깨어 있으라', ref: '골로새서 4:2' },
  { text: '너희가 기도할 때에 무엇이든지 믿고 구하는 것은 다 받으리라 하시니라', ref: '마가복음 11:24' },
  { text: '여호와께서는 자기에게 간구하는 모든 자 곧 진실하게 간구하는 모든 자에게 가까이 하시는도다', ref: '시편 145:18' },
  { text: '의인이 부르짖으매 여호와께서 들으시고 그들의 모든 환난에서 건지셨도다', ref: '시편 34:17' },
  { text: '저녁과 아침과 정오에 내가 근심하여 탄식하리니 여호와께서 내 소리를 들으시리로다', ref: '시편 55:17' },
  { text: '그가 내게 간구하리니 내가 그에게 응답하리라 그가 환난 당할 때에 내가 그와 함께 하리라', ref: '시편 91:15' },
  { text: '그의 뜻대로 무엇을 구하면 들으심이라 우리가 무엇이든지 구하는 바를 들으시는 줄을 안즉 우리가 그에게 구한 그것을 얻은 줄을 또한 아느니라', ref: '요한일서 5:14-15' },
  { text: '너는 기도할 때에 네 골방에 들어가 문을 닫고 은밀한 중에 계신 네 아버지께 기도하라', ref: '마태복음 6:6' },
  { text: '너희가 내 이름으로 무엇을 구하든지 내가 행하리니 이는 아버지로 하여금 아들로 말미암아 영광을 받으시게 하려 함이라', ref: '요한복음 14:13' },
  { text: '그러므로 우리는 긍휼하심을 받고 때를 따라 돕는 은혜를 얻기 위하여 은혜의 보좌 앞에 담대히 나아갈 것이니라', ref: '히브리서 4:16' },
  { text: '모든 기도와 간구를 하되 항상 성령 안에서 기도하고 이를 위하여 깨어 늘 힘쓰며 여러 성도를 위하여 구하라', ref: '에베소서 6:18' },
  { text: '내 백성이 스스로 낮추고 기도하여 내 얼굴을 찾으면 내가 하늘에서 듣고 그들의 죄를 사하고 그들의 땅을 고칠지라', ref: '역대하 7:14' },
  { text: '너는 내게 부르짖으라 내가 네게 응답하겠고 네가 알지 못하는 크고 은밀한 일을 네게 보이리라', ref: '예레미야 33:3' },
  { text: '성령도 우리의 연약함을 도우시나니 우리는 마땅히 빌 바를 알지 못하나 오직 성령이 말할 수 없는 탄식으로 우리를 위하여 친히 간구하시느니라', ref: '로마서 8:26' },
  { text: '예수께서 그들에게 항상 기도하고 낙심하지 말아야 할 것을 비유로 말씀하시니라', ref: '누가복음 18:1' },
  { text: '유혹에 빠지지 않게 기도하라 하시고', ref: '누가복음 22:40' },
]

function pickDailyVerse(dateStr) {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) hash = (hash * 31 + dateStr.charCodeAt(i)) % 100000
  return PRAYER_VERSES[hash % PRAYER_VERSES.length]
}

const deviceId = getDeviceId()

function formatDate(iso) {
  const d = new Date(iso)
  return d.getFullYear() + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + String(d.getDate()).padStart(2,'0')
}

function formatDateTime(iso) {
  const d = new Date(iso)
  const date = d.getFullYear() + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + String(d.getDate()).padStart(2,'0')
  const time = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0')
  return date + ' ' + time
}

function todayKST() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
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
  const [todayVisitors, setTodayVisitors] = useState(0)
  const [profile, setProfile] = useState(null)
  const [showIntakeForm, setShowIntakeForm] = useState(false)
  const [intakeName, setIntakeName] = useState('')
  const [intakeCell, setIntakeCell] = useState('')
  const [pendingProfiles, setPendingProfiles] = useState([])
  const [showApprovalPanel, setShowApprovalPanel] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editText, setEditText] = useState('')
  const [showEditHistory, setShowEditHistory] = useState(false)
  const [editHistory, setEditHistory] = useState([])
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
    if (!currentSession) { setIsAdmin(false); setAdminName(''); setIsSuperAdmin(false); return }
    const { data } = await supabase.from('admins').select('user_id, name, is_super').eq('user_id', currentSession.user.id).maybeSingle()
    setIsAdmin(!!data)
    setAdminName(data?.name || '관리자')
    setIsSuperAdmin(!!data?.is_super)
  }

  async function fetchProfile(currentSession) {
    if (!currentSession) { setProfile(null); return }
    const { data } = await supabase.from('profiles').select('*').eq('user_id', currentSession.user.id).maybeSingle()
    if (data) {
      setProfile(data)
      setShowIntakeForm(false)
    } else {
      setProfile(null)
      setShowIntakeForm(true)
    }
  }

  async function submitIntake() {
    if (!intakeName.trim() || !intakeCell.trim()) { showToast('이름과 소속(순/구역)을 모두 입력해 주세요'); return }
    const nickname = session?.user?.user_metadata?.name || session?.user?.user_metadata?.full_name || ''
    const { data, error } = await supabase.from('profiles').insert({
      user_id: session.user.id,
      nickname,
      display_name: intakeName.trim(),
      cell_group: intakeCell.trim(),
      status: 'pending',
    }).select().maybeSingle()
    if (error) { showToast('제출에 실패했습니다'); return }
    setProfile(data)
    setShowIntakeForm(false)
    showToast('제출되었습니다. 관리자 승인까지 최대 하루 정도 걸릴 수 있어요')
  }

  async function fetchPendingProfiles() {
    const { data } = await supabase.from('profiles').select('*').eq('status', 'pending').order('created_at', { ascending: true })
    setPendingProfiles(data || [])
  }

  async function approveProfile(userId) {
    await supabase.from('profiles').update({ status: 'approved' }).eq('user_id', userId)
    showToast('승인되었습니다')
    fetchPendingProfiles()
    supabase.functions.invoke('send-kakao-notification', { body: { user_id: userId } })
    supabase.functions.invoke('send-approval-email', { body: { user_id: userId } })
  }

  async function rejectProfile(userId) {
    await supabase.from('profiles').update({ status: 'rejected' }).eq('user_id', userId)
    showToast('거절 처리되었습니다')
    fetchPendingProfiles()
  }

  async function recordVisitAndCount(currentSession) {
    const today = todayKST()
    const nickname = currentSession?.user?.user_metadata?.name || currentSession?.user?.user_metadata?.full_name || null
    await supabase.from('visits').upsert(
      { device_id: deviceId, visit_date: today, user_id: currentSession?.user?.id || null, nickname },
      { onConflict: 'device_id,visit_date' }
    )
    const { count } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .eq('visit_date', today)
    setTodayVisitors(count || 0)
  }
  useEffect(() => {
    fetchAll()
    recordVisitAndCount(null)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      checkAdmin(data.session)
      fetchProfile(data.session)
      if (data.session) recordVisitAndCount(data.session)
    })
    const { data: authSub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s)
      checkAdmin(s)
      fetchProfile(s)
      if (event === 'SIGNED_IN') recordVisitAndCount(s)
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

  useEffect(() => {
    if (isAdmin) fetchPendingProfiles()
  }, [isAdmin])

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 1800)
  }

  async function signInWithKakao() {
    await supabase.auth.signInWithOAuth({ provider: 'kakao' })
  }

  function requestTalkConsent() {
    if (!session) return
    const restApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY
    const redirectUri = encodeURIComponent('https://hmmkthsltmriyrbnaotq.supabase.co/functions/v1/kakao-talk-consent-callback')
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code&scope=talk_message&state=${session.user.id}`
    window.location.href = url
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const result = params.get('talk_consent')
    if (result === 'success') showToast('카톡 알림 동의가 완료되었습니다')
    if (result === 'fail') showToast('카톡 알림 동의에 실패했습니다')
    if (result) {
      params.delete('talk_consent')
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '')
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

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
    const { error } = await supabase.from('prayers').insert({
      name: newName.trim(),
      content: newText.trim(),
      created_by: session?.user?.id,
      created_by_name: adminName,
    })
    if (error) { showToast('등록에 실패했습니다'); return }
    setNewName(''); setNewText(''); setShowAddForm(false)
    showToast('기도제목이 등록되었습니다')
    fetchAll()
  }

  async function deletePrayer(id) {
    await supabase.from('prayers').delete().eq('id', id)
    showToast('기도제목이 삭제되었습니다')
    fetchAll()
  }
function openEdit(p) {
    setEditingId(p.id)
    setEditName(p.name)
    setEditText(p.content)
  }

  async function submitEdit() {
    if (!editName.trim() || !editText.trim()) { showToast('이름과 기도제목을 모두 입력해 주세요'); return }
    const target = prayers.find(pr => pr.id === editingId)
    if (!target) return
    await supabase.from('prayer_edit_history').insert({
      prayer_id: editingId,
      edited_by: session?.user?.id,
      edited_by_name: adminName,
      old_name: target.name,
      old_content: target.content,
      new_name: editName.trim(),
      new_content: editText.trim(),
    })
    await supabase.from('prayers').update({
      name: editName.trim(),
      content: editText.trim(),
      updated_at: new Date().toISOString(),
      edited_by: session?.user?.id,
      edited_by_name: adminName,
    }).eq('id', editingId)
    setEditingId(null)
    showToast('수정되었습니다')
    fetchAll()
  }

  async function fetchEditHistory() {
    const { data } = await supabase.from('prayer_edit_history').select('*').order('edited_at', { ascending: false }).limit(50)
    setEditHistory(data || [])
  }
  
  function canParticipate() {
    if (!session) { showToast('카카오 로그인 후 이용할 수 있습니다'); return false }
    if (!profile || profile.status === 'pending') { showToast('관리자 승인을 기다리고 있습니다'); return false }
    if (profile.status === 'rejected') { showToast('이용이 제한된 계정입니다'); return false }
    return true
  }

  async function toggleReaction(prayerId, kind) {
    if (!canParticipate()) return
    const myId = session.user.id
    const existing = reactions.find(r => r.prayer_id === prayerId && r.user_id === myId && r.kind === kind)
    if (existing) {
      setReactions(rs => rs.filter(r => r.id !== existing.id))
      await supabase.from('reactions').delete().eq('id', existing.id)
    } else {
      const tempId = 'temp-' + Date.now()
      setReactions(rs => [...rs, { id: tempId, prayer_id: prayerId, device_id: deviceId, user_id: myId, kind }])
      await supabase.from('reactions').insert({ prayer_id: prayerId, device_id: deviceId, user_id: myId, kind })
      fetchAll()
    }
  }

  async function sendReply(prayerId) {
    if (!canParticipate()) return
    const text = (replyDrafts[prayerId] || '').trim()
    if (!text) return
    const tempId = 'temp-' + Date.now()
    setReplies(rs => [...rs, { id: tempId, prayer_id: prayerId, content: text }])
    setReplyDrafts(d => ({ ...d, [prayerId]: '' }))
    showToast('응원의 메시지가 등록되었습니다')
    await supabase.from('replies').insert({ prayer_id: prayerId, content: text, user_id: session.user.id })
    fetchAll()
  }

  async function deleteReply(id) {
    await supabase.from('replies').delete().eq('id', id)
    showToast('답글이 삭제되었습니다')
    fetchAll()
  }

  async function handleShare(p) {
    await supabase.from('shares').insert({ prayer_id: p.id })
    showToast('기도카드 이미지를 저장합니다')
    exportPrayerImage(p)
    fetchAll()
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
    if (!session) return false
    return reactions.some(r => r.prayer_id === prayerId && r.user_id === session.user.id && r.kind === kind)
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
        <div className="live-row"><div className="live-dot"></div><div className="live-text">오늘 {todayVisitors}명이 함께 중보하고 있습니다</div></div>
        <div className="verse-row">
          <div className="verse-text">"{pickDailyVerse(todayKST()).text}"</div>
          <div className="verse-ref">{pickDailyVerse(todayKST()).ref}</div>
        </div>
        <div className="kakao-row">
          {session && !isAdmin ? (
            <>
              <button className="kakao-btn logged-in" onClick={handleLogout}>
                카카오 로그인됨 · 로그아웃
              </button>
              <button className="kakao-btn-secondary" onClick={requestTalkConsent}>
                🔔 카톡으로 승인 알림 받기
              </button>
              {profile?.status === 'pending' && (
                <div className="status-badge pending">관리자 승인까지 최대 하루 정도 걸릴 수 있어요. 조금만 기다려 주세요 🙏</div>
              )}
              {profile?.status === 'rejected' && (
                <div className="status-badge rejected">이용이 제한된 계정입니다</div>
              )}
            </>
          ) : !session ? (
            <button className="kakao-btn" onClick={signInWithKakao}>
              카카오로 로그인
            </button>
          ) : null}
        </div>
      </div>

      {isAdmin && (
        <div className="add-bar">
          <button className="approval-toggle-btn" onClick={() => setShowApprovalPanel(v => !v)}>
            승인 대기 ({pendingProfiles.length})
          </button>
          {showApprovalPanel && (
            <div className="approval-panel">
              {pendingProfiles.length === 0 ? (
                <div className="approval-empty">대기 중인 성도가 없습니다</div>
              ) : (
                pendingProfiles.map(p => (
                  <div className="approval-item" key={p.user_id}>
                    <div className="approval-info">
                      <div className="approval-name">{p.display_name} <span className="approval-cell">· {p.cell_group}</span></div>
                      <div className="approval-meta">카카오 닉네임: {p.nickname || '-'} · {formatDate(p.created_at)}</div>
                    </div>
                    <div className="approval-actions">
                      <button className="btn-ghost" onClick={() => rejectProfile(p.user_id)}>거절</button>
                      <button className="btn-primary" onClick={() => approveProfile(p.user_id)}>승인</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
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
        {(isAdmin || profile?.status === 'approved') ? prayers.map(p => (
          <div className="card-wrap" key={p.id}>
            <div className="jack"></div>
            <div className="card">
              <div className="card-top">
                <div className="card-name">{p.name}</div>
                <div className="card-date">{formatDate(p.created_at)}</div>
              </div>
              {isAdmin && p.created_by_name && (
                <div className="posted-by">등록: {p.created_by_name}</div>
              )}
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
        )) : (
          <div className="gate-message">
            {!session
              ? '카카오 로그인 후, 관리자 승인을 받으면 기도제목을 볼 수 있습니다.'
              : profile?.status === 'rejected'
                ? '이용이 제한된 계정입니다.'
                : '관리자 승인까지 최대 하루 정도 걸릴 수 있어요. 승인되면 기도제목이 이 자리에 표시됩니다.'}
          </div>
        )}
      </div>

      <div className={'toast' + (toast ? ' show' : '')}>{toast}</div>

      <div ref={exportRef} style={{ position: 'absolute', left: -9999, top: 0, width: 420 }}></div>

      {showIntakeForm && session && !isAdmin && (
        <div className="login-overlay">
          <div className="login-box">
            <h3>승인 요청을 위해 알려주세요</h3>
            <div className="intake-desc">관리자가 성도 여부를 확인할 수 있도록, 성함과 소속(순/구역)을 입력해 주세요.</div>
            <input type="text" placeholder="이름 (예: 김OO)" value={intakeName} onChange={e => setIntakeName(e.target.value)} required />
            <input type="text" placeholder="소속 순/구역 (예: 3순)" value={intakeCell} onChange={e => setIntakeCell(e.target.value)} required />
            <div className="add-form-actions">
              <button type="button" className="btn-ghost" onClick={handleLogout}>취소</button>
              <button type="button" className="btn-primary" onClick={submitIntake}>제출하기</button>
            </div>
          </div>
        </div>
      )}

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

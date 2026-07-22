* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Noto Sans KR', sans-serif;
  background: var(--bg);
  color: var(--text);
  transition: background 0.5s ease, color 0.5s ease;
}
#app { max-width: 460px; margin: 0 auto; min-height: 100vh; position: relative; }

.header {
  padding: 28px 20px 20px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 10;
}
.header-top { display: flex; justify-content: space-between; align-items: flex-start; }
.brand-text .line1 {
  font-family: 'Black Han Sans', sans-serif; font-weight: 400; font-size: 34px;
  color: var(--text-muted); letter-spacing: 0px;
}
.brand-text .line2 {
  font-family: 'Black Han Sans', sans-serif; font-weight: 400; font-size: 26px;
  color: var(--primary); letter-spacing: 1px; line-height: 1.1;
}
.header-controls { display: flex; gap: 8px; }
.icon-btn {
  width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border);
  background: var(--surface); display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-muted); transition: all 0.2s;
}
.icon-btn:hover { border-color: var(--primary); color: var(--primary); }
.icon-btn.active { background: var(--primary); color: var(--surface); border-color: var(--primary); }
.tagline { font-size: 12.5px; color: var(--text-muted); margin-top: 10px; line-height: 1.5; }
.live-row { display: flex; align-items: center; gap: 6px; margin-top: 12px; }
.live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--primary);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.4); }
}
.live-text { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 0.5px; }

.kakao-row { margin-top: 12px; }
.kakao-btn {
  border: none; border-radius: 8px; padding: 10px 14px; font-size: 13px; font-weight: 700;
  cursor: pointer; background: #FEE500; color: #391B1B; width: 100%;
}
.kakao-btn.logged-in { background: transparent; border: 1px solid var(--border); color: var(--text-muted); font-weight: 500; }

.add-bar { padding: 14px 20px 0; }
.add-toggle-btn {
  width: 100%; padding: 12px; border-radius: 10px; border: 1.5px dashed var(--primary);
  background: transparent; color: var(--primary); font-weight: 700; font-size: 13.5px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
}
.add-form {
  margin-top: 10px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 16px;
}
.add-form label { font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px; font-weight: 500; }
.add-form input, .add-form textarea {
  width: 100%; border: 1px solid var(--border); border-radius: 8px; padding: 9px 11px;
  font-family: inherit; font-size: 13.5px; background: var(--bg); color: var(--text);
  margin-bottom: 12px; resize: vertical;
}
.add-form textarea { min-height: 64px; }
.add-form-actions { display: flex; gap: 8px; }
.btn-primary, .btn-ghost {
  flex: 1; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; border: none;
}
.btn-primary { background: var(--primary); color: var(--surface); }
.btn-ghost { background: transparent; color: var(--text-muted); border: 1px solid var(--border); }

.feed { position: relative; padding: 20px 20px 60px 34px; }
.cable {
  position: absolute; left: 20px; top: 20px; bottom: 60px; width: 2px;
  background: var(--border); border-radius: 2px;
}
.card-wrap { position: relative; margin-bottom: 18px; }
.jack {
  position: absolute; left: -22px; top: 22px; width: 10px; height: 10px; border-radius: 50%;
  background: var(--primary); border: 2px solid var(--surface); box-shadow: 0 0 0 2px var(--border);
}
.card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px 18px;
}
.card-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; gap: 8px; }
.card-name { font-weight: 700; font-size: 14.5px; }
.card-date { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--text-muted); white-space: nowrap; }
.card-text { font-size: 14px; line-height: 1.65; color: var(--text); margin-bottom: 14px; }

.reaction-row { display: flex; gap: 6px; margin-bottom: 6px; flex-wrap: wrap; }
.reaction-btn {
  display: flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 20px;
  border: 1px solid var(--border); background: var(--bg); cursor: pointer; font-size: 12.5px;
  color: var(--text-muted); transition: all 0.15s;
}
.reaction-btn.active { background: var(--primary-tint); border-color: var(--primary); color: var(--primary); font-weight: 700; }
.reaction-btn span.emoji { font-size: 14px; }

.util-row { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
.reply-toggle, .share-btn, .delete-prayer-btn {
  display: flex; align-items: center; gap: 5px; background: none; border: none; cursor: pointer;
  font-size: 12.5px; color: var(--text-muted); font-weight: 500;
}
.reply-toggle:hover, .share-btn:hover { color: var(--primary); }
.delete-prayer-btn { color: var(--primary); }

.replies-panel { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border); }
.reply-item { display: flex; gap: 8px; margin-bottom: 10px; align-items: flex-start; }
.reply-avatar {
  width: 24px; height: 24px; border-radius: 50%; background: var(--primary-tint);
  flex-shrink: 0; position: relative;
}
.reply-avatar::after {
  content: ''; position: absolute; top: 50%; left: 50%; width: 6px; height: 6px;
  border-radius: 50%; background: var(--primary); transform: translate(-50%, -50%);
}
.reply-body { font-size: 12.5px; flex: 1; }
.reply-delete {
  background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 11px;
  flex-shrink: 0; padding: 2px 6px; opacity: 0.7;
}
.reply-delete:hover { color: var(--primary); opacity: 1; }
.reply-input-row { display: flex; gap: 6px; margin-top: 8px; }
.reply-input-row input {
  flex: 1; border: 1px solid var(--border); border-radius: 20px; padding: 8px 14px;
  font-size: 12.5px; background: var(--bg); color: var(--text); font-family: inherit;
}
.reply-send { border: none; background: var(--primary); color: var(--surface); border-radius: 50%;
  width: 32px; height: 32px; flex-shrink: 0; cursor: pointer; font-size: 14px; }

.toast {
  position: sticky; bottom: 16px; left: 0; margin: 0 auto; width: fit-content;
  background: var(--text); color: var(--surface); padding: 9px 18px; border-radius: 20px;
  font-size: 12.5px; opacity: 0; transition: opacity 0.3s; pointer-events: none; z-index: 20;
}
.toast.show { opacity: 1; }

.login-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex;
  align-items: center; justify-content: center; z-index: 50; padding: 20px;
}
.login-box {
  background: var(--surface); border-radius: 14px; padding: 24px; width: 100%; max-width: 320px;
}
.login-box h3 { font-size: 15px; margin-bottom: 14px; }
.login-box input {
  width: 100%; border: 1px solid var(--border); border-radius: 8px; padding: 9px 11px;
  font-size: 13.5px; margin-bottom: 10px; background: var(--bg); color: var(--text);
}
.login-error { color: var(--primary); font-size: 12px; margin-bottom: 10px; }

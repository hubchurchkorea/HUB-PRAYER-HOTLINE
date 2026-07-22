# 허브 중보기도 HOTLINE — 배포 가이드

## 1. Supabase 프로젝트 만들기
1. https://supabase.com 에서 새 프로젝트 생성 (무료 플랜으로 충분합니다)
2. 왼쪽 메뉴 **SQL Editor** 에서 `supabase/schema.sql` 파일 내용을 그대로 붙여넣고 실행
3. 왼쪽 메뉴 **Database > Replication** 에서 `prayers`, `reactions`, `replies`, `shares` 테이블의
   Realtime 토글을 켭니다 (이게 켜져야 다른 사람이 반응/답글 남기면 모두의 화면이 실시간으로 갱신됩니다)
4. 왼쪽 메뉴 **Authentication > Users** 에서 목사님 본인 계정을 이메일/비밀번호로 추가
5. 다시 **SQL Editor** 에서 아래 쿼리를 실행해 방금 만든 계정을 관리자로 등록
   (이메일 주소만 본인 것으로 바꿔주세요)

   ```sql
   insert into admins (user_id)
   select id from auth.users where email = '본인이메일@example.com';
   ```

6. 왼쪽 메뉴 **Project Settings > API** 에서 `Project URL`과 `anon public` 키를 복사해둡니다
   (아래 3번 단계에서 씁니다)

## 2. GitHub에 코드 올리기
1. GitHub에서 새 저장소 생성 (예: hub-hotline)
2. 지금 받으신 파일 전체를 그 저장소에 올립니다 (git push, 또는 GitHub 웹에서 업로드)

## 3. Vercel 배포
1. https://vercel.com 에서 방금 만든 GitHub 저장소를 Import
2. **Environment Variables** 항목에 아래 두 개를 추가
   - `VITE_SUPABASE_URL` → 1-6에서 복사한 Project URL
   - `VITE_SUPABASE_ANON_KEY` → 1-6에서 복사한 anon public 키
3. Deploy 클릭 → 몇 분 뒤 `https://hub-hotline.vercel.app` 같은 주소가 생깁니다
4. 이후로는 GitHub에 코드를 push할 때마다 Vercel이 자동으로 재배포합니다

## 4. 로컬에서 미리 확인하고 싶다면
```
npm install
cp .env.example .env
# .env 파일에 실제 Supabase 값 입력
npm run dev
```

## 참고
- 관리자 로그인은 헤더 우측 방패 아이콘 → 1-4에서 등록한 이메일/비밀번호로 로그인
- 반응(❤️🙏👍)은 로그인 없이 누구나 가능하며, 브라우저별 익명 토큰으로 중복 반응만 방지합니다
- 답글은 완전 익명으로 저장되며, 작성자 정보를 서버에도 남기지 않습니다.
  다만 오남용이 심할 경우를 대비해 필요하다면 Supabase 대시보드에서
  `replies` 테이블에 작성자 IP 등 최소 정보를 추가로 남기는 방식도 고려해볼 수 있습니다.

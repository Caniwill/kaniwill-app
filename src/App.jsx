import { useState, useEffect, useRef } from "react";

// ── DATA ─────────────────────────────────────────────────────────
const INIT_STUDENTS = [
  {id:1,name:'김민준',grade:'고2',code:'KMJ001',pw:'1234',classes:[1,4],photo:null},
  {id:2,name:'이서연',grade:'고1',code:'LSY002',pw:'1234',classes:[2],photo:null},
  {id:3,name:'박지호',grade:'중3',code:'PJH003',pw:'1234',classes:[3,5],photo:null},
  {id:4,name:'최유나',grade:'고2',code:'CYN004',pw:'1234',classes:[1],photo:null},
  {id:5,name:'정현우',grade:'고1',code:'JHW005',pw:'1234',classes:[2,6],photo:null},
];
const CLASSES = [
  {id:1,name:'고2 수학반',subject:'수학',days:'월/수',time:'19:00–21:00'},
  {id:2,name:'고1 수학반',subject:'수학',days:'화/목',time:'18:00–20:00'},
  {id:3,name:'중3 수학반',subject:'수학',days:'월/수',time:'16:00–18:00'},
  {id:4,name:'고2 국어반',subject:'국어',days:'화/목',time:'19:00–21:00'},
  {id:5,name:'중3 국어반',subject:'국어',days:'화/목',time:'16:00–18:00'},
  {id:6,name:'고1 국어반',subject:'국어',days:'월/수',time:'18:00–20:00'},
];
const CS = {1:[1,4],2:[2,5],3:[3],4:[1],5:[3],6:[5]};

const INIT_ATT = {
  1:[{d:'05/19(월)',v:{1:'출석',4:'결석'}},{d:'05/21(수)',v:{1:'출석',4:'출석'}},{d:'05/26(월)',v:{1:'출석',4:'출석'}}],
  2:[{d:'05/20(화)',v:{2:'출석',5:'출석'}},{d:'05/22(목)',v:{2:'결석',5:'출석'}},{d:'05/27(화)',v:{2:'출석',5:'지각'}}],
  3:[{d:'05/19(월)',v:{3:'출석'}},{d:'05/21(수)',v:{3:'출석'}}],
  4:[{d:'05/20(화)',v:{1:'출석'}},{d:'05/22(목)',v:{1:'지각'}},{d:'05/27(화)',v:{1:'출석'}}],
  5:[{d:'05/20(화)',v:{3:'출석'}},{d:'05/22(목)',v:{3:'출석'}}],
  6:[{d:'05/19(월)',v:{5:'출석'}},{d:'05/21(수)',v:{5:'출석'}}],
};

const INIT_HW = [
  {id:1,cid:1,title:'수1 미분 연습문제 p.45-48',assigned:'05/26',due:'05/28',desc:'p.45~48 전체 풀기. 풀이 과정 포함.',done:{1:true,4:false},fb:{1:'꼼꼼하게 잘 풀었어요!',4:''}},
  {id:2,cid:2,title:'수학 개념 정리 2단원',assigned:'05/25',due:'05/27',desc:'교재 2단원 개념 정리 노트 작성.',done:{2:true,5:true},fb:{2:'완벽합니다',5:'확인완료'}},
  {id:3,cid:4,title:'비문학 지문 분석 3편',assigned:'05/26',due:'05/29',desc:'제공된 비문학 지문 3편 분석. 핵심어 표시 필수.',done:{1:false},fb:{1:''}},
  {id:4,cid:1,title:'적분 기본문제 풀기',assigned:'05/28',due:'06/02',desc:'적분 기본 30문제.',done:{1:false,4:false},fb:{1:'',4:''}},
  {id:5,cid:6,title:'현대시 감상 5편 분석',assigned:'05/26',due:'05/28',desc:'현대시 5편 주제, 표현기법, 화자 분석.',done:{5:false},fb:{5:''}},
];

const INIT_CLINIC = [
  {id:1,sid:1,day:'월요일',time:'15:00',topic:'미분 개념 질문'},
  {id:2,sid:3,day:'수요일',time:'15:30',topic:'이차방정식 풀이'},
  {id:3,sid:5,day:'월요일',time:'15:30',topic:'집합 개념 정리'},
];
const CLINIC_DAYS = [
  {day:'월요일',slots:['15:00','15:30','16:00','16:30','17:00']},
  {day:'수요일',slots:['15:00','15:30','16:00','16:30']},
  {day:'금요일',slots:['16:00','16:30','17:00']},
];
const EXAMS = [
  {id:1,name:'5월 모의고사',date:'2026.05.10',sc:{1:{국어:82,수학:91},2:{수학:78},3:{국어:85,수학:72},4:{수학:88},5:{국어:79,수학:83}}},
  {id:2,name:'4월 월말고사',date:'2026.04.28',sc:{1:{국어:80,수학:88},2:{수학:75},3:{국어:82,수학:70},4:{수학:85},5:{국어:77,수학:80}}},
  {id:3,name:'3월 모의고사',date:'2026.03.28',sc:{1:{국어:78,수학:86},2:{수학:72},3:{국어:80,수학:68},4:{수학:82},5:{국어:75,수학:77}}},
];
const REVIEWS = [
  {id:1,cid:1,date:'05/26',topic:'미분 기초',sc:{1:90,4:75}},
  {id:2,cid:1,date:'05/21',topic:'극한',sc:{1:85,4:80}},
  {id:3,cid:1,date:'05/19',topic:'수열의 극한',sc:{1:80,4:75}},
  {id:4,cid:2,date:'05/27',topic:'집합과 명제',sc:{2:88,5:92}},
  {id:5,cid:2,date:'05/22',topic:'함수의 극한',sc:{2:76,5:90}},
  {id:6,cid:4,date:'05/26',topic:'독서 비문학',sc:{1:70}},
  {id:7,cid:6,date:'05/21',topic:'현대시 감상',sc:{5:82}},
];
const WRONG_TYPES = ['개념 오류','계산 실수','문제 이해 오류','독해 오류','기타'];
const INIT_WRONG = [
  {id:1,sid:1,examId:1,subject:'수학',q:12,type:'개념 오류',concept:'미분의 정의',note:'극한값 계산 혼동'},
  {id:2,sid:1,examId:1,subject:'수학',q:18,type:'계산 실수',concept:'적분 계산',note:'부호 오류'},
  {id:3,sid:1,examId:1,subject:'국어',q:5,type:'독해 오류',concept:'주제 파악',note:'선지 혼동'},
  {id:4,sid:4,examId:1,subject:'수학',q:8,type:'개념 오류',concept:'삼각함수 정의',note:''},
  {id:5,sid:4,examId:1,subject:'수학',q:15,type:'계산 실수',concept:'로그 계산',note:''},
  {id:6,sid:2,examId:1,subject:'수학',q:10,type:'문제 이해 오류',concept:'함수 관계',note:'조건 미확인'},
  {id:7,sid:3,examId:1,subject:'수학',q:6,type:'개념 오류',concept:'이차방정식 근의 공식',note:''},
  {id:8,sid:3,examId:1,subject:'국어',q:3,type:'독해 오류',concept:'문맥 파악',note:''},
  {id:9,sid:5,examId:2,subject:'수학',q:20,type:'계산 실수',concept:'삼각함수 적분',note:''},
  {id:10,sid:1,examId:2,subject:'수학',q:9,type:'개념 오류',concept:'수열의 극한',note:''},
];

// ── HELPERS ───────────────────────────────────────────────────────
const gS = id => INIT_STUDENTS.find(s=>s.id===id)||{name:'?'};
const gC = id => CLASSES.find(c=>c.id===id)||{};
// Parse '05/28' or '06/02' → {month,day}
const parseDate = str => { const [m,d]=str.split('/').map(Number); return {month:m,day:d}; };

// ── SHARED COMPONENTS ─────────────────────────────────────────────
function Pill({text,sm=false}) {
  const m={출석:{bg:'#dcfce7',c:'#15803d'},결석:{bg:'#fee2e2',c:'#dc2626'},지각:{bg:'#fef9c3',c:'#92400e'},
    제출:{bg:'#dcfce7',c:'#15803d'},미제출:{bg:'#fee2e2',c:'#dc2626'},
    '개념 오류':{bg:'#fee2e2',c:'#dc2626'},'계산 실수':{bg:'#fef9c3',c:'#92400e'},
    '문제 이해 오류':{bg:'#ede9fe',c:'#6d28d9'},'독해 오류':{bg:'#e0f2fe',c:'#0369a1'},'기타':{bg:'#f5f5f5',c:'#555'}};
  const s=m[text]||{bg:'#f5f5f5',c:'#888'};
  return <span style={{display:'inline-block',padding:sm?'1px 6px':'2px 9px',borderRadius:4,fontSize:sm?10:11,fontWeight:600,background:s.bg,color:s.c,whiteSpace:'nowrap'}}>{text}</span>;
}
function ScoreChip({score}) {
  if(score===undefined||score===null) return <span style={{color:'#ccc',fontSize:12}}>—</span>;
  const c=score>=90?'#15803d':score>=80?'#1d4ed8':score>=70?'#b45309':'#dc2626';
  return <span style={{fontWeight:700,color:c,fontSize:14}}>{score}</span>;
}
function Av({src,name,sz=30}) {
  if(src) return <img src={src} alt={name} style={{width:sz,height:sz,borderRadius:'50%',objectFit:'cover',flexShrink:0}}/>;
  return <div style={{width:sz,height:sz,borderRadius:'50%',background:'#111',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*0.37,fontWeight:700,flexShrink:0}}>{(name||'?')[0]}</div>;
}
function SectionTitle({children}) {
  return <h2 style={{fontSize:19,fontWeight:700,color:'#111',margin:'0 0 18px',letterSpacing:-0.4,fontFamily:'inherit'}}>{children}</h2>;
}
function Card({children,style={}}) {
  return <div style={{background:'#fff',border:'1px solid #eee',borderRadius:12,padding:'16px 20px',marginBottom:12,...style}}>{children}</div>;
}
function Btn({children,onClick,variant='default',sz='md',type='button'}) {
  const p=sz==='sm'?'5px 10px':'8px 16px';
  const f=sz==='sm'?11:13;
  const base={padding:p,borderRadius:8,cursor:'pointer',fontSize:f,fontWeight:500,fontFamily:'inherit',transition:'opacity 0.1s',type};
  return variant==='primary'
    ?<button onClick={onClick} style={{...base,background:'#111',color:'#fff',border:'none'}}>{children}</button>
    :<button onClick={onClick} style={{...base,background:'#fff',color:'#444',border:'1px solid #ddd'}}>{children}</button>;
}
function TabPills({items,active,onChange}) {
  return <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
    {items.map(it=><button key={it.id} onClick={()=>onChange(it.id)} style={{padding:'6px 14px',borderRadius:20,cursor:'pointer',fontSize:12,fontWeight:500,border:'1px solid #ddd',background:active===it.id?'#111':'#fff',color:active===it.id?'#fff':'#666',fontFamily:'inherit',transition:'all 0.15s'}}>{it.label}</button>)}
  </div>;
}
function Input({value,onChange,placeholder,type='text',style={}}) {
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{padding:'9px 12px',border:'1px solid #ddd',borderRadius:8,fontSize:13,outline:'none',fontFamily:'inherit',width:'100%',boxSizing:'border-box',...style}}/>;
}
function Select({value,onChange,children,style={}}) {
  return <select value={value} onChange={onChange} style={{padding:'9px 12px',border:'1px solid #ddd',borderRadius:8,fontSize:13,outline:'none',fontFamily:'inherit',background:'#fff',...style}}>{children}</select>;
}

// ── LOGIN ─────────────────────────────────────────────────────────
function Login({onLogin}) {
  const [code,setCode]=useState(''); const [pw,setPw]=useState('');
  const [role,setRole]=useState('student'); const [err,setErr]=useState('');
  const handle=()=>{
    if(role==='admin'){
      if(code==='admin'&&pw==='admin'){onLogin({role:'admin',name:'관리자'});return;}
      setErr('관리자 계정 정보가 올바르지 않습니다.');return;
    }
    const s=INIT_STUDENTS.find(s=>s.code===code&&s.pw===pw);
    if(s){onLogin({role:'student',id:s.id,name:s.name,grade:s.grade,classes:s.classes,photo:s.photo});return;}
    setErr('코드 또는 비밀번호가 올바르지 않습니다.');
  };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#fff',fontFamily:"'Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif"}}>
      <div style={{width:340}}>
        <div style={{marginBottom:36}}>
          <div style={{fontSize:26,fontWeight:800,color:'#111',letterSpacing:-0.8}}>카니윌학원</div>
          <div style={{fontSize:13,color:'#aaa',marginTop:4}}>학습 결과를 바꾸는 작은 습관, 스케줄 관리부터</div>
        </div>
        <div style={{display:'flex',background:'#f5f5f5',borderRadius:10,padding:3,marginBottom:20}}>
          {['student','admin'].map(r=><button key={r} onClick={()=>{setRole(r);setErr('');}} style={{flex:1,padding:'8px',borderRadius:8,border:'none',cursor:'pointer',fontSize:13,fontWeight:500,fontFamily:'inherit',background:role===r?'#fff':'transparent',color:role===r?'#111':'#888',boxShadow:role===r?'0 1px 3px rgba(0,0,0,0.1)':'none',transition:'all 0.15s'}}>{r==='student'?'학생':'관리자'}</button>)}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <Input value={code} onChange={e=>setCode(e.target.value)} placeholder={role==='student'?'학생 코드 (예: KMJ001)':'관리자 아이디'}/>
          <Input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="비밀번호"/>
          {err&&<div style={{fontSize:12,color:'#dc2626',padding:'0 2px'}}>{err}</div>}
          <button onClick={handle} style={{padding:'12px',background:'#111',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit',marginTop:4}}>로그인</button>
        </div>
        <div style={{marginTop:20,background:'#f9f9f9',borderRadius:10,padding:'14px 16px'}}>
          <div style={{fontSize:11,color:'#999',marginBottom:6,fontWeight:500}}>데모 계정</div>
          <div style={{fontSize:11,color:'#aaa',lineHeight:1.9}}>
            관리자: admin / admin<br/>학생: KMJ001 / 1234 (김민준·고2)<br/>학생: LSY002 / 1234 (이서연·고1)
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN: HOME ───────────────────────────────────────────────────
function AdminHome({hw,clinic,wrong}) {
  const pending=hw.reduce((a,h)=>a+Object.values(h.done).filter(v=>!v).length,0);
  const stats=[{l:'전체 학생',v:INIT_STUDENTS.length,u:'명'},{l:'수업반',v:CLASSES.length,u:'개'},{l:'미제출 과제',v:pending,u:'건'},{l:'이번 주 클리닉',v:clinic.length,u:'건'}];
  return (
    <div>
      <SectionTitle>홈</SectionTitle>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24}}>
        {stats.map(s=><div key={s.l} style={{background:'#fafafa',border:'1px solid #eee',borderRadius:10,padding:'16px 18px'}}>
          <div style={{fontSize:11,color:'#aaa',marginBottom:6,fontWeight:500}}>{s.l}</div>
          <div style={{fontSize:26,fontWeight:800,color:'#111'}}>{s.v}<span style={{fontSize:13,fontWeight:400,color:'#bbb',marginLeft:2}}>{s.u}</span></div>
        </div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Card>
          <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>이번 주 클리닉 예약</div>
          {clinic.length===0&&<div style={{fontSize:12,color:'#bbb',padding:'8px 0'}}>예약 없음</div>}
          {clinic.map(c=>{const s=gS(c.sid);return <div key={c.id} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 0',borderBottom:'1px solid #f5f5f5'}}>
            <Av name={s.name} sz={28}/><div><div style={{fontSize:13,fontWeight:500}}>{s.name}</div><div style={{fontSize:11,color:'#aaa'}}>{c.day} {c.time} · {c.topic}</div></div>
          </div>;})}
        </Card>
        <Card>
          <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>미제출 과제 현황</div>
          {hw.filter(h=>Object.values(h.done).some(v=>!v)).map(h=>{
            const cls=gC(h.cid);
            const missed=Object.entries(h.done).filter(([,v])=>!v).map(([sid])=>gS(+sid).name).join(', ');
            return <div key={h.id} style={{padding:'8px 0',borderBottom:'1px solid #f5f5f5'}}>
              <div style={{fontSize:13,fontWeight:500,color:'#111'}}>{h.title}</div>
              <div style={{fontSize:11,color:'#aaa',marginTop:2}}>{cls.name} · ~{h.due} · 미제출: {missed}</div>
            </div>;
          })}
        </Card>
      </div>
    </div>
  );
}

// ── ADMIN: STUDENTS ───────────────────────────────────────────────
function AdminStudents({students}) {
  const [q,setQ]=useState(''); const [sel,setSel]=useState(null);
  const list=students.filter(s=>s.name.includes(q)||s.grade.includes(q)||s.code.includes(q));
  const selObj=sel?students.find(s=>s.id===sel):null;
  return (
    <div>
      <SectionTitle>학생 관리</SectionTitle>
      <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="이름·학년·코드 검색" style={{width:240,marginBottom:16}}/>
      <Card style={{padding:0,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#fafafa'}}>
            {['이름','학년','코드','수강반',''].map(h=><th key={h} style={{textAlign:'left',padding:'10px 16px',fontSize:12,color:'#aaa',fontWeight:500}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {list.map(s=><tr key={s.id} style={{borderTop:'1px solid #f5f5f5',cursor:'pointer',background:sel===s.id?'#fafafa':'#fff'}} onClick={()=>setSel(sel===s.id?null:s.id)}>
              <td style={{padding:'12px 16px'}}><div style={{display:'flex',alignItems:'center',gap:9}}><Av src={s.photo} name={s.name} sz={28}/><span style={{fontSize:13,fontWeight:500}}>{s.name}</span></div></td>
              <td style={{padding:'12px 16px',fontSize:13,color:'#666'}}>{s.grade}</td>
              <td style={{padding:'12px 16px',fontSize:12,color:'#aaa',fontFamily:'monospace'}}>{s.code}</td>
              <td style={{padding:'12px 16px'}}>{s.classes.map(cid=><span key={cid} style={{display:'inline-block',marginRight:4,padding:'2px 8px',background:'#f5f5f5',borderRadius:4,fontSize:11,color:'#555'}}>{gC(cid).name}</span>)}</td>
              <td style={{padding:'12px 16px',fontSize:11,color:'#ccc',textAlign:'right'}}>{sel===s.id?'▲':'▼'}</td>
            </tr>)}
          </tbody>
        </table>
      </Card>
      {selObj&&<Card style={{background:'#fafafa'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
          <Av src={selObj.photo} name={selObj.name} sz={44}/>
          <div>
            <div style={{fontSize:16,fontWeight:700}}>{selObj.name}</div>
            <div style={{fontSize:12,color:'#999',marginTop:2}}>코드: <b>{selObj.code}</b> · 비번: <b>{selObj.pw}</b> · {selObj.grade}</div>
          </div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:12,color:'#aaa',marginBottom:6,fontWeight:500}}>수강 중인 반</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{selObj.classes.map(cid=>{const c=gC(cid);return <span key={cid} style={{padding:'5px 12px',background:'#fff',border:'1px solid #eee',borderRadius:20,fontSize:12}}>{c.name} · {c.days} {c.time}</span>;})}</div>
        </div>
        <div><div style={{fontSize:12,color:'#aaa',marginBottom:6,fontWeight:500}}>최근 시험 성적</div>
          <div style={{display:'flex',gap:8}}>{EXAMS.slice(0,2).map(e=>{const sc=e.sc[selObj.id];if(!sc)return null;return <div key={e.id} style={{background:'#fff',border:'1px solid #eee',borderRadius:8,padding:'9px 14px'}}>
            <div style={{fontSize:11,color:'#aaa',marginBottom:4}}>{e.name}</div>
            {Object.entries(sc).map(([sub,v])=><div key={sub} style={{fontSize:13,fontWeight:700,color:'#111'}}>{sub} {v}점</div>)}
          </div>;})}</div>
        </div>
      </Card>}
    </div>
  );
}

// ── ADMIN: ATTENDANCE ─────────────────────────────────────────────
function AdminAttendance({att,setAtt}) {
  const [cid,setCid]=useState(1);
  const sessions=att[cid]||[]; const sids=CS[cid]||[];
  const cycle=['출석','지각','결석'];
  const toggle=(di,sid)=>{
    const cur=sessions[di].v[sid]||'출석';
    const nxt=cycle[(cycle.indexOf(cur)+1)%cycle.length];
    setAtt(prev=>{const u=prev[cid].map((s,i)=>i===di?{...s,v:{...s.v,[sid]:nxt}}:s);return{...prev,[cid]:u};});
  };
  return (
    <div>
      <SectionTitle>출결 관리</SectionTitle>
      <TabPills items={CLASSES.map(c=>({id:c.id,label:c.name}))} active={cid} onChange={setCid}/>
      <Card>
        <div style={{fontSize:13,fontWeight:600,color:'#333',marginBottom:14}}>{gC(cid).name} · {gC(cid).days} {gC(cid).time}</div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:400}}>
            <thead><tr>
              <th style={{textAlign:'left',padding:'8px 12px',fontSize:12,color:'#aaa',fontWeight:500,borderBottom:'1px solid #eee',width:120}}>학생</th>
              {sessions.map(s=><th key={s.d} style={{textAlign:'center',padding:'8px 12px',fontSize:12,color:'#aaa',fontWeight:500,borderBottom:'1px solid #eee'}}>{s.d}</th>)}
            </tr></thead>
            <tbody>{sids.map(sid=>{const stu=gS(sid);return <tr key={sid} style={{borderBottom:'1px solid #f8f8f8'}}>
              <td style={{padding:'10px 12px'}}><div style={{display:'flex',alignItems:'center',gap:7}}><Av src={stu.photo} name={stu.name} sz={24}/><span style={{fontSize:13}}>{stu.name}</span></div></td>
              {sessions.map((s,di)=><td key={s.d} style={{padding:'10px 12px',textAlign:'center'}}><span onClick={()=>toggle(di,sid)} style={{cursor:'pointer'}}><Pill text={s.v[sid]||'—'}/></span></td>)}
            </tr>;})}</tbody>
          </table>
        </div>
        <p style={{fontSize:11,color:'#ccc',marginTop:10,marginBottom:0}}>* 클릭 시 출석 → 지각 → 결석으로 변경</p>
      </Card>
    </div>
  );
}

// ── ADMIN: HOMEWORK (with creation) ──────────────────────────────
function AdminHomework({hw,setHw}) {
  const [cid,setCid]=useState(0);
  const [showForm,setShowForm]=useState(false);
  const [editing,setEditing]=useState(null); // {hwId, sid}
  const [editText,setEditText]=useState('');
  const [form,setForm]=useState({cid:'',title:'',desc:'',assigned:'',due:''});

  const filtered=cid===0?hw:hw.filter(h=>h.cid===cid);
  const toggleDone=(hwId,sid)=>setHw(p=>p.map(h=>h.id===hwId?{...h,done:{...h.done,[sid]:!h.done[sid]}}:h));
  const startFb=(hwId,sid,cur)=>{setEditing({hwId,sid});setEditText(cur||'');};
  const saveFb=()=>{if(!editing)return;setHw(p=>p.map(h=>h.id===editing.hwId?{...h,fb:{...h.fb,[editing.sid]:editText}}:h));setEditing(null);};

  const createHw=()=>{
    if(!form.cid||!form.title||!form.due) return;
    const cidN=+form.cid;
    const sids=CS[cidN]||[];
    const done=Object.fromEntries(sids.map(sid=>[sid,false]));
    const fb=Object.fromEntries(sids.map(sid=>[sid,'']));
    setHw(p=>[...p,{id:Date.now(),cid:cidN,title:form.title,desc:form.desc,assigned:form.assigned||'—',due:form.due,done,fb}]);
    setForm({cid:'',title:'',desc:'',assigned:'',due:''}); setShowForm(false);
  };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <SectionTitle>과제 관리</SectionTitle>
        <Btn variant="primary" onClick={()=>setShowForm(v=>!v)}>{showForm?'닫기':'+ 새 과제'}</Btn>
      </div>

      {showForm&&<Card style={{background:'#fafafa',border:'1.5px solid #111',marginBottom:20}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>새 과제 등록</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
          <div>
            <div style={{fontSize:11,color:'#aaa',marginBottom:4}}>수업 반 *</div>
            <Select value={form.cid} onChange={e=>setForm({...form,cid:e.target.value})} style={{width:'100%'}}>
              <option value="">선택하세요</option>
              {CLASSES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <div style={{fontSize:11,color:'#aaa',marginBottom:4}}>과제 제목 *</div>
            <Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="과제 제목 입력"/>
          </div>
          <div>
            <div style={{fontSize:11,color:'#aaa',marginBottom:4}}>출제일</div>
            <Input value={form.assigned} onChange={e=>setForm({...form,assigned:e.target.value})} placeholder="예: 05/26"/>
          </div>
          <div>
            <div style={{fontSize:11,color:'#aaa',marginBottom:4}}>마감일 *</div>
            <Input value={form.due} onChange={e=>setForm({...form,due:e.target.value})} placeholder="예: 06/02"/>
          </div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:'#aaa',marginBottom:4}}>과제 설명</div>
          <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="과제 내용 및 주의사항을 입력하세요" rows={2}
            style={{width:'100%',padding:'9px 12px',border:'1px solid #ddd',borderRadius:8,fontSize:13,outline:'none',fontFamily:'inherit',resize:'vertical',boxSizing:'border-box'}}/>
        </div>
        <div style={{display:'flex',gap:8}}><Btn variant="primary" onClick={createHw}>등록하기</Btn><Btn onClick={()=>setShowForm(false)}>취소</Btn></div>
      </Card>}

      <TabPills items={[{id:0,label:'전체'},...CLASSES.map(c=>({id:c.id,label:c.name}))]} active={cid} onChange={setCid}/>

      {filtered.map(h=>{
        const cls=gC(h.cid);
        const sids=Object.keys(h.done).map(Number);
        const submitted=Object.values(h.done).filter(Boolean).length;
        return <Card key={h.id}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:'#111'}}>{h.title}</div>
              <div style={{fontSize:11,color:'#aaa',marginTop:2}}>{cls.name} · 출제 {h.assigned} · 마감 {h.due}</div>
              {h.desc&&<div style={{fontSize:11,color:'#777',marginTop:4,background:'#f9f9f9',padding:'5px 8px',borderRadius:4}}>{h.desc}</div>}
            </div>
            <div style={{fontSize:12,background:submitted===sids.length?'#dcfce7':'#fee2e2',color:submitted===sids.length?'#15803d':'#dc2626',padding:'3px 10px',borderRadius:20,fontWeight:500,flexShrink:0,marginLeft:8}}>{submitted}/{sids.length} 제출</div>
          </div>
          {sids.map(sid=>{
            const stu=gS(sid);
            const isEd=editing&&editing.hwId===h.id&&editing.sid===sid;
            return <div key={sid} style={{display:'flex',alignItems:'flex-start',gap:9,padding:'9px 0',borderTop:'1px solid #f5f5f5'}}>
              <Av src={stu.photo} name={stu.name} sz={26}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500}}>{stu.name}</div>
                {isEd
                  ?<div style={{display:'flex',gap:6,marginTop:5}}>
                    <Input value={editText} onChange={e=>setEditText(e.target.value)} placeholder="피드백 입력" style={{flex:1,padding:'5px 9px',fontSize:12}}/>
                    <Btn sz="sm" variant="primary" onClick={saveFb}>저장</Btn>
                    <Btn sz="sm" onClick={()=>setEditing(null)}>취소</Btn>
                  </div>
                  :<div style={{fontSize:11,color:h.fb[sid]?'#555':'#ccc',marginTop:2}}>{h.fb[sid]||'피드백 없음'} <span onClick={()=>startFb(h.id,sid,h.fb[sid])} style={{cursor:'pointer',color:'#aaa',textDecoration:'underline',marginLeft:4}}>수정</span></div>
                }
              </div>
              <span onClick={()=>toggleDone(h.id,sid)} style={{cursor:'pointer',flexShrink:0}}><Pill text={h.done[sid]?'제출':'미제출'}/></span>
            </div>;
          })}
        </Card>;
      })}
    </div>
  );
}

// ── ADMIN: CLINIC ─────────────────────────────────────────────────
function AdminClinic({clinic,setClinic}) {
  const [addSlot,setAddSlot]=useState(null);
  const [form,setForm]=useState({sid:'',topic:''});
  const add=()=>{
    if(!form.sid||!form.topic) return;
    setClinic(p=>[...p,{id:Date.now(),sid:+form.sid,day:addSlot.day,time:addSlot.time,topic:form.topic}]);
    setAddSlot(null); setForm({sid:'',topic:''});
  };
  const del=id=>setClinic(p=>p.filter(c=>c.id!==id));
  return (
    <div>
      <SectionTitle>클리닉 예약 관리</SectionTitle>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:16}}>
        {CLINIC_DAYS.map(cd=><Card key={cd.day}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>{cd.day}</div>
          {cd.slots.map(slot=>{
            const res=clinic.find(c=>c.day===cd.day&&c.time===slot);
            return <div key={slot} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:'1px solid #f8f8f8'}}>
              <span style={{fontSize:11,color:'#bbb',width:34,flexShrink:0}}>{slot}</span>
              {res
                ?<div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div><span style={{fontSize:12,fontWeight:500}}>{gS(res.sid).name}</span><span style={{fontSize:11,color:'#bbb',marginLeft:4}}>{res.topic}</span></div>
                  <button onClick={()=>del(res.id)} style={{fontSize:10,color:'#ccc',background:'none',border:'none',cursor:'pointer',padding:'2px 4px'}}>✕</button>
                </div>
                :<button onClick={()=>{setAddSlot({day:cd.day,time:slot});setForm({sid:'',topic:''});}} style={{fontSize:11,color:'#bbb',background:'#f9f9f9',border:'1px dashed #ddd',padding:'3px 10px',borderRadius:4,cursor:'pointer',fontFamily:'inherit'}}>+ 예약</button>
              }
            </div>;
          })}
        </Card>)}
      </div>
      {addSlot&&<Card style={{background:'#fafafa',border:'1.5px solid #111'}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>클리닉 예약 추가</div>
        <div style={{fontSize:12,color:'#aaa',marginBottom:14}}>{addSlot.day} {addSlot.time}</div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end'}}>
          <Select value={form.sid} onChange={e=>setForm({...form,sid:e.target.value})}>
            <option value="">학생 선택</option>
            {INIT_STUDENTS.map(s=><option key={s.id} value={s.id}>{s.name} ({s.grade})</option>)}
          </Select>
          <Input value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} placeholder="상담 주제" style={{flex:1,minWidth:160}}/>
          <Btn variant="primary" onClick={add}>등록</Btn>
          <Btn onClick={()=>setAddSlot(null)}>취소</Btn>
        </div>
      </Card>}
    </div>
  );
}

// ── ADMIN: EXAMS ──────────────────────────────────────────────────
function AdminExams() {
  const [eid,setEid]=useState(1);
  const exam=EXAMS.find(e=>e.id===eid);
  return (
    <div>
      <SectionTitle>시험 성적 관리</SectionTitle>
      <TabPills items={EXAMS.map(e=>({id:e.id,label:e.name}))} active={eid} onChange={setEid}/>
      <Card style={{padding:0,overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid #f0f0f0',fontSize:12,color:'#aaa'}}>{exam.date}</div>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#fafafa'}}>{['이름','학년','국어','수학','총점'].map(h=><th key={h} style={{textAlign:'left',padding:'10px 16px',fontSize:12,color:'#aaa',fontWeight:500}}>{h}</th>)}</tr></thead>
          <tbody>{INIT_STUDENTS.map(s=>{const sc=exam.sc[s.id]||{};const tot=(sc['국어']||0)+(sc['수학']||0);return <tr key={s.id} style={{borderTop:'1px solid #f5f5f5'}}>
            <td style={{padding:'12px 16px'}}><div style={{display:'flex',alignItems:'center',gap:8}}><Av src={s.photo} name={s.name} sz={26}/><span style={{fontSize:13,fontWeight:500}}>{s.name}</span></div></td>
            <td style={{padding:'12px 16px',fontSize:13,color:'#888'}}>{s.grade}</td>
            <td style={{padding:'12px 16px',textAlign:'center'}}><ScoreChip score={sc['국어']}/></td>
            <td style={{padding:'12px 16px',textAlign:'center'}}><ScoreChip score={sc['수학']}/></td>
            <td style={{padding:'12px 16px',textAlign:'center',fontSize:14,fontWeight:700,color:'#111'}}>{tot||'—'}</td>
          </tr>;})}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── ADMIN: REVIEW TESTS ───────────────────────────────────────────
function AdminReview() {
  const [cid,setCid]=useState(1);
  const tests=REVIEWS.filter(r=>r.cid===cid); const sids=CS[cid]||[];
  return (
    <div>
      <SectionTitle>복습테스트 점수</SectionTitle>
      <TabPills items={CLASSES.map(c=>({id:c.id,label:c.name}))} active={cid} onChange={setCid}/>
      <Card style={{padding:0,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#fafafa'}}>
            <th style={{textAlign:'left',padding:'10px 16px',fontSize:12,color:'#aaa',fontWeight:500,width:80}}>날짜</th>
            <th style={{textAlign:'left',padding:'10px 16px',fontSize:12,color:'#aaa',fontWeight:500}}>주제</th>
            {sids.map(sid=><th key={sid} style={{textAlign:'center',padding:'10px 16px',fontSize:12,color:'#aaa',fontWeight:500}}>{gS(sid).name}</th>)}
            <th style={{textAlign:'center',padding:'10px 16px',fontSize:12,color:'#aaa',fontWeight:500}}>평균</th>
          </tr></thead>
          <tbody>{tests.map(t=>{
            const vals=sids.map(sid=>t.sc[sid]).filter(v=>v!==undefined);
            const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):null;
            return <tr key={t.id} style={{borderTop:'1px solid #f5f5f5'}}>
              <td style={{padding:'12px 16px',fontSize:12,color:'#aaa'}}>{t.date}</td>
              <td style={{padding:'12px 16px',fontSize:13,fontWeight:500}}>{t.topic}</td>
              {sids.map(sid=><td key={sid} style={{padding:'12px 16px',textAlign:'center'}}><ScoreChip score={t.sc[sid]}/></td>)}
              <td style={{padding:'12px 16px',textAlign:'center',fontSize:13,fontWeight:700,color:'#555'}}>{avg||'—'}</td>
            </tr>;
          })}</tbody>
        </table>
      </Card>
    </div>
  );
}

// ── ADMIN: CALENDAR (Monthly with HW overlay) ─────────────────────
function AdminCalendar({hw}) {
  const [selDate,setSelDate]=useState(null);
  const [viewMonth,setViewMonth]=useState({year:2026,month:4}); // 0-indexed month; 4=May
  const {year,month}=viewMonth;
  const monthNames=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const dayNamesKr=['월','화','수','목','금','토','일'];
  const daysInMonth=new Date(year,month+1,0).getDate();
  // Mon-first offset: (getDay()+6)%7
  const firstOffset=(new Date(year,month,1).getDay()+6)%7;

  // Map hw to calendar: due or assigned date in this month
  const hwByDay={}; // day -> [{type:'due'|'assigned', hw}]
  hw.forEach(h=>{
    ['due','assigned'].forEach(field=>{
      if(!h[field]||h[field]==='—') return;
      const p=parseDate(h[field]);
      // Check month match (simple: month 5 = index 4)
      if(p.month-1===month&&year===2026){
        if(!hwByDay[p.day]) hwByDay[p.day]=[];
        hwByDay[p.day].push({type:field,hw:h});
      }
    });
  });

  const todayDay=new Date().getDate();
  const isCurrentMonth=(new Date().getMonth()===month&&new Date().getFullYear()===year);

  const cells=[];
  for(let i=0;i<firstOffset;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);
  // Fill to 6 rows
  while(cells.length%7!==0) cells.push(null);

  const selectedHw=selDate?(hwByDay[selDate]||[]):[];

  return (
    <div>
      <SectionTitle>캘린더</SectionTitle>
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
        <button onClick={()=>setViewMonth(v=>{let m=v.month-1,y=v.year;if(m<0){m=11;y--;}return{year:y,month:m};})} style={{width:28,height:28,borderRadius:'50%',border:'1px solid #ddd',background:'#fff',cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
        <span style={{fontSize:15,fontWeight:700}}>{year}년 {monthNames[month]}</span>
        <button onClick={()=>setViewMonth(v=>{let m=v.month+1,y=v.year;if(m>11){m=0;y++;}return{year:y,month:m};})} style={{width:28,height:28,borderRadius:'50%',border:'1px solid #ddd',background:'#fff',cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
      </div>

      {/* Day headers */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:4}}>
        {dayNamesKr.map((d,i)=><div key={d} style={{textAlign:'center',fontSize:11,color:i===5?'#3b82f6':i===6?'#ef4444':'#aaa',padding:'6px 0',fontWeight:500}}>{d}</div>)}
      </div>

      {/* Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2}}>
        {cells.map((day,i)=>{
          const items=day?hwByDay[day]:[];
          const isToday=isCurrentMonth&&day===todayDay;
          const isSel=day===selDate;
          const colIdx=i%7; // 5=Sat,6=Sun
          const isDue=items.some(x=>x.type==='due');
          const isAss=items.some(x=>x.type==='assigned');
          return <div key={i} onClick={day?()=>setSelDate(isSel?null:day):undefined}
            style={{minHeight:60,padding:'6px 5px',border:'1px solid #f0f0f0',borderRadius:6,cursor:day?'pointer':'default',background:isSel?'#111':isToday?'#f0f0f0':'#fff',transition:'background 0.1s'}}>
            {day&&<>
              <div style={{fontSize:12,fontWeight:isToday?700:400,color:isSel?'#fff':colIdx===5?'#3b82f6':colIdx===6?'#ef4444':'#111',marginBottom:3}}>{day}</div>
              {isDue&&<div style={{fontSize:9,background:isSel?'rgba(255,255,255,0.2)':'#fee2e2',color:isSel?'#fff':'#dc2626',borderRadius:3,padding:'1px 4px',marginBottom:1,fontWeight:500}}>마감</div>}
              {isAss&&<div style={{fontSize:9,background:isSel?'rgba(255,255,255,0.2)':'#dbeafe',color:isSel?'#fff':'#1d4ed8',borderRadius:3,padding:'1px 4px',fontWeight:500}}>출제</div>}
            </>}
          </div>;
        })}
      </div>

      {/* Selected date detail */}
      {selDate&&<div style={{marginTop:16}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>{month+1}월 {selDate}일 과제 현황</div>
        {selectedHw.length===0
          ?<div style={{fontSize:12,color:'#ccc',padding:'16px 0',textAlign:'center'}}>이 날짜에 연관된 과제 없음</div>
          :selectedHw.map(({type,hw:h},idx)=>{
            const cls=gC(h.cid);
            const sub=Object.values(h.done).filter(Boolean).length;
            const tot=Object.values(h.done).length;
            return <Card key={idx}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <span style={{fontSize:10,background:type==='due'?'#fee2e2':'#dbeafe',color:type==='due'?'#dc2626':'#1d4ed8',padding:'2px 7px',borderRadius:3,fontWeight:600,marginRight:7}}>{type==='due'?'마감일':'출제일'}</span>
                  <div style={{fontSize:14,fontWeight:600,color:'#111',marginTop:5}}>{h.title}</div>
                  <div style={{fontSize:11,color:'#aaa',marginTop:2}}>{cls.name} · 출제 {h.assigned} → 마감 {h.due}</div>
                  {h.desc&&<div style={{fontSize:11,color:'#777',marginTop:4}}>{h.desc}</div>}
                </div>
                <div style={{textAlign:'right',flexShrink:0,marginLeft:12}}>
                  <div style={{fontSize:11,color:'#aaa'}}>제출 현황</div>
                  <div style={{fontSize:16,fontWeight:700,color:sub===tot?'#15803d':'#dc2626'}}>{sub}/{tot}</div>
                </div>
              </div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:10}}>
                {Object.entries(h.done).map(([sid,done])=><span key={sid} style={{display:'flex',alignItems:'center',gap:4,padding:'3px 8px',background:'#f9f9f9',borderRadius:4,fontSize:11}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:done?'#15803d':'#dc2626',flexShrink:0,display:'inline-block'}}/>
                  {gS(+sid).name}
                </span>)}
              </div>
            </Card>;
          })
        }
      </div>}
    </div>
  );
}

// ── ADMIN: WRONG ANSWERS ──────────────────────────────────────────
function AdminWrongAnswers({wrong,setWrong}) {
  const [eid,setEid]=useState(1);
  const [sid,setSid]=useState(0);
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({sid:'',subject:'수학',q:'',type:'개념 오류',concept:'',note:''});
  const filtered=wrong.filter(w=>w.examId===eid&&(sid===0||w.sid===sid));
  const addWrong=()=>{
    if(!form.sid||!form.q||!form.concept) return;
    setWrong(p=>[...p,{id:Date.now(),sid:+form.sid,examId:eid,subject:form.subject,q:+form.q,type:form.type,concept:form.concept,note:form.note}]);
    setForm({sid:'',subject:'수학',q:'',type:'개념 오류',concept:'',note:''}); setShowAdd(false);
  };
  // Concept frequency
  const conceptFreq=filtered.reduce((a,w)=>{a[w.concept]=(a[w.concept]||0)+1;return a;},{});
  const topConcepts=Object.entries(conceptFreq).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <SectionTitle>오답 관리</SectionTitle>
        <Btn variant="primary" onClick={()=>setShowAdd(v=>!v)}>{showAdd?'닫기':'+ 오답 등록'}</Btn>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <TabPills items={EXAMS.map(e=>({id:e.id,label:e.name}))} active={eid} onChange={v=>{setEid(v);setSid(0);}}/>
        <Select value={sid} onChange={e=>setSid(+e.target.value)} style={{marginBottom:20}}>
          <option value={0}>전체 학생</option>
          {INIT_STUDENTS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
      </div>

      {showAdd&&<Card style={{background:'#fafafa',border:'1.5px solid #111',marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>오답 항목 등록</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:10}}>
          <div><div style={{fontSize:11,color:'#aaa',marginBottom:4}}>학생 *</div>
            <Select value={form.sid} onChange={e=>setForm({...form,sid:e.target.value})} style={{width:'100%'}}>
              <option value="">선택</option>{INIT_STUDENTS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </Select></div>
          <div><div style={{fontSize:11,color:'#aaa',marginBottom:4}}>과목 *</div>
            <Select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={{width:'100%'}}>
              {['수학','국어','영어','과학','사회'].map(s=><option key={s} value={s}>{s}</option>)}
            </Select></div>
          <div><div style={{fontSize:11,color:'#aaa',marginBottom:4}}>문항 번호 *</div>
            <Input type="number" value={form.q} onChange={e=>setForm({...form,q:e.target.value})} placeholder="예: 12"/></div>
          <div><div style={{fontSize:11,color:'#aaa',marginBottom:4}}>오답 유형 *</div>
            <Select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{width:'100%'}}>
              {WRONG_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </Select></div>
          <div><div style={{fontSize:11,color:'#aaa',marginBottom:4}}>빈틈 개념 *</div>
            <Input value={form.concept} onChange={e=>setForm({...form,concept:e.target.value})} placeholder="예: 미분의 정의"/></div>
          <div><div style={{fontSize:11,color:'#aaa',marginBottom:4}}>메모</div>
            <Input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="추가 메모"/></div>
        </div>
        <div style={{display:'flex',gap:8}}><Btn variant="primary" onClick={addWrong}>등록</Btn><Btn onClick={()=>setShowAdd(false)}>취소</Btn></div>
      </Card>}

      {topConcepts.length>0&&<Card style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>자주 틀린 개념 Top 5</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {topConcepts.map(([concept,cnt])=><div key={concept} style={{display:'flex',alignItems:'center',gap:6,background:'#fafafa',border:'1px solid #eee',borderRadius:8,padding:'6px 12px'}}>
            <div style={{width:18,height:18,borderRadius:'50%',background:'#111',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700}}>{cnt}</div>
            <span style={{fontSize:12,fontWeight:500}}>{concept}</span>
          </div>)}
        </div>
      </Card>}

      <Card style={{padding:0,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#fafafa'}}>{['학생','과목','번호','오답 유형','빈틈 개념','메모'].map(h=><th key={h} style={{textAlign:'left',padding:'10px 14px',fontSize:11,color:'#aaa',fontWeight:500}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={6} style={{padding:'24px',textAlign:'center',fontSize:13,color:'#ccc'}}>등록된 오답 없음</td></tr>}
            {filtered.map(w=><tr key={w.id} style={{borderTop:'1px solid #f5f5f5'}}>
              <td style={{padding:'10px 14px'}}><div style={{display:'flex',alignItems:'center',gap:7}}><Av name={gS(w.sid).name} sz={22}/><span style={{fontSize:12,fontWeight:500}}>{gS(w.sid).name}</span></div></td>
              <td style={{padding:'10px 14px',fontSize:12,color:'#555'}}>{w.subject}</td>
              <td style={{padding:'10px 14px',fontSize:12,fontWeight:700,color:'#111'}}>{w.q}번</td>
              <td style={{padding:'10px 14px'}}><Pill text={w.type} sm/></td>
              <td style={{padding:'10px 14px',fontSize:12,color:'#111',fontWeight:500}}>{w.concept}</td>
              <td style={{padding:'10px 14px',fontSize:11,color:'#aaa'}}>{w.note||'—'}</td>
            </tr>)}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── ADMIN: ACCOUNTS ───────────────────────────────────────────────
function AdminAccounts({students,setStudents}) {
  const [newName,setNewName]=useState(''); const [newGrade,setNewGrade]=useState('고1'); const [generated,setGenerated]=useState(null);
  const generate=()=>{
    if(!newName.trim()) return;
    const code=`${newName[0].toUpperCase()}${Date.now().toString().slice(-5)}`;
    const pw=Math.floor(1000+Math.random()*9000).toString();
    const id=students.length+1;
    setStudents(p=>[...p,{id,name:newName,grade:newGrade,code,pw,classes:[],photo:null}]);
    setGenerated({code,pw,name:newName}); setNewName('');
  };
  return (
    <div>
      <SectionTitle>계정 관리</SectionTitle>
      <Card>
        <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>새 학생 계정 생성</div>
        <div style={{display:'flex',gap:10,alignItems:'flex-end',flexWrap:'wrap'}}>
          <div><div style={{fontSize:11,color:'#aaa',marginBottom:4}}>학생 이름</div><Input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="이름 입력" style={{width:140}}/></div>
          <div><div style={{fontSize:11,color:'#aaa',marginBottom:4}}>학년</div>
            <Select value={newGrade} onChange={e=>setNewGrade(e.target.value)}>{['중1','중2','중3','고1','고2','고3'].map(g=><option key={g} value={g}>{g}</option>)}</Select></div>
          <Btn variant="primary" onClick={generate}>계정 생성</Btn>
        </div>
        {generated&&<div style={{marginTop:14,background:'#fafafa',borderRadius:8,padding:'12px 16px'}}>
          <div style={{fontSize:12,color:'#15803d',marginBottom:4}}>✅ {generated.name} 계정 생성 완료</div>
          <div style={{fontSize:13}}>코드: <b style={{fontFamily:'monospace'}}>{generated.code}</b> &nbsp;|&nbsp; 초기 비밀번호: <b style={{fontFamily:'monospace'}}>{generated.pw}</b></div>
        </div>}
      </Card>
      <Card style={{padding:0,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><th style={{textAlign:'left',padding:'10px 16px',fontSize:12,color:'#aaa',fontWeight:500,background:'#fafafa'}}>이름</th><th style={{textAlign:'left',padding:'10px 16px',fontSize:12,color:'#aaa',fontWeight:500,background:'#fafafa'}}>학년</th><th style={{textAlign:'left',padding:'10px 16px',fontSize:12,color:'#aaa',fontWeight:500,background:'#fafafa'}}>코드</th><th style={{textAlign:'left',padding:'10px 16px',fontSize:12,color:'#aaa',fontWeight:500,background:'#fafafa'}}>비밀번호</th></tr></thead>
          <tbody>{students.map(s=><tr key={s.id} style={{borderTop:'1px solid #f5f5f5'}}>
            <td style={{padding:'11px 16px'}}><div style={{display:'flex',alignItems:'center',gap:8}}><Av src={s.photo} name={s.name} sz={24}/><span style={{fontSize:13,fontWeight:500}}>{s.name}</span></div></td>
            <td style={{padding:'11px 16px',fontSize:13,color:'#888'}}>{s.grade}</td>
            <td style={{padding:'11px 16px',fontSize:12,fontFamily:'monospace',color:'#555'}}>{s.code}</td>
            <td style={{padding:'11px 16px',fontSize:12,fontFamily:'monospace',color:'#aaa'}}>{s.pw}</td>
          </tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}

// ── ADMIN APP ─────────────────────────────────────────────────────
function AdminApp({onLogout}) {
  const [tab,setTab]=useState('home');
  const [students,setStudents]=useState(INIT_STUDENTS);
  const [att,setAtt]=useState(INIT_ATT);
  const [hw,setHw]=useState(INIT_HW);
  const [clinic,setClinic]=useState(INIT_CLINIC);
  const [wrong,setWrong]=useState(INIT_WRONG);
  const nav=[
    {id:'home',icon:'◉',label:'홈'},{id:'students',icon:'◈',label:'학생 관리'},
    {id:'attendance',icon:'✓',label:'출결 관리'},{id:'homework',icon:'✎',label:'과제 관리'},
    {id:'clinic',icon:'◇',label:'클리닉 예약'},{id:'exams',icon:'◆',label:'시험 성적'},
    {id:'review',icon:'▣',label:'복습테스트'},{id:'wrong',icon:'✗',label:'오답 관리'},
    {id:'calendar',icon:'▦',label:'캘린더'},{id:'accounts',icon:'◎',label:'계정 관리'},
  ];
  return (
    <div style={{display:'flex',minHeight:'100vh',fontFamily:"'Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif"}}>
      <div style={{width:180,background:'#fafafa',borderRight:'1px solid #eee',display:'flex',flexDirection:'column',flexShrink:0,minHeight:'100vh'}}>
        <div style={{padding:'22px 18px 16px',borderBottom:'1px solid #eee'}}>
          <div style={{fontSize:14,fontWeight:800,color:'#111',letterSpacing:-0.5}}>카니윌학원</div>
          <div style={{fontSize:10,color:'#bbb',marginTop:2}}>관리자 대시보드</div>
        </div>
        <nav style={{flex:1,padding:'8px 0',overflowY:'auto'}}>
          {nav.map(n=><div key={n.id} onClick={()=>setTab(n.id)} style={{display:'flex',alignItems:'center',gap:9,padding:'9px 18px',cursor:'pointer',fontSize:12.5,color:tab===n.id?'#111':'#888',background:tab===n.id?'#efefef':'transparent',fontWeight:tab===n.id?600:400,margin:'1px 6px',borderRadius:7,transition:'all 0.1s'}}>
            <span style={{fontSize:11,width:14,textAlign:'center',flexShrink:0}}>{n.icon}</span>{n.label}
          </div>)}
        </nav>
        <div style={{padding:'12px 18px',borderTop:'1px solid #eee'}}><button onClick={onLogout} style={{fontSize:11,color:'#bbb',background:'none',border:'none',cursor:'pointer',padding:0,fontFamily:'inherit'}}>로그아웃</button></div>
      </div>
      <div style={{flex:1,padding:'28px 30px',background:'#fff',minHeight:'100vh',overflowY:'auto'}}>
        {tab==='home'&&<AdminHome hw={hw} clinic={clinic} wrong={wrong}/>}
        {tab==='students'&&<AdminStudents students={students} setStudents={setStudents}/>}
        {tab==='attendance'&&<AdminAttendance att={att} setAtt={setAtt}/>}
        {tab==='homework'&&<AdminHomework hw={hw} setHw={setHw}/>}
        {tab==='clinic'&&<AdminClinic clinic={clinic} setClinic={setClinic}/>}
        {tab==='exams'&&<AdminExams/>}
        {tab==='review'&&<AdminReview/>}
        {tab==='wrong'&&<AdminWrongAnswers wrong={wrong} setWrong={setWrong}/>}
        {tab==='calendar'&&<AdminCalendar hw={hw}/>}
        {tab==='accounts'&&<AdminAccounts students={students} setStudents={setStudents}/>}
      </div>
    </div>
  );
}

// ── STUDENT APP ───────────────────────────────────────────────────
function StudentApp({user,onLogout}) {
  const [tab,setTab]=useState('home');
  const [clinicList,setClinicList]=useState(INIT_CLINIC);
  const [newClinic,setNewClinic]=useState({day:'',time:'',topic:''});
  const [bookedMsg,setBookedMsg]=useState('');
  const [photo,setPhoto]=useState(user.photo||null);
  const fileRef=useRef();

  const myHw=INIT_HW.filter(h=>h.cid&&CS[h.cid]&&CS[h.cid].includes(user.id));
  const myAtt=Object.entries(INIT_ATT).filter(([cid])=>user.classes.includes(+cid));
  const myWrong=INIT_WRONG.filter(w=>w.sid===user.id);
  const myClinic=clinicList.filter(c=>c.sid===user.id);

  const bookClinic=()=>{
    if(!newClinic.day||!newClinic.time||!newClinic.topic) return;
    setClinicList(p=>[...p,{id:Date.now(),sid:user.id,day:newClinic.day,time:newClinic.time,topic:newClinic.topic}]);
    setBookedMsg(`${newClinic.day} ${newClinic.time} 클리닉 예약 완료!`);
    setNewClinic({day:'',time:'',topic:''});
    setTimeout(()=>setBookedMsg(''),3000);
  };

  const handlePhoto=e=>{
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const nav=[{id:'home',label:'홈'},{id:'homework',label:'과제'},{id:'grades',label:'성적'},{id:'wrong',label:'오답'},{id:'clinic',label:'클리닉'},{id:'profile',label:'마이페이지'}];

  return (
    <div style={{minHeight:'100vh',fontFamily:"'Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif",background:'#fff',display:'flex',flexDirection:'column',maxWidth:480,margin:'0 auto',borderLeft:'1px solid #eee',borderRight:'1px solid #eee'}}>
      <div style={{padding:'16px 20px 0',borderBottom:'1px solid #eee',background:'#fff'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div style={{fontSize:14,fontWeight:800,color:'#111',letterSpacing:-0.5}}>카니윌학원</div>
          <button onClick={onLogout} style={{fontSize:11,color:'#bbb',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit'}}>로그아웃</button>
        </div>
        <div style={{display:'flex',gap:0,overflowX:'auto'}}>
          {nav.map(n=><button key={n.id} onClick={()=>setTab(n.id)} style={{flex:'0 0 auto',padding:'9px 10px',border:'none',borderBottom:tab===n.id?'2px solid #111':'2px solid transparent',background:'transparent',cursor:'pointer',fontSize:11.5,fontWeight:tab===n.id?700:400,color:tab===n.id?'#111':'#aaa',fontFamily:'inherit',transition:'all 0.1s',whiteSpace:'nowrap'}}>{n.label}</button>)}
        </div>
      </div>

      <div style={{flex:1,padding:'20px',overflowY:'auto'}}>
        {tab==='home'&&<div>
          <div style={{marginBottom:20}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <Av src={photo} name={user.name} sz={46}/>
              <div><div style={{fontSize:19,fontWeight:800,color:'#111',letterSpacing:-0.5}}>{user.name} 학생</div>
              <div style={{fontSize:12,color:'#aaa',marginTop:2}}>{user.grade} · 수강반 {user.classes.length}개</div></div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
            {[{l:'수강 중인 반',v:user.classes.length,u:'개'},{l:'미제출 과제',v:myHw.filter(h=>!h.done[user.id]).length,u:'건'}].map(s=><div key={s.l} style={{background:'#fafafa',borderRadius:10,padding:'14px 16px',border:'1px solid #eee'}}>
              <div style={{fontSize:11,color:'#aaa',marginBottom:4}}>{s.l}</div>
              <div style={{fontSize:22,fontWeight:800,color:'#111'}}>{s.v}<span style={{fontSize:12,fontWeight:400,color:'#bbb',marginLeft:2}}>{s.u}</span></div>
            </div>)}
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>내 수업 시간표</div>
            {user.classes.map(cid=>{const c=gC(cid);return <div key={cid} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:'#fafafa',borderRadius:8,marginBottom:6,border:'1px solid #eee'}}>
              <span style={{fontSize:13,fontWeight:500}}>{c.name}</span><span style={{fontSize:12,color:'#aaa'}}>{c.days} {c.time}</span>
            </div>;})}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>이번 주 클리닉</div>
            {myClinic.length===0
              ?<div style={{fontSize:12,color:'#ccc',textAlign:'center',padding:'16px 0'}}>예약된 클리닉 없음</div>
              :myClinic.map(c=><div key={c.id} style={{padding:'10px 14px',background:'#fafafa',borderRadius:8,marginBottom:6,border:'1px solid #eee',fontSize:12}}>
                <span style={{fontWeight:500}}>{c.day} {c.time}</span><span style={{color:'#aaa',marginLeft:6}}>{c.topic}</span>
              </div>)
            }
          </div>
        </div>}

        {tab==='homework'&&<div>
          <div style={{fontSize:17,fontWeight:700,marginBottom:16}}>내 과제</div>
          {myHw.length===0&&<div style={{fontSize:13,color:'#ccc',textAlign:'center',padding:'30px 0'}}>등록된 과제 없음</div>}
          {myHw.map(h=>{const cls=gC(h.cid);return <Card key={h.id} style={{borderLeft:`3px solid ${h.done[user.id]?'#15803d':'#dc2626'}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'#111'}}>{h.title}</div>
                <div style={{fontSize:11,color:'#aaa',marginTop:2}}>{cls.name} · 출제 {h.assigned} · 마감 {h.due}</div>
                {h.desc&&<div style={{fontSize:11,color:'#666',marginTop:4,background:'#f8f8f8',padding:'5px 8px',borderRadius:4}}>{h.desc}</div>}
                {h.fb[user.id]&&<div style={{fontSize:11,color:'#555',marginTop:5,background:'#fffbeb',padding:'5px 8px',borderRadius:4,border:'1px solid #fef3c7'}}>💬 선생님: {h.fb[user.id]}</div>}
              </div>
              <Pill text={h.done[user.id]?'제출':'미제출'}/>
            </div>
          </Card>;})}
        </div>}

        {tab==='grades'&&<div>
          <div style={{fontSize:17,fontWeight:700,marginBottom:16}}>내 성적</div>
          <div style={{fontSize:13,fontWeight:600,color:'#444',marginBottom:10}}>시험 성적</div>
          {EXAMS.map(e=>{const sc=e.sc[user.id];if(!sc)return null;return <Card key={e.id}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><div style={{fontSize:13,fontWeight:600}}>{e.name}</div><div style={{fontSize:11,color:'#aaa',marginTop:2}}>{e.date}</div></div>
              <div style={{display:'flex',gap:12}}>{Object.entries(sc).map(([sub,v])=><div key={sub} style={{textAlign:'center'}}><div style={{fontSize:10,color:'#aaa'}}>{sub}</div><ScoreChip score={v}/></div>)}</div>
            </div>
          </Card>;})}
          <div style={{fontSize:13,fontWeight:600,color:'#444',marginBottom:10,marginTop:16}}>복습테스트</div>
          {REVIEWS.filter(r=>user.classes.includes(r.cid)&&r.sc[user.id]!==undefined).map(r=><div key={r.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',borderBottom:'1px solid #f5f5f5'}}>
            <div><div style={{fontSize:13,fontWeight:500}}>{r.topic}</div><div style={{fontSize:11,color:'#aaa'}}>{gC(r.cid).name} · {r.date}</div></div>
            <ScoreChip score={r.sc[user.id]}/>
          </div>)}
        </div>}

        {tab==='wrong'&&<div>
          <div style={{fontSize:17,fontWeight:700,marginBottom:16}}>내 오답 노트</div>
          {myWrong.length===0&&<div style={{fontSize:13,color:'#ccc',textAlign:'center',padding:'30px 0'}}>등록된 오답 없음</div>}
          {/* Concept summary */}
          {myWrong.length>0&&<Card style={{marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>취약 개념</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {[...new Set(myWrong.map(w=>w.concept))].map(c=><span key={c} style={{padding:'4px 10px',background:'#fee2e2',color:'#dc2626',borderRadius:4,fontSize:11,fontWeight:500}}>{c}</span>)}
            </div>
          </Card>}
          {EXAMS.filter(e=>myWrong.some(w=>w.examId===e.id)).map(e=><div key={e.id} style={{marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:600,color:'#555',marginBottom:8}}>{e.name} · {e.date}</div>
            {myWrong.filter(w=>w.examId===e.id).map(w=><Card key={w.id} style={{marginBottom:8,borderLeft:'3px solid #dc2626'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{w.subject} {w.q}번</div>
                  <div style={{fontSize:12,fontWeight:500,color:'#111',marginTop:2}}>{w.concept}</div>
                  {w.note&&<div style={{fontSize:11,color:'#888',marginTop:2}}>{w.note}</div>}
                </div>
                <Pill text={w.type} sm/>
              </div>
            </Card>)}
          </div>)}
        </div>}

        {tab==='clinic'&&<div>
          <div style={{fontSize:17,fontWeight:700,marginBottom:16}}>클리닉 예약</div>
          <Card>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>새 예약</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <Select value={newClinic.day} onChange={e=>setNewClinic({...newClinic,day:e.target.value,time:''})} style={{width:'100%'}}>
                <option value="">요일 선택</option>{CLINIC_DAYS.map(d=><option key={d.day} value={d.day}>{d.day}</option>)}
              </Select>
              <Select value={newClinic.time} onChange={e=>setNewClinic({...newClinic,time:e.target.value})} style={{width:'100%'}}>
                <option value="">시간 선택</option>
                {(CLINIC_DAYS.find(d=>d.day===newClinic.day)||{slots:[]}).slots.map(s=><option key={s} value={s}>{s}</option>)}
              </Select>
              <Input value={newClinic.topic} onChange={e=>setNewClinic({...newClinic,topic:e.target.value})} placeholder="상담할 내용을 입력하세요"/>
              <Btn variant="primary" onClick={bookClinic}>예약하기</Btn>
              {bookedMsg&&<div style={{fontSize:12,color:'#15803d',background:'#dcfce7',padding:'8px 10px',borderRadius:6}}>{bookedMsg}</div>}
            </div>
          </Card>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>내 예약 목록</div>
          {myClinic.length===0
            ?<div style={{fontSize:12,color:'#ccc',textAlign:'center',padding:'20px 0'}}>예약된 클리닉 없음</div>
            :myClinic.map(c=><div key={c.id} style={{padding:'12px 14px',background:'#fafafa',borderRadius:8,marginBottom:6,border:'1px solid #eee'}}>
              <div style={{fontSize:13,fontWeight:500}}>{c.day} {c.time}</div>
              <div style={{fontSize:11,color:'#aaa',marginTop:2}}>{c.topic}</div>
            </div>)
          }
        </div>}

        {tab==='profile'&&<div>
          <div style={{textAlign:'center',padding:'20px 0 24px'}}>
            <div style={{position:'relative',display:'inline-block',cursor:'pointer'}} onClick={()=>fileRef.current&&fileRef.current.click()}>
              <Av src={photo} name={user.name} sz={72}/>
              <div style={{position:'absolute',bottom:0,right:0,width:22,height:22,borderRadius:'50%',background:'#111',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,border:'2px solid #fff'}}>✎</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:'none'}}/>
            <div style={{fontSize:11,color:'#bbb',marginTop:6}}>사진을 클릭해 변경</div>
            <div style={{fontSize:18,fontWeight:800,color:'#111',marginTop:10}}>{user.name}</div>
            <div style={{fontSize:12,color:'#aaa',marginTop:2}}>{user.grade} · {user.classes.length}개 반 수강</div>
          </div>
          <Card>
            <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>출결 현황</div>
            {myAtt.map(([cid,sessions])=>{
              const st=sessions.reduce((a,s)=>{if(s.v[user.id]==='출석')a.o++;else if(s.v[user.id]==='결석')a.x++;else if(s.v[user.id]==='지각')a.l++;return a;},{o:0,x:0,l:0});
              return <div key={cid} style={{padding:'9px 0',borderBottom:'1px solid #f5f5f5'}}>
                <div style={{fontSize:12,fontWeight:500,marginBottom:4}}>{gC(+cid).name}</div>
                <div style={{display:'flex',gap:8,fontSize:11}}>
                  <span style={{color:'#15803d'}}>출석 {st.o}회</span>
                  <span style={{color:'#b45309'}}>지각 {st.l}회</span>
                  <span style={{color:'#dc2626'}}>결석 {st.x}회</span>
                </div>
              </div>;
            })}
          </Card>
          <Card>
            <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>취약 개념 요약</div>
            {myWrong.length===0
              ?<div style={{fontSize:12,color:'#ccc'}}>등록된 오답 없음</div>
              :[...new Set(myWrong.map(w=>w.concept))].map(c=><div key={c} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #f5f5f5'}}>
                <span style={{fontSize:13}}>{c}</span>
                <span style={{fontSize:11,color:'#aaa'}}>{myWrong.filter(w=>w.concept===c).length}회 오답</span>
              </div>)
            }
          </Card>
        </div>}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);
  useEffect(()=>{
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
    document.head.appendChild(link);
  },[]);
  if(!user) return <Login onLogin={setUser}/>;
  if(user.role==='admin') return <AdminApp onLogout={()=>setUser(null)}/>;
  return <StudentApp user={user} onLogout={()=>setUser(null)}/>;
}

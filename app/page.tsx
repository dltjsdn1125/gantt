import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="text-xl font-extrabold tracking-tight">Gantt<span className="text-primary">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">기능</Link>
            <Link href="#solutions" className="hover:text-primary transition-colors">솔루션</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">가격</Link>
            <Link href="#enterprise" className="hover:text-primary transition-colors">기업용</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-semibold px-4 py-2 hover:text-primary transition-colors">로그인</Link>
            <Link href="/register">
              <Button className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            AI 슈퍼 에이전트 출시
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            미래의 업무 방식 <br/> 
            <span className="bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-clip-text text-transparent italic">
              자동화로 시작됩니다.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            새로운 AI 워크포스를 만나보세요. 우리의 슈퍼 에이전트는 단순히 작업을 정리하는 것이 아니라 실행합니다. 개발 스프린트부터 마케팅 런칭까지, 모든 무거운 작업을 자동화하세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2">
                AI 에이전트 만들기
                <span className="material-symbols-rounded">arrow_forward</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-4 bg-white/5 dark:bg-white/5 hover:bg-white/10 border border-white/10 font-bold rounded-xl transition-all">
                라이브 데모 보기
              </Button>
            </Link>
          </div>
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full"></div>
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-2 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/50">
              {/* Gantt Chart Preview */}
              <div className="w-full rounded-xl bg-white dark:bg-slate-900 p-6 shadow-inner">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">신제품 출시 2024</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">Week</div>
                  </div>
                </div>
                
                {/* Gantt Timeline */}
                <div className="relative">
                  {/* Week Headers */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4">
                    {['10월 16-22', '10월 23-29', '10월 30-11월 5', '11월 6-12', '11월 13-19'].map((week, i) => (
                      <div key={i} className={`flex-1 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 ${i === 3 ? 'text-primary bg-primary/5' : ''}`}>
                        {week}
                      </div>
                    ))}
                  </div>
                  
                  {/* Today Line */}
                  <div className="absolute top-0 bottom-0 left-[60%] w-px bg-primary z-10">
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20"></div>
                  </div>
                  
                  {/* Gantt Bars */}
                  <div className="space-y-3">
                    {/* Task 1 */}
                    <div className="relative h-8 flex items-center">
                      <div className="absolute left-[5%] w-[25%] h-5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded shadow-md flex items-center px-2">
                        <span className="text-[10px] font-medium text-white">시장 분석</span>
                        <div className="ml-auto w-2 h-2 bg-white/30 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Task 2 */}
                    <div className="relative h-8 flex items-center">
                      <div className="absolute left-[15%] w-[30%] h-5 bg-gradient-to-r from-orange-400 to-orange-500 rounded shadow-md flex items-center px-2">
                        <span className="text-[10px] font-medium text-white">소셜 미디어 키트</span>
                        <div className="ml-auto w-2 h-2 bg-white/30 rounded-full"></div>
                      </div>
                      <svg className="absolute pointer-events-none" style={{ left: '5%', top: '0px', width: '15%', height: '100%' }}>
                        <path d="M 100% 4 L 100% 20 L 0 20" fill="none" stroke="#5B4FFF" strokeDasharray="4" strokeWidth="1.5"></path>
                      </svg>
                    </div>
                    
                    {/* Task 3 */}
                    <div className="relative h-8 flex items-center">
                      <div className="absolute left-[35%] w-[40%] h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded shadow-md flex items-center px-2">
                        <span className="text-[10px] font-medium text-white">API 통합</span>
                        <div className="ml-auto w-2 h-2 bg-white/30 rounded-full"></div>
                      </div>
                      <svg className="absolute pointer-events-none" style={{ left: '15%', top: '0px', width: '25%', height: '100%' }}>
                        <path d="M 100% 4 L 100% 20 L 0 20" fill="none" stroke="#5B4FFF" strokeDasharray="4" strokeWidth="1.5"></path>
                      </svg>
                    </div>
                    
                    {/* Task 4 */}
                    <div className="relative h-8 flex items-center">
                      <div className="absolute left-[50%] w-[35%] h-5 bg-gradient-to-r from-slate-400 to-slate-500 rounded shadow-md flex items-center px-2">
                        <span className="text-[10px] font-medium text-white">모바일 반응형</span>
                        <div className="ml-auto w-2 h-2 bg-white/30 rounded-full"></div>
                      </div>
                      <svg className="absolute pointer-events-none" style={{ left: '35%', top: '0px', width: '20%', height: '100%' }}>
                        <path d="M 100% 4 L 100% 20 L 0 20" fill="none" stroke="#5B4FFF" strokeDasharray="4" strokeWidth="1.5"></path>
                      </svg>
                    </div>
                    
                    {/* Task 5 */}
                    <div className="relative h-8 flex items-center">
                      <div className="absolute left-[70%] w-[25%] h-5 bg-gradient-to-r from-purple-500 to-purple-600 rounded shadow-md flex items-center px-2 border-2 border-dashed border-purple-400">
                        <span className="text-[10px] font-medium text-white">최종 베타 테스트</span>
                        <div className="ml-auto w-2 h-2 bg-white/30 rounded-full"></div>
                      </div>
                      <svg className="absolute pointer-events-none" style={{ left: '50%', top: '0px', width: '25%', height: '100%' }}>
                        <path d="M 100% 4 L 100% 20 L 0 20" fill="none" stroke="#5B4FFF" strokeDasharray="4" strokeWidth="1.5"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Agent Notification */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card px-6 py-4 rounded-2xl shadow-2xl border border-primary/30 animate-float bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="material-symbols-rounded text-white">smart_toy</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-primary">에이전트 동기화</div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">42개 태스크 의존성 최적화 중...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-slate-500 mb-8 uppercase tracking-[0.2em]">
            급성장 팀들이 신뢰하는 플랫폼
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-black">STRIKE</div>
            <div className="text-2xl font-black italic">VELOCITY</div>
            <div className="text-2xl font-bold tracking-tighter">CLOUDCORE</div>
            <div className="text-2xl font-black">NEXUS</div>
            <div className="text-2xl font-extrabold uppercase">Sphere</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" id="features">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">팀 전반의 슈퍼 에이전트</h2>
            <p className="text-slate-500">컨텍스트와 부서 요구사항을 이해하는 지능형 자동화</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dev Agent */}
            <div className="glass-card p-8 rounded-3xl border-primary/20 group hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                <span className="material-symbols-rounded">terminal</span>
              </div>
              <h3 className="text-xl font-bold mb-3">개발 에이전트</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                병목 코드 커밋을 자동으로 감지하고 스프린트의 우선순위 티켓을 재할당합니다.
              </p>
              <Link href="/register" className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-4 transition-all cursor-pointer">
                개발 에이전트 탐색 <span className="material-symbols-rounded text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Strategy Agent */}
            <div className="glass-card p-8 rounded-3xl border-emerald-500/20 group hover:border-emerald-500/40 transition-all scale-105 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <span className="material-symbols-rounded">auto_awesome</span>
              </div>
              <h3 className="text-xl font-bold mb-3">전략 에이전트</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                프로젝트 지연을 몇 주 전에 예측하고 마감일을 맞추기 위해 리소스를 재배치합니다.
              </p>
              <Link href="/register" className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-4 transition-all cursor-pointer">
                전략 에이전트 탐색 <span className="material-symbols-rounded text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Growth Agent */}
            <div className="glass-card p-8 rounded-3xl border-rose-500/20 group hover:border-rose-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
                <span className="material-symbols-rounded">campaign</span>
              </div>
              <h3 className="text-xl font-bold mb-3">성장 에이전트</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                디자인 태스크가 완료되자마자 모든 플랫폼의 마케팅 자산을 동기화합니다.
              </p>
              <Link href="/register" className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-4 transition-all cursor-pointer">
                성장 에이전트 탐색 <span className="material-symbols-rounded text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center glass-card py-20 rounded-[3rem] border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">미래의 업무 방식을 시작할 준비가 되셨나요?</h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            AI 슈퍼 에이전트로 워크플로우를 자동화한 10,000개 이상의 팀에 합류하세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-black text-lg rounded-2xl shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="mailto:sales@ganttai.com">
              <Button variant="outline" className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-slate-700 font-bold rounded-2xl hover:bg-white/5 transition-all">
                영업팀 문의
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate-500">신용카드 불필요 • 무제한 무료 체험 • SOC2 인증</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="text-lg font-extrabold tracking-tight">Gantt<span className="text-primary">AI</span></span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <Link href="/privacy" className="hover:text-primary transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">이용약관</Link>
            <Link href="/security" className="hover:text-primary transition-colors">보안</Link>
            <Link href="/status" className="hover:text-primary transition-colors">상태</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-slate-600 dark:text-slate-500">
          © 2024 GanttAI Automation Inc. 내일의 고성과 팀을 위해 만들어졌습니다.
        </div>
      </footer>
    </div>
  );
}

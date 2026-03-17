import React, { useState, useEffect } from 'react';
import { FileText, List, Plus, Sun, Moon, ArrowLeft, Wand2, Search, Calendar, Clock, ChevronDown, ChevronUp, AlertCircle, Trash2, CheckCircle2, Copy, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from '@google/genai';
import { Report } from './types';

const PROMPTS: Record<string, string> = {
  '新規商談＆ヒアリング': `
#前提条件:
- タイトル: 商談レポート
- 依頼者条件: 保険代理店の営業職または保険相談に従事するFP(ファイナンシャルプランナー)
- 前提知識: 保険商品に関する一般的な知識および営業に必要なコミュニケーションスキル、金融庁ガイドラインの理解、および営業コンプライアンス
- 目的と目標: 保険相談の商談結果を効果的に記録し、次のステップに繋げるために、適切なレポートを作成すること。金融庁の監督指針に従った適切な商談プロセスの記録および顧客意向の変遷を明確に文書化すること

#依頼事項
-以下のフォーマットに従って、保険相談の商談結果を時系列順かつ金融庁ガイドラインに準拠した形で詳細に記録してください。顧客の意向がどのように形成され、変化したかの過程を重視して臨場感をもって記載すること。
-ソース引用番号は出力時記載しないこと

#補足事項
-フォーマットの内容で、ソースから読み解けない、または触れられていない項目については「詳細未記載につき省略」と記載
-意向の変化については具体的な理由も併記すること

#出力用フォーマット
【商談メモ】
▷面談日　2026年＊月＊日＊時＊分～＊時＊分
▷面談相手　＊＊＊＊様
▷面談方法＆場所
・オンライン　or　対面（ご自宅やカフェなど）
▷ご相談内容の概要
・
▷商談前説明事項
自己紹介・会社概要：
権限明示：
勧誘方針：
取り扱い保険会社・推奨会社選定理由：
FD宣言（顧客本位の業務運営）：
プライバシーポリシー：
▷各保障ごとのご要望の有無
①死亡保障について
・
②医療保障について
・
③就業不能保障について
・
④資産形成について
・
▷既存の加入保険の内容や保険料メモ
・
▷〇〇様のご意向を受けての特記事項
・
▷その他ご要望を受けて
・
`,
  '提案・クロージング': `
#前提条件:
- タイトル: 商談レポート
- 依頼者条件: 保険代理店の営業職または保険相談に従事するFP(ファイナンシャルプランナー)
- 前提知識: 保険商品に関する一般的な知識および営業に必要なコミュニケーションスキル、金融庁ガイドラインの理解、および営業コンプライアンス
- 目的と目標: 保険相談の商談結果を効果的に記録し、次のステップに繋げるために、適切なレポートを作成すること。金融庁の監督指針に従った適切な商談プロセスの記録および顧客意向の変遷を明確に文書化すること

#依頼事項
-以下のフォーマットに従って、保険相談の商談結果を時系列順かつ金融庁ガイドラインに準拠した形で詳細に記録してください。顧客の意向がどのように形成され、変化したかの過程を重視して臨場感をもって記載すること。
-ソース引用番号は出力時記載しないこと

#補足指示
-ソース引用番号は出力時記載しないこと
-フォーマットの内容で、ソースから読み解けない、または触れられていない項目については「詳細未記載につき省略」と記載
-意向の変化については具体的な理由も併記すること

#出力用参考フォーマット
【商談メモ】
▷面談日　2026年＊月＊日＊時＊分～＊時＊分
▷面談相手：＊＊＊＊様
▷面談方法＆場所
・オンライン　or　対面（ご自宅やカフェなど）
▷ご相談内容の概要
・
▷ご相談者様のご意向を受けてのご提案内容(♯保険会社名と商品名や保険料も可能な限り記載する)
・
▷ご要望の変化の有無
・
▷その他ご要望を受けて今後の対応
・
※次回スケジュールMemo
・
`,
  'ご契約手続き': `
#前提条件:
- タイトル: 商談レポート
- 依頼者条件: 保険代理店の営業職または保険相談に従事するFP(ファイナンシャルプランナー)
- 前提知識: 保険商品に関する一般的な知識および営業に必要なコミュニケーションスキル、金融庁ガイドラインの理解、および営業コンプライアンス
- 目的と目標: 保険相談の商談結果を効果的に記録し、次のステップに繋げるために、適切なレポートを作成すること。金融庁の監督指針に従った適切な商談プロセスの記録および顧客意向の変遷を明確に文書化すること

#依頼事項
以下のフォーマットに従って、保険相談の商談結果を時系列順かつ金融庁ガイドラインに準拠した形で詳細に記録してください。顧客の意向がどのように形成され、変化したかの過程を重視して臨場感をもって記載すること。

#補足指示
-ソース引用番号は出力時記載しないこと
-フォーマットの内容で、ソースから読み解けない、または触れられていない項目については「詳細未記載につき省略」と記載
-意向の変化については具体的な理由も併記すること

#出力用フォーマット
【商談メモ】
▷面談日　2026年＊月＊日＊時＊分～＊時＊分
▷面談相手　＊＊＊＊様
▷面談方法＆場所
・オンライン　or　対面（ご自宅やカフェなど）
▷ご相談内容の概要
・
▷各保障ごとの最終意向
①死亡保障について
・
②医療保障について
・
③就業不能保障について
・
④資産形成について
・
▷最終意向確認のプロセス
・前回ご説明した内容の確認状況
・ご提案内容の変更有無について
・注意喚起情報のご説明
・特定保険契約についてのリスク関連説明と理解度確認
▷最終的なお申込内容
・
▷特定保険契約の特記するご説明の有無
・運用リスクについての説明
・解約控除や市場価格調整についての説明
・ご契約時の各保険会社の「確認コール」実施の有無について
`,
  '保全・見直し': `
#前提条件:
- タイトル: 商談レポート
- 依頼者条件: 保険代理店の営業職または保険相談に従事するFP(ファイナンシャルプランナー)
- 前提知識: 保険商品に関する一般的な知識および営業に必要なコミュニケーションスキル、金融庁ガイドラインの理解、および営業コンプライアンス
- 目的と目標: 保険相談の商談結果を効果的に記録し、次のステップに繋げるために、適切なレポートを作成すること。金融庁の監督指針に従った適切な商談プロセスの記録および顧客意向の変遷を明確に文書化すること

#依頼事項
-以下のフォーマットに従って、保険相談の商談結果を時系列順かつ金融庁ガイドラインに準拠した形で詳細に記録してください。顧客の意向がどのように形成され、変化したかの過程を重視して臨場感をもって記載すること。
-ソース引用番号は出力時記載しないこと

#補足事項
-フォーマットの内容で、ソースから読み解けない、または触れられていない項目については「詳細未記載につき省略」と記載
-意向の変化については具体的な理由も併記すること

#出力用フォーマット
【商談メモ】
▷面談日　2026年＊月＊日＊時＊分～＊時＊分
▷面談相手　＊＊＊＊様
▷面談方法＆場所
・オンライン　or　対面
▷保全内容の概要
・近況：
・保全内容：
▷〇〇様のご意向を受けての特記事項
・
▷その他ご要望を受けて
・
`,
  '損害保険関連': `
#前提条件:
- タイトル: 商談レポート
- 依頼者条件: 保険代理店の営業職または保険相談に従事するFP(ファイナンシャルプランナー)
- 前提知識: 保険商品に関する一般的な知識および営業に必要なコミュニケーションスキル、金融庁ガイドラインの理解、および営業コンプライアンス
- 目的と目標: 保険相談の商談結果を効果的に記録し、次のステップに繋げるために、適切なレポートを作成すること。金融庁の監督指針に従った適切な商談プロセスの記録および顧客意向の変遷を明確に文書化すること

#依頼事項
以下のフォーマットに従って、保険相談の商談結果を時系列順かつ金融庁ガイドラインに準拠した形で詳細に記録してください。顧客の意向がどのように形成され、変化したかの過程を重視して臨場感をもって記載すること。

#補足指示
-ソース引用番号は出力時記載しないこと
-フォーマットの内容で、ソースから読み解けない、または触れられていない項目については「詳細未記載につき省略」と記載
-意向の変化については具体的な理由も併記すること

#出力用フォーマット
【商談メモ】
▷面談日　2026年＊月＊日＊時＊分～＊時＊分
▷面談相手　＊＊＊＊様
▷面談方法＆場所
・オンライン　or　対面（ご自宅やカフェなど）
▷ご相談内容の概要
・
▷損保最終意向
・
▷最終意向確認のプロセス
・前回ご説明した内容の確認状況
・ご提案内容の変更有無について
・注意喚起情報のご説明
▷最終的なお申込内容
・
▷特記事項
`
};

const emptyReport: Omit<Report, 'id' | 'createdAt' | 'updatedAt'> = {
  meetingType: '新規商談＆ヒアリング',
  date: '',
  startTime: '',
  endTime: '',
  clientName: '',
  meetingMethod: 'オンライン',
  location: '',
  summary: '',
  details: '',
  selfIntro: '',
  authority: '',
  solicitationPolicy: '',
  recommendationReason: '',
  fdDeclaration: '',
  privacyPolicy: '',
  deathBenefit: '',
  medicalBenefit: '',
  disabilityBenefit: '',
  assetFormation: '',
  existingInsurance: '',
  specialNotes: '',
  otherRequests: '',
};

export default function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'preview'>('list');
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleCreateNew = () => {
    setEditingReport(null);
    setViewingReport(null);
    setCurrentView('form');
  };

  const handleEdit = (report: Report) => {
    setEditingReport(report);
    setCurrentView('form');
  };

  const handleView = (report: Report) => {
    setViewingReport(report);
    setCurrentView('preview');
  };

  const handleSave = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    let savedReport: Report;
    if (editingReport) {
      savedReport = { ...editingReport, ...reportData, updatedAt: new Date().toISOString() };
      setReports(reports.map(r => r.id === editingReport.id ? savedReport : r));
    } else {
      savedReport = {
        ...reportData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setReports([savedReport, ...reports]);
    }
    setViewingReport(savedReport);
    setCurrentView('preview');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('このレポートを削除してもよろしいですか？')) {
      setReports(reports.filter(r => r.id !== id));
      if (viewingReport?.id === id) {
        setCurrentView('list');
        setViewingReport(null);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--accent)] text-white p-2 rounded-xl shadow-sm">
            <FileText size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">商談レポート</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setCurrentView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${currentView === 'list' ? 'bg-[var(--border)]/50' : 'hover:bg-[var(--border)]/30'}`}
          >
            <List size={18} />
            <span className="text-sm font-medium hidden md:inline">一覧</span>
          </button>
          <button 
            onClick={handleCreateNew}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${currentView === 'form' && !editingReport ? 'bg-[var(--border)]/50' : 'hover:bg-[var(--border)]/30'}`}
          >
            <Plus size={18} />
            <span className="text-sm font-medium hidden md:inline">新規作成</span>
          </button>
          <div className="w-px h-6 bg-[var(--border)] mx-1 md:mx-2"></div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-[var(--border)]/30 transition-colors text-[var(--accent)]"
            aria-label="テーマ切り替え"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-10 max-w-5xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard reports={reports} onView={handleView} onCreateNew={handleCreateNew} onDelete={handleDelete} />
            </motion.div>
          ) : currentView === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ReportForm 
                initialData={editingReport || emptyReport} 
                onSave={handleSave} 
                onCancel={() => {
                  if (viewingReport) {
                    setCurrentView('preview');
                  } else {
                    setCurrentView('list');
                  }
                }} 
              />
            </motion.div>
          ) : viewingReport ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ReportPreview 
                report={viewingReport} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                onBack={() => setCurrentView('list')} 
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Dashboard({ reports, onView, onCreateNew, onDelete }: { reports: Report[], onView: (r: Report) => void, onCreateNew: () => void, onDelete: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter(r => 
    r.clientName.includes(searchQuery) || r.summary.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">商談一覧</h2>
          <p className="text-[var(--text-muted)]">最近の商談記録を管理・確認できます</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-[var(--accent)] text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
        >
          <Plus size={20} />
          新規レポート作成
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
        <input 
          type="text" 
          placeholder="お客様名や内容で検索..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-sm"
        />
      </div>

      {filteredReports.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-[var(--bg)] p-4 rounded-full mb-4">
            <Search className="text-[var(--text-muted)]" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">レポートがまだありません</h3>
          <p className="text-[var(--text-muted)] mb-6 max-w-md">
            新しい商談レポートを作成して、記録を始めましょう。
          </p>
          <button 
            onClick={onCreateNew}
            className="border border-[var(--border)] px-6 py-2 rounded-full font-medium hover:bg-[var(--bg)] transition-colors"
          >
            レポートを作成する
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map(report => (
            <div key={report.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => onView(report)}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[var(--bg)] text-[var(--text-muted)] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Calendar size={12} />
                    {report.date || '日付未設定'}
                  </span>
                  <span className="bg-[var(--bg)] text-[var(--text-muted)] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Clock size={12} />
                    {report.startTime || '--:--'} - {report.endTime || '--:--'}
                  </span>
                  <span className="bg-[var(--bg)] text-[var(--text-muted)] px-3 py-1 rounded-full text-xs font-medium">
                    {report.meetingMethod}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{report.clientName || '名前未設定'} 様</h3>
                <p className="text-[var(--text-muted)] text-sm line-clamp-2">{report.summary || '概要なし'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(report.id); }}
                  className="p-3 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  aria-label="削除"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReportForm({ initialData, onSave, onCancel }: { initialData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>, onSave: (data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(initialData);
  const [memo, setMemo] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '01': true,
    '02': true,
    '03': true,
    '04': true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAIAnalyze = async () => {
    if (!memo.trim() && selectedFiles.length === 0) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const parts: any[] = [];
      
      for (const file of selectedFiles) {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result.split(',')[1]);
            } else {
              reject(new Error('Failed to convert file'));
            }
          };
          reader.onerror = error => reject(error);
        });
        
        // ファイル拡張子からMIMEタイプを推測（特に音声ファイル用）
        let mimeType = file.type;
        if (!mimeType || mimeType === 'application/octet-stream') {
          const ext = file.name.split('.').pop()?.toLowerCase();
          switch (ext) {
            case 'mp3': mimeType = 'audio/mpeg'; break;
            case 'wav': mimeType = 'audio/wav'; break;
            case 'm4a': mimeType = 'audio/m4a'; break;
            case 'ogg': mimeType = 'audio/ogg'; break;
            case 'flac': mimeType = 'audio/flac'; break;
            case 'aac': mimeType = 'audio/aac'; break;
            case 'amr': mimeType = 'audio/amr'; break;
            case 'wma': mimeType = 'audio/x-ms-wma'; break;
            case 'mp4': mimeType = 'video/mp4'; break;
            case 'mov': mimeType = 'video/quicktime'; break;
            case 'pdf': mimeType = 'application/pdf'; break;
            case 'txt': mimeType = 'text/plain'; break;
            case 'csv': mimeType = 'text/csv'; break;
            default: mimeType = mimeType || 'text/plain';
          }
        }

        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }
      
      let promptText = `あなたは保険代理店の営業事務アシスタントです。
提供されたテキスト（商談の書き起こしやメモ）から、指定された商談種別に基づいて、保険業法に準拠した形式で情報を抽出し、JSON形式で出力してください。

【最重要事項】
どの商談種別であっても、顧客のご要望や意向がどのように形成され、どのように変化したか（意向の変化とその理由）を必ず詳細に抽出してください。
変化がない場合でも、その旨を確認したプロセスを記録してください。

【重要な指示】
1. 読みやすさのため、箇条書きの項目（「・」や「1.」「①」など）がある場合は、必ずその前で改行を入れてください。
2. 不明な項目は「詳細未記載につき省略」としてください。
3. 最重要： specialNotes（特記事項）フィールドには「意向の変化とその理由」を必ず詳細に記録してください。変化がない場合でも、その旨を確認したプロセスを記録してください。

【ご相談内容の概要 (summary) の出力指示】
レポート全体の要約を作成し、\`summary\` フィールドに出力してください。

【詳細レポート (details) の出力指示】
以下のフォーマットに従って、商談結果を時系列順かつ詳細に記録し、\`details\` フィールドにテキストとして出力してください。
※出力時は、レポートが読みやすくなるように適度に改行を入れてください。

${PROMPTS[formData.meetingType] || PROMPTS['新規商談＆ヒアリング']}
`;
      if (memo.trim()) {
        promptText += `\n\n【商談メモ】\n${memo}`;
      }
      
      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "YYYY-MM-DD形式" },
              startTime: { type: Type.STRING, description: "HH:MM形式" },
              endTime: { type: Type.STRING, description: "HH:MM形式" },
              clientName: { type: Type.STRING },
              meetingMethod: { type: Type.STRING, description: "オンライン、対面など" },
              location: { type: Type.STRING },
              summary: { type: Type.STRING, description: "レポートの全体要約" },
              details: { type: Type.STRING, description: "指定された出力用フォーマットに従ったレポート全文（適度に改行を含めて読みやすくすること）" },
              selfIntro: { type: Type.STRING },
              authority: { type: Type.STRING },
              solicitationPolicy: { type: Type.STRING },
              recommendationReason: { type: Type.STRING },
              fdDeclaration: { type: Type.STRING },
              privacyPolicy: { type: Type.STRING },
              deathBenefit: { type: Type.STRING },
              medicalBenefit: { type: Type.STRING },
              disabilityBenefit: { type: Type.STRING },
              assetFormation: { type: Type.STRING },
              existingInsurance: { type: Type.STRING },
              specialNotes: { type: Type.STRING, description: "特記事項（意向の変化とその理由を必ず詳細に記録。変化がない場合でも確認プロセスを記録）" },
              otherRequests: { type: Type.STRING },
            }
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      setFormData(prev => ({ ...prev, ...result }));
      
      // Expand all sections to show the filled data
      setExpandedSections({
        '01': true,
        '02': true,
        '03': true,
        '04': true,
      });
    } catch (error) {
      console.error("AI Analysis failed:", error);
      // alert is blocked in iframe, use console or custom modal in real app.
      console.error("AI分析に失敗しました。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 hover:bg-[var(--border)]/30 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">新規レポート作成</h2>
          <p className="text-[var(--text-muted)]">商談の詳細を入力してください</p>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="bg-[#F0F7FF] dark:bg-[#0A1929] border border-[#B6D8FF] dark:border-[#1E3A5F] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-[var(--accent)]">
          <Wand2 size={24} />
          <h3 className="text-xl font-bold">AI自動入力アシスタント</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">商談種別</label>
            <div className="relative">
              <select 
                value={formData.meetingType || '新規商談＆ヒアリング'} 
                onChange={e => handleChange('meetingType', e.target.value)}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all appearance-none"
              >
                <option>新規商談＆ヒアリング</option>
                <option>提案・クロージング</option>
                <option>ご契約手続き</option>
                <option>保全・見直し</option>
                <option>損害保険関連</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={16} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">データ投入（テキスト・音声）</label>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="audio/*,video/*,image/*,text/*,application/pdf,.m4a,.mp3,.wav,.ogg,.flac,.aac,.amr,.wma"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                }
              }}
            />
            <label
              htmlFor="file-upload"
              className="w-full bg-[var(--card)] border border-[var(--border)] border-dashed rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-[var(--bg)] transition-colors text-[var(--text-muted)] cursor-pointer"
            >
              <FileText size={18} />
              ファイルを選択（複数可）
            </label>
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-sm text-[var(--text-muted)] flex items-center gap-2 bg-[var(--bg)] p-2 rounded-lg border border-[var(--border)]">
                    <FileText size={14} className="flex-shrink-0" />
                    <span className="truncate flex-1">{file.name}</span>
                    <button 
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">メモ・書き起こしテキスト</label>
          <textarea 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="ここにメモをペーストするか、ファイルをドロップしてください"
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-y"
          ></textarea>
        </div>

        <button 
          onClick={handleAIAnalyze}
          disabled={isAnalyzing || (!memo.trim() && selectedFiles.length === 0)}
          className="w-full bg-[#60A5FA] hover:bg-[#3B82F6] disabled:bg-[#93C5FD] dark:disabled:bg-[#1E3A5F] disabled:cursor-not-allowed text-white rounded-xl px-6 py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          {isAnalyzing ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <Wand2 size={20} />
          )}
          {isAnalyzing ? '分析中...' : 'AI分析を実行して自動入力'}
        </button>

        <div className="mt-4 flex items-start gap-2 text-sm text-[var(--text-muted)]">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>音声ファイルをアップロードすると、自動的に文字起こしと分析が行われます。（※現在はテキスト入力のみ対応）</p>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        <Section title="01 基本情報" id="01" expanded={expandedSections['01']} onToggle={() => toggleSection('01')}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">面談日</label>
              <input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all dark:[color-scheme:dark]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">開始時間</label>
                <input type="time" value={formData.startTime} onChange={e => handleChange('startTime', e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all dark:[color-scheme:dark]" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">終了時間</label>
                <input type="time" value={formData.endTime} onChange={e => handleChange('endTime', e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all dark:[color-scheme:dark]" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">面談相手（様）</label>
              <input type="text" value={formData.clientName} onChange={e => handleChange('clientName', e.target.value)} placeholder="山田 太郎" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">面談方法</label>
              <div className="relative">
                <select value={formData.meetingMethod} onChange={e => handleChange('meetingMethod', e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all appearance-none">
                  <option>オンライン</option>
                  <option>対面</option>
                  <option>電話</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={16} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">場所詳細（任意）</label>
              <input type="text" value={formData.location} onChange={e => handleChange('location', e.target.value)} placeholder="Zoom URL / 〇〇カフェ 新宿店" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">ご相談内容の概要</label>
              <textarea value={formData.summary} onChange={e => handleChange('summary', e.target.value)} placeholder="ライフプランの見直しについて..." className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-y"></textarea>
            </div>
          </div>
        </Section>

        <Section title="02 詳細レポート" id="02" expanded={expandedSections['02']} onToggle={() => toggleSection('02')}>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">レポート本文</label>
              <textarea 
                value={formData.details || ''} 
                onChange={e => handleChange('details', e.target.value)} 
                placeholder="商談の詳細な内容がここに入力されます..."
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-y font-mono text-sm leading-relaxed"
              ></textarea>
            </div>
          </div>
        </Section>

        {/* 互換性のため、古いフィールドにデータがある場合のみ表示するか、新規商談の場合は表示する */}
        {(formData.selfIntro || formData.meetingType === '新規商談＆ヒアリング') && (
          <Section title="03 商談前説明事項（従来フォーマット）" id="03" expanded={expandedSections['03']} onToggle={() => toggleSection('03')}>
            <div className="grid md:grid-cols-2 gap-6">
              <TextInput label="自己紹介・会社概要" value={formData.selfIntro || ''} onChange={v => handleChange('selfIntro', v)} />
              <TextInput label="権限明示" value={formData.authority || ''} onChange={v => handleChange('authority', v)} />
              <TextInput label="勧誘方針" value={formData.solicitationPolicy || ''} onChange={v => handleChange('solicitationPolicy', v)} />
              <TextInput label="推奨会社選定理由" value={formData.recommendationReason || ''} onChange={v => handleChange('recommendationReason', v)} />
              <TextInput label="FD宣言" value={formData.fdDeclaration || ''} onChange={v => handleChange('fdDeclaration', v)} />
              <TextInput label="プライバシーポリシー" value={formData.privacyPolicy || ''} onChange={v => handleChange('privacyPolicy', v)} />
            </div>
          </Section>
        )}

        {(formData.deathBenefit || formData.meetingType === '新規商談＆ヒアリング') && (
          <Section title="04 各保障ごとのご要望（従来フォーマット）" id="04" expanded={expandedSections['04']} onToggle={() => toggleSection('04')}>
            <div className="space-y-6">
              <TextAreaInput label="① 死亡保障について" value={formData.deathBenefit || ''} onChange={v => handleChange('deathBenefit', v)} />
              <TextAreaInput label="② 医療保障について" value={formData.medicalBenefit || ''} onChange={v => handleChange('medicalBenefit', v)} />
              <TextAreaInput label="③ 就業不能保障について" value={formData.disabilityBenefit || ''} onChange={v => handleChange('disabilityBenefit', v)} />
              <TextAreaInput label="④ 資産形成について" value={formData.assetFormation || ''} onChange={v => handleChange('assetFormation', v)} />
            </div>
          </Section>
        )}

        {(formData.existingInsurance || formData.meetingType === '新規商談＆ヒアリング') && (
          <Section title="05 その他・特記事項（従来フォーマット）" id="05" expanded={expandedSections['05']} onToggle={() => toggleSection('05')}>
            <div className="space-y-6">
              <TextAreaInput label="既存の加入保険の内容や保険料メモ" value={formData.existingInsurance || ''} onChange={v => handleChange('existingInsurance', v)} />
              <TextAreaInput label="ご意向を受けての特記事項" value={formData.specialNotes || ''} onChange={v => handleChange('specialNotes', v)} />
              <TextAreaInput label="その他ご要望" value={formData.otherRequests || ''} onChange={v => handleChange('otherRequests', v)} />
            </div>
          </Section>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg)]/80 backdrop-blur-md border-t border-[var(--border)] p-4 flex justify-center gap-4 z-20">
        <button onClick={onCancel} className="px-8 py-3 rounded-full font-medium border border-[var(--border)] hover:bg-[var(--border)]/30 transition-colors bg-[var(--card)]">
          キャンセル
        </button>
        <button onClick={() => onSave(formData)} className="px-12 py-3 rounded-full font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors shadow-md">
          レポートを保存
        </button>
      </div>
    </div>
  );
}

function Section({ title, id, expanded, onToggle, children }: { title: string, id: string, expanded: boolean, onToggle: () => void, children: React.ReactNode }) {
  const [num, ...rest] = title.split(' ');
  return (
    <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-sm">
      <button 
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-[var(--bg)]/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="bg-[#EBF5FF] dark:bg-[#1A365D] text-[var(--accent)] px-3 py-1 rounded-lg font-bold text-sm">
            {num}
          </span>
          <h3 className="text-xl font-bold">{rest.join(' ')}</h3>
        </div>
        {expanded ? <ChevronUp className="text-[var(--text-muted)]" /> : <ChevronDown className="text-[var(--text-muted)]" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 border-t border-[var(--border)]/50 mt-2">
              <div className="pt-4">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder="詳細未記載につき省略"
        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" 
      />
    </div>
  );
}

function TextAreaInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">{label}</label>
      <textarea 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder="詳細未記載につき省略"
        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-y"
      ></textarea>
    </div>
  );
}

function ReportPreview({ report, onEdit, onDelete, onBack }: { report: Report, onEdit: (r: Report) => void, onDelete: (id: string) => void, onBack: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = report.details ? report.details : `
【商談レポート】
顧客名: ${report.clientName}様
日時: ${report.date} ${report.startTime}-${report.endTime}
場所: ${report.location} (${report.meetingMethod})

■ご相談内容の概要
${report.summary}

■ご要望詳細
${report.otherRequests}

■その他特記事項
${report.specialNotes}

■事前説明確認
自己紹介・会社概要: ${report.selfIntro ? '済' : '未'}
権限明示: ${report.authority ? '済' : '未'}
勧誘方針: ${report.solicitationPolicy ? '済' : '未'}
推奨会社選定理由: ${report.recommendationReason ? '済' : '未'}
FD宣言: ${report.fdDeclaration ? '済' : '未'}
プライバシーポリシー: ${report.privacyPolicy ? '済' : '未'}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-[var(--border)]/30 rounded-full transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold">{report.clientName}様</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {report.date} • {report.meetingMethod} • {report.meetingType || '新規商談＆ヒアリング'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onEdit(report)} className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--border)]/30 transition-colors font-medium">
            <Edit size={16} />
            編集
          </button>
          <button onClick={() => onDelete(report.id)} className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Text Output Banner */}
      <div className="bg-[#F0F7FF] dark:bg-[#1E293B] border border-[#E0F2FE] dark:border-[#334155] rounded-xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-[#0284C7] dark:text-[#38BDF8] font-bold text-lg mb-1">テキスト出力</h3>
          <p className="text-sm text-[var(--text-muted)]">金融庁ガイドライン準拠のフォーマットでコピーします</p>
        </div>
        <button 
          onClick={handleCopy} 
          className="bg-[#007AFF] hover:bg-[#0062CC] text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
        >
          {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          {copied ? 'コピーしました' : 'クリップボードにコピー'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {report.details ? (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">詳細レポート</h3>
              <div className="text-[var(--text-primary)] whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {report.details}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">ご相談内容の概要</h3>
                <p className="text-[var(--text-primary)] whitespace-pre-wrap">{report.summary || '（未入力）'}</p>
              </div>
              
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">ご要望詳細</h3>
                <p className="text-[var(--text-primary)] whitespace-pre-wrap">{report.otherRequests || '（未入力）'}</p>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">その他特記事項</h3>
                <p className="text-[var(--text-primary)] whitespace-pre-wrap">{report.specialNotes || '（未入力）'}</p>
              </div>
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="font-bold text-[var(--text-muted)] text-sm mb-4 border-b border-[var(--border)] pb-2">商談詳細</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">日時</p>
                <p className="font-medium">{report.date} {report.startTime}-{report.endTime}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">場所</p>
                <p className="font-medium">{report.location || report.meetingMethod}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="font-bold text-[var(--text-muted)] text-sm mb-4 border-b border-[var(--border)] pb-2">事前説明確認</h3>
            
            <div className="space-y-3">
              <CheckItem label="自己紹介・会社概要" checked={!!report.selfIntro} />
              <CheckItem label="権限明示" checked={!!report.authority} />
              <CheckItem label="勧誘方針" checked={!!report.solicitationPolicy} />
              <CheckItem label="推奨会社選定理由" checked={!!report.recommendationReason} />
              <CheckItem label="FD宣言" checked={!!report.fdDeclaration} />
              <CheckItem label="プライバシーポリシー" checked={!!report.privacyPolicy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ label, checked }: { label: string, checked: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`rounded-full p-0.5 ${checked ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'}`}>
        <CheckCircle2 size={16} />
      </div>
      <span className={`text-sm ${checked ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{label}</span>
    </div>
  );
}
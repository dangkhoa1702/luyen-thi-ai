import React, { useState, useEffect, useMemo } from 'react';
import type { MockQuestion } from '../types';
import { generateMockTest } from '../services/geminiService';
import { labelOf } from '../profile/logic';

interface MockTestProps {
  subject: string | null;
  topic?: string | null;
}

// ==================================================================
// SECTION 1: PRACTICE LIBRARY (New Feature)
// ==================================================================

type LibraryQuestion = {
  id: string;
  text: string;
  choices: [string, string, string, string];
  answer?: 0 | 1 | 2 | 3;
};
type ExamSet = {
  id: string;
  title: string;
  subject: string;
  year: number;
  questions: LibraryQuestion[];
};

const DEMO_SETS: ExamSet[] = [
  {
    id: "toan-2024-de1",
    title: "Toán – Đề Thi Thử Sở GD Hà Nội 2024",
    subject: "toan",
    year: 2024,
    questions: [
      { id: "q1", text: "Rút gọn biểu thức P = √16 + √9.", choices: ["P = 5", "P = 7", "P = 12", "P = 25"], answer: 1, },
      { id: "q2", text: "Trong mặt phẳng tọa độ Oxy, đường thẳng y = 2x - 3 đi qua điểm nào?", choices: ["(1, -1)", "(2, 2)", "(0, 3)", "(-1, 1)"], answer: 0, },
      { id: "q3", text: "Hệ phương trình {x + y = 5; x - y = 1} có nghiệm là:", choices: ["(2, 3)", "(4, 1)", "(3, 2)", "(1, 4)"], answer: 2, },
    ],
  },
  {
    id: "anh-2023-de2",
    title: "Tiếng Anh – Đề Chuyên Amsterdam 2023",
    subject: "tieng-anh",
    year: 2023,
    questions: [
      { id: "q1", text: "Choose the word with the underlined part pronounced differently.", choices: ["book", "food", "look", "good"], answer: 1, },
      { id: "q2", text: "She ______ to school every day.", choices: ["go", "goes", "went", "going"], answer: 1, },
    ],
  },
  {
    id: "van-2024-de3",
    title: "Ngữ Văn – Đề Thi Thử TPHCM 2024",
    subject: "ngu-van",
    year: 2024,
    questions: [
        { id: "q1", text: "Phương thức biểu đạt chính của đoạn trích sau là gì? 'Trời xanh thẳm, biển cũng thẳm xanh, như dâng cao lên, chắc nịch.'", choices: ["Tự sự", "Miêu tả", "Biểu cảm", "Nghị luận"], answer: 1, },
        { id: "q2", text: "Tác phẩm 'Lặng lẽ Sa Pa' của tác giả nào?", choices: ["Kim Lân", "Nguyễn Thành Long", "Nguyễn Quang Sáng", "Nguyễn Minh Châu"], answer: 1, },
    ]
  }
];

function ExamPlayer({ set, onClose }: { set: ExamSet; onClose: () => void; }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  const q = set.questions[current];
  const correctCount = useMemo(() => {
    if (!submitted) return 0;
    return set.questions.reduce((sum, it) => {
      const a = answers[it.id];
      return sum + (a !== undefined && a === it.answer ? 1 : 0);
    }, 0);
  }, [submitted, answers, set.questions]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-2xl p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{set.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Câu {current + 1}/{set.questions.length}</p>
          </div>
          <button className="px-3 py-1 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={onClose}>Đóng</button>
        </div>

        <div className="mt-4">
          <div className="font-medium mb-3 text-lg">{q.text}</div>
          <div className="space-y-2">
            {q.choices.map((c, idx) => {
              const chosen = answers[q.id] === idx;
              let bgColor = "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600";
              let borderColor = "border-gray-200 dark:border-gray-600";
              if (submitted) {
                if (q.answer === idx) {
                  bgColor = "bg-green-100 dark:bg-green-900/40";
                  borderColor = "border-green-400 dark:border-green-600";
                } else if (chosen && q.answer !== idx) {
                  bgColor = "bg-red-100 dark:bg-red-900/40";
                  borderColor = "border-red-400 dark:border-red-600";
                }
              } else if (chosen) {
                borderColor = "border-blue-500";
              }
              return (
                <button
                  key={idx}
                  onClick={() => !submitted && setAnswers((s) => ({ ...s, [q.id]: idx }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${bgColor} ${borderColor} ${submitted ? 'cursor-default' : ''}`}
                >
                  <span className="mr-3 font-mono font-bold text-blue-600 dark:text-blue-400">{ "ABCD"[idx] }</span> {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg border dark:border-gray-600 disabled:opacity-50" disabled={current === 0} onClick={() => setCurrent(i => Math.max(0, i - 1))}>← Trước</button>
            <button className="px-3 py-2 rounded-lg border dark:border-gray-600 disabled:opacity-50" disabled={current === set.questions.length - 1} onClick={() => setCurrent(i => Math.min(set.questions.length - 1, i + 1))}>Sau →</button>
          </div>

          {!submitted ? (
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors" onClick={() => setSubmitted(true)}>Nộp bài</button>
          ) : (
            <div className="text-lg font-bold">Điểm: <span className="text-green-600">{correctCount}</span>/{set.questions.length}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function LibraryPanel() {
  const [subject, setSubject] = useState("all");
  const [year, setYear] = useState<number | "all">("all");
  const [q, setQ] = useState("");
  const [playing, setPlaying] = useState<ExamSet | null>(null);

  const years = useMemo(() => Array.from(new Set(DEMO_SETS.map(s => s.year))).sort((a, b) => b - a), []);
  const subjects = useMemo(() => Array.from(new Set(DEMO_SETS.map(s => s.subject))), []);

  const filtered = DEMO_SETS.filter(s =>
    (subject === "all" || s.subject === subject) &&
    (year === "all" || s.year === year) &&
    (q.trim() === "" || s.title.toLowerCase().includes(q.trim().toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border dark:border-gray-700">
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full md:w-auto border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="all">Tất cả môn</option>
          {subjects.map(s => <option key={s} value={s}>{labelOf(s)}</option>)}
        </select>
        <select value={year as any} onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))} className="w-full md:w-auto border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="all">Tất cả năm</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên đề…" className="w-full md:flex-1 border dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="p-4 rounded-2xl border dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 flex flex-col">
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Năm {s.year} • {s.questions.length} câu</div>
            <div className="mt-4 flex-grow flex items-end">
              <button className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors" onClick={() => setPlaying(s)}>Làm ngay</button>
            </div>
          </li>
        ))}
         {filtered.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-8 col-span-full">Không tìm thấy bộ đề nào phù hợp.</p>}
      </div>

      {playing && <ExamPlayer set={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}

// ==================================================================
// SECTION 2: SMART PRACTICE (Old MockTest.tsx)
// ==================================================================

const SmartPracticePanel: React.FC<MockTestProps> = ({ subject, topic }) => {
    const [localSelectedSubject, setLocalSelectedSubject] = useState<string | null>(subject);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [activeQuestions, setActiveQuestions] = useState<MockQuestion[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [numQuestions, setNumQuestions] = useState(5);

    useEffect(() => {
        setLocalSelectedSubject(subject);
        setActiveQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setGenerationError(null);
    }, [subject, topic]);

    const handleGenerateTest = async () => {
        if (!localSelectedSubject) return;
        setIsGenerating(true);
        setGenerationError(null);
        try {
            const questions = await generateMockTest(localSelectedSubject, numQuestions, topic);
            if (questions && questions.length > 0) {
                setActiveQuestions(questions.map(q => ({ ...q, userAnswer: undefined })));
            } else {
                setGenerationError("Rất tiếc, AI không thể tạo đề thi vào lúc này. Vui lòng thử lại sau hoặc chọn môn khác.");
            }
        } catch (error) {
             setGenerationError("Đã xảy ra lỗi khi tạo đề. Vui lòng kiểm tra lại API Key và thử lại.");
        }
        setIsGenerating(false);
    };

    const handleAnswer = (option: string) => {
        if (activeQuestions[currentQuestionIndex].userAnswer) return;
        const newQuestions = [...activeQuestions];
        const currentQ = newQuestions[currentQuestionIndex];
        currentQ.userAnswer = option;
        
        if (option === currentQ.answer) {
            setScore(prevScore => prevScore + 1);
        }
        setActiveQuestions(newQuestions);

        setTimeout(() => {
            const nextQuestion = currentQuestionIndex + 1;
            if (nextQuestion < activeQuestions.length) {
                setCurrentQuestionIndex(nextQuestion);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };
    
    const handleBackToSelection = () => {
        setLocalSelectedSubject(null);
        setActiveQuestions([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setGenerationError(null);
    }

    if (showResult) {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center h-full">
                <h2 className="text-3xl font-bold mb-2">Hoàn thành bài thi môn {localSelectedSubject}!</h2>
                <p className="text-xl mb-6">Bạn đã trả lời đúng <span className="font-bold text-green-500">{score}</span> trên <span className="font-bold">{activeQuestions.length}</span> câu!</p>
                <button onClick={handleBackToSelection} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Chọn môn khác</button>
            </div>
        )
    }

    if (activeQuestions.length > 0) {
        const currentQuestion = activeQuestions[currentQuestionIndex];
        return (
            <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                 <h2 className="text-2xl font-bold mb-4 text-center">Đề thi thông minh - Môn {localSelectedSubject}{topic ? ` - ${topic}`: ''}</h2>
                <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Câu hỏi {currentQuestionIndex + 1}/{activeQuestions.length}</p>
                    <h3 className="text-xl font-semibold mt-2">{currentQuestion.question}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
                         const isSelected = currentQuestion.userAnswer === option;
                         const isCorrect = currentQuestion.answer === option;
                         
                         let buttonClass = 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/50';
                         if (currentQuestion.userAnswer) {
                             if (isCorrect) {
                                 buttonClass = 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-white border-green-400';
                             } else if (isSelected && !isCorrect) {
                                 buttonClass = 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-white border-red-400';
                             } else {
                                buttonClass = 'bg-gray-100 dark:bg-gray-700 opacity-60';
                             }
                         }
                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                disabled={!!currentQuestion.userAnswer}
                                className={`w-full text-left p-4 rounded-lg transition-all duration-300 border-2 border-transparent ${buttonClass} disabled:cursor-not-allowed`}
                            >
                                {option}
                            </button>
                        )
                    })}
                </div>
                 {currentQuestion.userAnswer && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-yellow-400">
                        <p className="font-bold text-yellow-800 dark:text-yellow-300">Giải thích:</p>
                        <p className="text-sm text-yellow-900 dark:text-yellow-200">{currentQuestion.explanation}</p>
                    </div>
                )}
            </div>
        );
    }
    
    if (localSelectedSubject) {
        return (
            <div className="relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center h-full">
                <div className="absolute top-4 left-4">
                    <button onClick={handleBackToSelection} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span>Chọn môn khác</span>
                    </button>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                <h2 className="text-3xl font-bold mb-2">Tạo đề thi thông minh</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg">
                    {topic 
                        ? <>AI sẽ tạo một bộ đề thi môn <span className="font-semibold">{localSelectedSubject}</span>, tập trung vào chủ đề <span className="font-semibold">{topic}</span>.</>
                        : <>AI sẽ tạo một bộ đề thi mới môn <span className="font-semibold">{localSelectedSubject}</span> dành riêng cho bạn.</>
                    }
                </p>
                
                <div className="mb-6">
                    <label htmlFor="num-questions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Số lượng câu hỏi:</label>
                    <input
                        type="number"
                        id="num-questions"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value, 10))))}
                        className="w-48 p-2 text-center border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                        min="1"
                        max="20"
                    />
                </div>

                <button
                    onClick={handleGenerateTest}
                    disabled={isGenerating}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center justify-center"
                >
                    {isGenerating && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isGenerating ? 'Đang tạo đề...' : 'Bắt đầu tạo đề'}
                </button>

                {generationError && <p className="text-red-500 mt-4 max-w-md">{generationError}</p>}
            </div>
        );
    }

    // FIX: Define the 'subjects' array to be used for rendering the selection grid.
    const subjectIconClasses = "h-8 w-8 opacity-80";
    const subjects = [
        { name: 'Toán', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>, gradient: 'bg-gradient-to-br from-blue-500 to-blue-600' },
        { name: 'Ngữ văn', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, gradient: 'bg-gradient-to-br from-red-500 to-red-600' },
        { name: 'Tiếng Anh', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m4 0h6M17 3v2M4 21h16a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1v13a1 1 0 001 1z" /></svg>, gradient: 'bg-gradient-to-br from-green-500 to-green-600' },
        { name: 'Vật lí', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.22 15.5h13.56l-4.03-5.091a2.25 2.25 0 01-.5-1.591V3.104a2.25 2.25 0 00-3.262-2.121L12 2.1l-1.238-.817A2.25 2.25 0 009.75 3.104zM12 15.5h.01" /></svg>, gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
        { name: 'Hoá học', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 5.25a3 3 0 013 3v10.5a3 3 0 01-3 3h-4.5a3 3 0 01-3-3V8.25a3 3 0 013-3h4.5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 8.25h-4.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15.75h.008v.008H12v-.008z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 16.5A.75.75 0 013 15.75V9a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6.75a.75.75 0 01-.75.75h-1.5z" /></svg>, gradient: 'bg-gradient-to-br from-purple-500 to-purple-600' },
        { name: 'Sinh học', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L12 15l5.571-3M6.429 9.75L12 6.75l5.571 3" /></svg>, gradient: 'bg-gradient-to-br from-teal-500 to-teal-600' },
        { name: 'Lịch sử', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, gradient: 'bg-gradient-to-br from-orange-500 to-orange-600' },
        { name: 'Địa lí', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V3m0 0l-4 4M9 3l4 4M15 21V3m0 0l-4 4m4-4l4 4" /></svg>, gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-600' },
        { name: 'Tin học', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25" /></svg>, gradient: 'bg-gradient-to-br from-gray-700 to-gray-800' },
        { name: 'Tiếng Pháp', icon: <svg xmlns="http://www.w3.org/2000/svg" className={subjectIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
    ];
    return (
        <div>
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Luyện đề thi thông minh</h2>
             <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Vui lòng chọn một môn học để AI tạo đề thi cho bạn.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {subjects.map(s => (
                    <button
                        key={s.name}
                        onClick={() => setLocalSelectedSubject(s.name)}
                        className={`relative p-4 rounded-2xl shadow-lg text-center w-full text-white overflow-hidden ${s.gradient} flex flex-col justify-center items-center min-h-[120px] transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-400`}
                    >
                        <div className="mb-2">{s.icon}</div>
                        <span className="font-bold text-base">{s.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};


// ==================================================================
// MAIN COMPONENT WRAPPER (with tabs)
// ==================================================================
export const MockTest: React.FC<MockTestProps> = ({ subject, topic }) => {
  const [tab, setTab] = useState<'library' | 'smart'>('smart');

  useEffect(() => {
    // If navigating from Dashboard/Profile with a subject, auto-select the smart tab
    if (subject) {
      setTab('smart');
    }
  }, [subject, topic]);

  const tabButtonStyle = (isActive: boolean) =>
    `px-4 py-2 rounded-xl border font-semibold transition-colors ${
      isActive
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div className="flex flex-wrap gap-2 mb-6">
        <button className={tabButtonStyle(tab === 'smart')} onClick={() => setTab('smart')}>
          ✨ Luyện đề thông minh
        </button>
        <button className={tabButtonStyle(tab === 'library')} onClick={() => setTab('library')}>
          🗂️ Luyện đề có sẵn
        </button>
      </div>

      <div style={{ display: tab === 'smart' ? 'block' : 'none' }}>
        <SmartPracticePanel subject={subject} topic={topic} />
      </div>

      {tab === 'library' && <LibraryPanel />}
    </div>
  );
};
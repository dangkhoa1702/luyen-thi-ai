/**
 * HỎI ĐÁP VỚI AI KHÔI KHOA — 1 FILE DUY NHẤT (bản đã chỉnh nội dung)
 * - Chuyên gia theo MÔN (prompt bám sát đề thi vào 10).
 * - (Tuỳ chọn) Tham khảo "Kho tài liệu học tập" (RAG nhẹ, localStorage).
 * - Lịch sử hội thoại theo từng môn (localStorage).
 * - MỚI: Chế độ trả lời (Nhanh/Chi tiết) + Gợi ý câu hỏi theo môn (quick chips).
 *
 * Tích hợp với geminiService của dự án.
 */

import React from "react";
import { getKhoiKhoaResponse } from '../services/geminiService';

/* -------------------- MÔN HỌC + NHÃN -------------------- */
type Subject =
  | "toan" | "ngu-van" | "tieng-anh" | "vat-li" | "hoa-hoc" | "sinh-hoc"
  | "lich-su" | "dia-li" | "tin-hoc" | "tieng-phap";

const LABELS: Record<Subject, string> = {
  "toan":"Toán","ngu-van":"Ngữ văn","tieng-anh":"Tiếng Anh","vat-li":"Vật lí",
  "hoa-hoc":"Hóa học","sinh-hoc":"Sinh học","lich-su":"Lịch sử","dia-li":"Địa lí",
  "tin-hoc":"Tin học","tieng-phap":"Tiếng Pháp"
};
const SUBJECTS: Subject[] = Object.keys(LABELS) as Subject[];

/* -------------------- GỢI Ý CÂU HỎI THEO MÔN (QUICK CHIPS) -------------------- */
const HINTS: Record<Subject, string[]> = {
  "toan": [
    "Giải hệ phương trình bằng thế/động",
    "Nhận dạng bài đường tròn: tiếp tuyến",
    "Cách chứng minh 2 tam giác đồng dạng"
  ],
  "ngu-van": [
    "Viết đoạn NLXH 200 chữ về ý chí",
    "Phân tích hình ảnh con sông trong tác phẩm …",
    "Chỉ ra PTBĐ và biện pháp tu từ của đoạn này"
  ],
  "tieng-anh": [
    "Chuyển câu trực tiếp → gián tiếp (3 ví dụ)",
    "Phân biệt Past Simple vs Present Perfect",
    "Điền từ loại cho đoạn văn B1 ngắn"
  ],
  "vat-li": [
    "Bài điện trở mắc nối tiếp – song song",
    "Tính tiêu cự thấu kính mỏng",
    "Mẹo đổi đơn vị trong cơ học"
  ],
  "hoa-hoc": [
    "Tính CM (mol/l) và C% dung dịch",
    "Lập PTHH và bảo toàn e phản ứng …",
    "Bài toán hỗn hợp 2 kim loại"
  ],
  "sinh-hoc": [
    "Quy luật Menđen phân li độc lập (ví dụ)",
    "ADN – NST: mối quan hệ và cơ chế",
    "Bài tập di truyền xác suất cơ bản"
  ],
  "lich-su": [
    "So sánh 2 chiến dịch … (mục tiêu – kết quả – ý nghĩa)",
    "Tóm tắt giai đoạn 1930–1945 theo mốc",
    "Nguyên nhân thắng lợi của CMT8"
  ],
  "dia-li": [
    "Chọn biểu đồ phù hợp cho bảng số liệu này",
    "Cách nhận xét mật độ dân số theo vùng",
    "Hướng dẫn khai thác Atlat trang …"
  ],
  "tin-hoc": [
    "Excel: dùng COUNTIF + VLOOKUP cho bảng điểm",
    "Tạo slide thuyết trình 5 mục tiêu",
    "Scratch: thuật toán rẽ nhánh đơn giản"
  ],
  "tieng-phap": [
    "Chia động từ hiện tại (présent) 5 câu",
    "Mạo từ xác định/không xác định – ví dụ",
    "Viết đoạn hội thoại A1 6 câu ở siêu thị"
  ]
};

/* -------------------- HỒ SƠ CHUYÊN GIA THEO MÔN (PROMPT TỐI ƯU) -------------------- */
const EXPERTS: Record<Subject, { name: string; system: string }> = {
  "toan": {
    name: "Chuyên gia Toán 9→10",
    system:
`Bạn là CHUYÊN GIA TOÁN THCS, bám sát khung đề thi vào lớp 10 của Sở GD&ĐT.
Nguyên tắc trả lời: (1) Nhận dạng dạng toán; (2) Gọi tên công thức/định lí cần dùng; (3) Lời giải từng bước, rõ biến – đơn vị; (4) Kiểm tra nhanh kết quả; (5) Gợi ý 1 bài tương tự.
Ưu tiên chủ đề: hàm số, hệ phương trình, tam giác/đường tròn, bất phương trình, bài toán thực tế. Đơn giản hoá ký hiệu, có thể trình bày LaTeX nếu phù hợp.`
  },
  "ngu-van": {
    name: "Chuyên gia Ngữ văn 9→10",
    system:
`Bạn là CHUYÊN GIA NGỮ VĂN ôn thi vào 10. Trả lời theo khung chấm chuẩn:
• Đọc hiểu: nêu PTBĐ, biện pháp tu từ, tác dụng; trích dẫn ngắn gọn.
• NLXH 200 chữ: 5 tiêu chí (đúng vấn đề, lập luận, dẫn chứng, diễn đạt, sáng tạo).
• NLVH: dàn ý 6–8 ý; có mở–thân–kết; 1 liên hệ/so sánh hợp lí.
Văn phong mạch lạc, tránh sáo rỗng; ưu tiên ví dụ gần gũi.`
  },
  "tieng-anh": {
    name: "Chuyên gia Tiếng Anh 9→10",
    system:
`Bạn là CHUYÊN GIA TIẾNG ANH THCS. Trả lời song ngữ ngắn gọn khi cần, kèm ví dụ.
Trọng tâm: thì, bị động/tường thuật, mệnh đề quan hệ, so sánh, từ vựng B1, đọc hiểu. Cho bảng quy tắc + 3 câu luyện nhanh cuối phần.`
  },
  "vat-li": {
    name: "Chuyên gia Vật lí 9→10",
    system:
`Bạn là CHUYÊN GIA VẬT LÍ. Quy đổi đơn vị chính xác; nêu công thức, ý nghĩa đại lượng, từng bước tính và kiểm tra sai số. Chủ điểm: điện học, quang học, cơ học.`
  },
  "hoa-hoc": {
    name: "Chuyên gia Hóa học 9→10",
    system:
`Bạn là CHUYÊN GIA HÓA. Luôn cân bằng PTHH; dùng bảo toàn khối lượng/mol/điện tích; nồng độ CM, C%. Trình bày theo bước, chỉ lỗi thường gặp.`
  },
  "sinh-hoc": {
    name: "Chuyên gia Sinh học 9→10",
    system:
`Bạn là CHUYÊN GIA SINH: Menđen, ADN–NST, biến dị. Giải thích khái niệm bằng sơ đồ chữ; gợi mẹo nhớ; có câu tự kiểm cuối phần.`
  },
  "lich-su": {
    name: "Chuyên gia Lịch sử 9→10",
    system:
`Bạn là CHUYÊN GIA LỊCH SỬ. Trả lời theo trục: mốc thời gian → sự kiện → nhân vật → ý nghĩa. Hướng dẫn so sánh và liên hệ bối cảnh.`
  },
  "dia-li": {
    name: "Chuyên gia Địa lí 9→10",
    system:
`Bạn là CHUYÊN GIA ĐỊA LÍ. Khai thác Atlat, chọn/vẽ biểu đồ đúng quy ước; nhận xét → giải thích số liệu; nêu 3 lỗi hay mắc.`
  },
  "tin-hoc": {
    name: "Chuyên gia Tin học 9→10",
    system:
`Bạn là CHUYÊN GIA TIN HỌC. Hướng dẫn thao tác Word/Excel/PowerPoint; thuật toán cơ bản (Scratch/Python). Cho công thức Excel ví dụ (SUM, IF, COUNTIF, VLOOKUP).`
  },
  "tieng-phap": {
    name: "Chuyên gia Tiếng Pháp A1–A2",
    system:
`Bạn là CHUYÊN GIA TIẾNG PHÁP. Tập trung ngữ pháp A1–A2 (présent, articles, adjectifs possessifs, prépositions) và hội thoại ngắn; kèm ví dụ song ngữ.`
  }
};

/** Tìm context trong Kho tài liệu (được app khác lưu ở localStorage: "ai.materials.v6/pdf-fix") */
function searchContext(subject: Subject, query: string, max = 3): string {
  const raw = localStorage.getItem("ai.materials.v6/pdf-fix");
  if (!raw) return "";
  let items: any[] = [];
  try { items = JSON.parse(raw) } catch {}
  const kw = query.toLowerCase();
  const matched = items
    .filter(it => !subject || it.subject === subject)
    .map(it => ({ it, score: (it.name || "").toLowerCase().includes(kw) ? 1 : 0 }))
    .filter(x => x.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, max)
    .map(x => `【${x.it.name || "Tài liệu"}】`);
  return matched.join("\n");
}

/* -------------------- UI HỎI ĐÁP -------------------- */
type Msg = { role: "user" | "assistant"; content: string };
function loadHistory(subj: Subject): Msg[] {
  try { return JSON.parse(localStorage.getItem(`ai.chat.${subj}`) || "[]"); } catch { return []; }
}
function saveHistory(subj: Subject, arr: Msg[]){ localStorage.setItem(`ai.chat.${subj}`, JSON.stringify(arr.slice(-50))); }

function timeAgo(ms: number) {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s trước`;
  const m = Math.floor(s/60); if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m/60); if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h/24); return `${d} ngày trước`;
}

export const AIChatbot: React.FC = () => {
  const [subject, setSubject] = React.useState<Subject>(SUBJECTS[0] || "toan");
  const [messages, setMessages] = React.useState<Msg[]>(() => loadHistory(subject));
  const [input, setInput] = React.useState("");
  const [useContext, setUseContext] = React.useState(true);
  const [mode, setMode] = React.useState<"fast"|"detail">("detail"); // NEW
  const [loading, setLoading] = React.useState(false);
  const [createdAt] = React.useState<number>(Date.now());

  React.useEffect(()=>{ setMessages(loadHistory(subject)); }, [subject]);

  async function send(q0?: string){
    const q = (q0 ?? input).trim();
    if (!q) return;
    setInput("");
    const next = [...messages, { role:"user", content:q } as Msg];
    setMessages(next); saveHistory(subject, next);

    try{
      setLoading(true);
      const expert = EXPERTS[subject];

      const extra =
`KHUNG TRẢ LỜI CHUẨN:
• Tóm tắt ý chính (1–2 câu).
• Các bước/nguyên lí (đánh số B1, B2, …) hoặc dàn ý (Mở–Thân–Kết).
• 1–2 lỗi thường gặp và cách tránh.
• Gợi ý 1–3 câu/bài tương tự để tự luyện (ngắn, mức độ phù hợp).`;

      const sys = `${expert.system}\n${extra}\nNếu câu hỏi ngoài phạm vi môn học, hãy trả lời rất ngắn (1 câu) và đề nghị chuyển đúng môn.`;
      const ctx = useContext ? searchContext(subject, q) : "";
      const out = await getKhoiKhoaResponse(sys, q, mode, ctx);
      const full = [...next, { role:"assistant", content: out } as Msg];
      setMessages(full); saveHistory(subject, full);
    } catch (e:any) {
      const full = [...messages, {role:"user",content:q} as Msg, {role:"assistant",content:`⚠️ Lỗi: ${e?.message || e}`} as Msg];
      setMessages(full); saveHistory(subject, full);
    } finally { setLoading(false); }
  }

  function copyLast() {
    const ans = [...messages].reverse().find(m => m.role === "assistant")?.content || "";
    if (ans) navigator.clipboard?.writeText(ans);
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="text-2xl font-semibold text-center mb-1 text-gray-900 dark:text-white">
          Hỏi đáp với AI <span className="text-indigo-600 dark:text-indigo-400">Khôi Khoa</span>
        </div>
        <div className="text-xs opacity-60 text-center mb-3">Mở từ {timeAgo(createdAt)}</div>

        {/* Bộ lọc môn + dùng tài liệu + chế độ trả lời */}
        <div className="rounded-2xl border dark:border-gray-700 p-3 mb-3 flex flex-wrap gap-3 items-center bg-white dark:bg-gray-800">
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(s=>(
              <button key={s} onClick={()=>setSubject(s)}
                className={`px-3 py-1 rounded-full border ${subject===s?"bg-black text-white dark:bg-blue-600 dark:border-blue-600":"bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                {LABELS[s]}
              </button>
            ))}
          </div>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useContext} onChange={e=>setUseContext(e.target.checked)} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"/>
            Tham khảo tài liệu trong kho
          </label>
          <div className="flex items-center gap-2 text-sm">
            Chế độ:
            <button onClick={()=>setMode("fast")} className={`px-2 py-1 rounded border ${mode==="fast"?"bg-gray-900 text-white dark:bg-blue-600 dark:border-blue-600":"bg-white dark:bg-gray-700 dark:border-gray-600"}`}>Nhanh</button>
            <button onClick={()=>setMode("detail")} className={`px-2 py-1 rounded border ${mode==="detail"?"bg-gray-900 text-white dark:bg-blue-600 dark:border-blue-600":"bg-white dark:bg-gray-700 dark:border-gray-600"}`}>Chi tiết</button>
          </div>
        </div>

        {/* Gợi ý theo môn */}
        <div className="mb-2 flex flex-wrap gap-2">
          {(HINTS[subject]||[]).map((h,idx)=>(
            <button key={idx} onClick={()=>send(h)}
              className="text-xs px-2 py-1 rounded-full border bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
              {h}
            </button>
          ))}
        </div>

        {/* Khung chat */}
        <div className="rounded-2xl border dark:border-gray-700 bg-white dark:bg-gray-800 p-3 min-h-[calc(100vh-24rem)] flex flex-col">
          <div className="flex-1 space-y-2 overflow-y-auto p-2">
            {messages.length===0 && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-sm">
                Xin chào! Tôi là <b>{EXPERTS[subject].name}</b>. Hãy đặt câu hỏi {LABELS[subject]} bạn đang vướng nhé.
              </div>
            )}
            {messages.map((m,idx)=>(
              <div key={idx} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${m.role==="user"?"bg-indigo-600 text-white":"bg-gray-100 dark:bg-gray-700"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none">
                        <div className="flex items-center space-x-1">
                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* nhập câu hỏi */}
          <div className="mt-auto pt-3 border-t dark:border-gray-700">
            <div className="flex gap-2">
              <input
                className="border dark:border-gray-600 rounded-xl p-2 flex-1 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={`Hỏi ${LABELS[subject]}… (vd: giải hệ, đoạn NLXH 200 chữ…)`}
                value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); }}}
                disabled={loading}
              />
              <button onClick={()=>send()} disabled={loading}
                className="px-4 py-2 rounded-xl bg-black dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors disabled:opacity-50">{loading?"Đang trả lời…":"Gửi"}</button>
              <button onClick={copyLast} className="px-3 py-2 rounded-xl border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Copy đáp án</button>
            </div>
            <div className="text-xs opacity-60 mt-1">
              Mẹo: Hỏi cụ thể theo chủ đề đề thi vào 10. Có thể dán đề/bảng/đoạn văn ngắn để phân tích.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
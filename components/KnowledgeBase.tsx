
/**
 * KIẾN THỨC ÔN THI VÀO LỚP 10 — THEO TỪNG MÔN (có KIẾN THỨC CƠ BẢN)
 * - Hiển thị chủ đề trọng tâm + kiến thức cốt lõi cho môn học được chọn.
 * - Tìm nhanh theo từ khóa; "Tóm tắt nhanh" (điểm nhớ) • "Kiến thức cơ bản" (mở rộng) • "Luyện ngay".
 * - Tích hợp vào App.tsx, nhận môn học qua props.
 */
import React, { useState, useEffect } from "react";

/* ===== Môn học & nhãn ===== */
type Subject =
  | "toan" | "ngu-van" | "tieng-anh" | "vat-li" | "hoa-hoc" | "sinh-hoc"
  | "lich-su" | "dia-li" | "tin-hoc" | "tieng-phap";

const LABELS: Record<Subject, string> = {
  "toan":"Toán","ngu-van":"Ngữ văn","tieng-anh":"Tiếng Anh","vat-li":"Vật lí",
  "hoa-hoc":"Hóa học","sinh-hoc":"Sinh học","lich-su":"Lịch sử","dia-li":"Địa lí",
  "tin-hoc":"Tin học","tieng-phap":"Tiếng Pháp",
};

/* ===== Chủ đề trọng tâm theo MÔN (bám cấu trúc đề vào 10) ===== */
const EXAM_TOPICS: Record<Subject, string[]> = {
  "toan": [
    "Hàm số y=ax+b – đồ thị", "Hệ phương trình 2 ẩn",
    "Tam giác đồng dạng", "Đường tròn: tiếp tuyến – góc – cát tuyến",
    "Bất phương trình đơn giản", "Phương trình bậc nhất/bậc hai (đổi biến)",
    "Hệ thức lượng trong tam giác vuông",
    "Bài toán thực tế (tỉ lệ, năng suất, chuyển động)",
    "Căn bậc hai – biến đổi", "Hình học tọa độ (điểm/đoạn/trung điểm)"
  ],
  "ngu-van": [
    "Đọc hiểu: phương thức biểu đạt & biện pháp tu từ",
    "Đọc hiểu: thông điệp, thái độ tác giả",
    "NLXH 200 chữ: cấu trúc & 5 tiêu chí",
    "NLXH: dẫn chứng thời sự – học đường",
    "NLVH: nhân vật – chi tiết nghệ thuật",
    "NLVH: hình ảnh thiên nhiên – con người",
    "Kĩ năng mở/kết & liên kết đoạn",
  ],
  "tieng-anh": [
    "Tenses (thì cơ bản)", "Passive & Reported speech",
    "Conditional/Relative clauses", "Comparisons/Prepositions/Articles",
    "Word form – Prefix/Suffix", "Reading comprehension – skimming & scanning",
    "Error finding – sửa lỗi", "Cloze test – Từ vựng B1",
  ],
  "vat-li": [
    "Điện học: định luật Ôm – mạch nối tiếp/song song",
    "Công – công suất điện – nhiệt lượng",
    "Quang học: thấu kính, ảnh – công thức",
    "Cơ học: lực – công – chuyển động thẳng đều",
    "Bảo toàn năng lượng – đổi đơn vị"
  ],
  "hoa-hoc": [
    "PTHH cân bằng – bảo toàn", "Mol – khối lượng – thể tích",
    "Dung dịch: CM, C%, pha trộn", "Oxi hóa – khử cơ bản",
    "Kim loại tác dụng axit/muối", "Bài toán hỗn hợp"
  ],
  "sinh-hoc": [
    "Menđen: phân li & phân li độc lập", "ADN – NST – gen – phiên mã/dịch mã",
    "Đột biến gen & NST", "Lai giống – xác suất kiểu gen/kiểu hình",
  ],
  "lich-su": [
    "VN 1858–1918: phong trào yêu nước", "1930–1945: Cách mạng Tháng Tám",
    "Kháng chiến chống Pháp – Mỹ: mốc & ý nghĩa", "VN 1975–2000: đổi mới",
    "Thế giới hiện đại: CTTG – LHQ", "So sánh 2 sự kiện (mục tiêu–diễn biến–ý nghĩa)"
  ],
  "dia-li": [
    "Dân cư – lao động – đô thị hóa", "Cơ cấu ngành/vùng kinh tế",
    "Nông – lâm – ngư nghiệp", "Công nghiệp trọng điểm",
    "Khai thác Atlat (trang trọng tâm)", "Chọn & vẽ biểu đồ (tròn/cột/đường/miền)",
    "Nhận xét – giải thích số liệu"
  ],
  "tin-hoc": [
    "Hệ điều hành & quản lí tệp", "Word: định dạng, mục lục",
    "Excel: SUM/IF/COUNTIF/VLOOKUP", "PowerPoint: bố cục & hiệu ứng",
    "Thuật toán cơ bản (Scratch/Python)", "An toàn thông tin, trích dẫn nguồn"
  ],
  "tieng-phap": [
    "Présent (thì hiện tại)", "Articles (définis/indéfinis/partitifs)",
    "Adjectifs possessifs/démonstratifs", "Prépositions de lieu/temps",
    "Questions & négations", "Vocabulaire A1–A2 – dialogues courts"
  ],
};

/* ===== KIẾN THỨC CƠ BẢN (cốt lõi) — gọn, đúng trọng tâm đề vào 10 ===== */
type NotesMap = Record<Subject, Record<string, string[]>>;
const CORE_NOTES: NotesMap = {
  toan: {
    "hàm số": [
      "Đồ thị y=ax+b là đường thẳng: a ≠ 0 (hệ số góc); a>0 ↑, a<0 ↓.",
      "Tọa độ giao trục: cắt Oy tại (0,b), cắt Ox khi y=0 ⇒ x = -b/a.",
      "Xác định đường thẳng qua 2 điểm: hệ số góc k = (y2−y1)/(x2−x1); phương trình y = kx + y1 − kx1.",
      "Nhận dạng đề: tìm giao điểm, song song (a1=a2), vuông góc (a1·a2=-1).",
    ],
    "hệ phương trình": [
      "Dạng cơ bản: thế / cộng – trừ / quy về 1 ẩn.",
      "Hệ đối xứng hoặc đặt ẩn phụ u=x+y, v=xy khi xuất hiện x+y, xy.",
      "Điều kiện nghiệm: ∆ ≠ 0 (hệ Cramer); chú ý mẫu khác 0 nếu có phân thức.",
    ],
    "đồng dạng": [
      "AA/HS cạnh tỉ lệ/góc xen kẽ – so le trong → tam giác đồng dạng.",
      "Suy ra tỉ lệ cạnh tương ứng; áp dụng tìm đoạn thẳng/chiều cao/diện tích.",
      "Bẫy: xác định đúng cặp góc tương ứng; sơ đồ hình để không nhầm.",
    ],
    "đường tròn": [
      "Tiếp tuyến vuông góc bán kính tại tiếp điểm.",
      "Góc nội tiếp = 1/2 số đo cung chắn; góc tạo bởi tiếp tuyến & dây = góc nội tiếp cùng chắn cung.",
      "Tính chất cát tuyến – tiếp tuyến: PA² = PB·PC (P ngoài đường tròn).",
    ],
    "bất phương trình": [
      "Quy tắc chuyển vế, đổi dấu khi nhân/chia số âm.",
      "Dạng trị tuyệt đối: tách 2 trường hợp theo dấu biểu thức.",
      "Vẽ trục số để biểu diễn nghiệm; hợp giao khoảng.",
    ],
    "bậc nhất/bậc hai": [
      "PT bậc hai: ∆ = b² − 4ac; nghiệm: x = (-b ± √∆)/(2a).",
      "Đổi biến khi xuất hiện dạng x + 1/x, đặt t = x + 1/x (điều kiện x ≠ 0).",
      "Nhớ Viète: x1 + x2 = -b/a; x1·x2 = c/a.",
    ],
    "tam giác vuông": [
      "Pytago: a² = b² + c²; hệ thức lượng: h² = mn, a² = c·ca’, b² = c·cb’.",
      "Sin/Cos trong tam giác vuông: sin = đối/huyền, cos = kề/huyền.",
    ],
    "bài toán thực tế": [
      "Tỉ lệ: y ∼ kx; năng suất: khối lượng = năng suất × thời gian.",
      "Chuyển động đều: s = v·t; ngược chiều cộng vận tốc, cùng chiều trừ.",
    ],
    "căn bậc hai": [
      "Quy tắc: √ab = √a√b (a,b≥0); khử mẫu; liên hợp khi có dạng √a ± √b.",
      "Điều kiện xác định khi có căn: biểu thức dưới căn ≥ 0.",
    ],
    "tọa độ": [
      "Độ dài đoạn thẳng: d(A,B)=√((x2-x1)²+(y2-y1)²); trung điểm M((x1+x2)/2,(y1+y2)/2).",
      "Phương trình đường thẳng qua điểm A(x0,y0) có hệ số góc k: y−y0 = k(x−x0).",
    ],
  },
  "ngu-van": {
    "phương thức": [
      "PTBĐ chính: tự sự, miêu tả, biểu cảm, thuyết minh, nghị luận, hành chính–công vụ.",
      "Biện pháp tu từ hay hỏi: ẩn dụ, hoán dụ, so sánh, điệp, nói quá, chơi chữ; tác dụng: gợi hình/gợi cảm/nhấn mạnh.",
    ],
    "thông điệp": [
      "Xác định đối tượng, hoàn cảnh; tác giả muốn gửi gắm giá trị/quan niệm gì.",
      "Thái độ/ngữ điệu: đồng cảm – phê phán – trân trọng… dẫn chứng 1–2 câu then chốt.",
    ],
    "200 chữ": [
      "Bố cục: Mở (nêu vấn đề) – Thân (giải thích, phân tích, phản biện, dẫn chứng) – Kết (bài học/nhắn gửi).",
      "5 tiêu chí: đúng đề; lập luận rõ; dẫn chứng phù hợp; diễn đạt; chính tả.",
    ],
    "nhân vật/chi tiết": [
      "Nêu lai lịch – diễn biến – phẩm chất; chi tiết nghệ thuật (mang tính biểu tượng).",
      "Gắn bài học/ý nghĩa nhân văn; liên hệ thực tiễn học đường.",
    ],
    "mở/kết": [
      "Mở tự nhiên – đi thẳng vấn đề; kết mở rộng—liên hệ bản thân/xã hội, tránh sáo rỗng.",
    ],
  },
  "tieng-anh": {
    "tenses": [
      "Hiện tại đơn: S + V(s/es) (thói quen, sự thật). Hiện tại tiếp diễn: S + am/is/are + V-ing (đang diễn ra).",
      "Quá khứ đơn: V2/ed; Hiện tại hoàn thành: have/has + P2 (kinh nghiệm/ảnh hưởng tới hiện tại).",
    ],
    "passive": [
      "Bị động: S + be + P2 (+ by O); thì nào → be chia thì đó.",
      "Tường thuật: lùi thì cơ bản; đổi đại từ/trạng ngữ chỉ thời gian – nơi chốn.",
    ],
    "conditional/relative": [
      "If loại 1: real; loại 2: unreal hiện tại; loại 3: unreal quá khứ.",
      "Mệnh đề quan hệ: who/whom/which/that/whose; rút gọn V-ing/P2 khi chủ ngữ trùng.",
    ],
    "comparison/articles/prep": [
      "So sánh hơn/nhất; cấu trúc as…as; much/far + comparative.",
      "Mạo từ a/an/the; giới từ thời gian: at/on/in; nơi chốn: at/in/on.",
    ],
    "reading": [
      "Skimming (đọc lướt ý chính) – scanning (đọc tìm chi tiết).",
      "Từ vựng B1: gia đình, giáo dục, môi trường, công nghệ…",
    ],
  },
  "vat-li": {
    "định luật ôm": [
      "U = I·R; mạch nối tiếp: I như nhau, U cộng; song song: U như nhau, I cộng.",
      "Công suất P = U·I; điện năng A = U·I·t; chú ý đổi đơn vị.",
    ],
    "nhiệt lượng": [
      "Q = m·c·Δt; cân bằng nhiệt: tổng Q thu = tổng Q tỏa.",
    ],
    "thấu kính": [
      "Công thức: 1/f = 1/d + 1/d’ (quy ước dấu chuẩn), độ phóng đại k = d’/d = h’/h.",
    ],
    "cơ học": [
      "Lực – tổng hợp lực; chuyển động thẳng đều: s = v·t; v–t, s–t.",
    ],
  },
  "hoa-hoc": {
    "pthh": [
      "Lập & cân bằng PTHH theo nguyên tắc bảo toàn nguyên tố/khối lượng.",
      "Bảo toàn mol e trong phản ứng oxi hóa–khử (nếu có).",
    ],
    "mol": [
      "n = m/M; CM = n/V; C% = (mct/mdd)·100%; bài pha trộn: bảo toàn chất tan/dung môi.",
    ],
    "kim loại": [
      "Kim loại + axit (có H⁺) → muối + H₂↑ (trừ Cu, Ag…); dãy hoạt động hoá học.",
    ],
    "hỗn hợp": [
      "Dùng bảo toàn khối lượng, nguyên tố, e; đặt ẩn, lập hệ.",
    ],
  },
  "sinh-hoc": {
    "menden": [
      "Quy luật phân li: F2 tỉ lệ kiểu hình 3:1 (P thuần chủng).",
      "Phân li độc lập: tỉ lệ tổ hợp tích; điều kiện gen nằm trên NST khác cặp.",
    ],
    "adn": [
      "ADN: kép, A–T, G–X; phiên mã mARN; dịch mã ở riboxom.",
    ],
    "đột biến": [
      "Đột biến gen: thay thế/ mất/ thêm 1–vài cặp base; đột biến NST: lệch bội, đa bội.",
    ],
  },
  "lich-su": {
    "1858-1918": [
      "Xâm lược Pháp; phong trào Cần Vương; tính chất yêu nước theo hệ tư tưởng phong kiến.",
    ],
    "1930-1945": [
      "Đảng ra đời; cao trào 1930–31, 1936–39; CMT8 1945: thời cơ – diễn biến – ý nghĩa lịch sử.",
    ],
    "kháng chiến": [
      "Pháp (1945–1954): Toàn dân – toàn diện – trường kỳ; Mỹ (1954–1975): chiến lược chiến tranh, mốc 1975.",
    ],
    "doi moi": [
      "Đổi mới 1986; mục tiêu CNH–HĐH; thành tựu – hạn chế.",
    ],
  },
  "dia-li": {
    "dan cu": [
      "Mật độ, phân bố; già hóa/ trẻ hóa; lao động – việc làm – đô thị hóa.",
    ],
    "co cau nganh": [
      "Tỉ trọng 3 khu vực; chuyển dịch cơ cấu theo vùng/địa phương.",
    ],
    "atlat": [
      "Đọc trang ký hiệu – địa hình – khoáng sản – nông nghiệp – công nghiệp – giao thông.",
    ],
    "bieu do": [
      "Chọn biểu đồ: tròn (cơ cấu), cột (so sánh), đường (biến động), miền (cơ cấu + biến động).",
    ],
  },
  "tin-hoc": {
    "he dieu hanh": [
      "Quản lí tệp/thư mục; đường dẫn; nén/giải nén; phím tắt cơ bản.",
    ],
    "word": [
      "Style – Heading – TOC (mục lục tự động); canh lề – tab – số trang – footnote.",
    ],
    "excel": [
      "Hàm: SUM, AVERAGE, MAX/MIN, IF, COUNTIF, VLOOKUP; định dạng số/ ngày; biểu đồ.",
    ],
    "thuat toan": [
      "Dễ → khó: tuần tự – rẽ nhánh – lặp; Scratch/ Python mẫu: tính tổng, tìm max, xử lí chuỗi.",
    ],
    "security": [
      "Mật khẩu mạnh, xác thực 2 lớp; bản quyền/ trích dẫn nguồn; sao lưu dữ liệu.",
    ],
  },
  "tieng-phap": {
    "present": [
      "Présent: động từ nhóm 1/2/3; avoir/être; động từ đặc biệt (aller, faire…).",
    ],
    "articles": [
      "mạo từ xác định/ bất định/ bộ phận: le/la/les – un/une/des – du/de la/des.",
    ],
    "possessifs": [
      "Tính từ sở hữu: mon/ma/mes… phù hợp giống & số của danh từ theo sau.",
    ],
    "prepositions": [
      "Giới từ nơi chốn/ thời gian: à, en, dans, sur, sous, chez, depuis, pendant…",
    ],
    "questions": [
      "Câu hỏi: est-ce que…?, đảo ngữ; phủ định ne … pas, ne … jamais…",
    ],
  },
};

/* ===== Điểm nhớ tóm tắt nhanh ===== */
function quickSummary(subj: Subject): string[] {
  switch (subj) {
    case "toan": return ["Nhận dạng dạng bài", "Công thức then chốt", "Các bước giải", "Lỗi hay mắc"];
    case "ngu-van": return ["Ý chính/ thông điệp", "PTBĐ/BPTT hoặc dàn ý 200 chữ", "Luận điểm – dẫn chứng", "Liên hệ"];
    case "tieng-anh": return ["Quy tắc", "Ví dụ", "3 câu luyện", "Mẹo đọc/ngữ pháp"];
    case "vat-li": return ["Công thức + đơn vị", "Ý nghĩa đại lượng", "Trình tự tính", "Kiểm tra kết quả"];
    case "hoa-hoc": return ["PTHH", "Bảo toàn mol/khối lượng", "Công thức nồng độ", "Các bước giải"];
    case "sinh-hoc": return ["Khái niệm", "Sơ đồ", "Ví dụ", "Câu hỏi tự kiểm"];
    case "lich-su": return ["Mốc – sự kiện – nhân vật", "Nguyên nhân – diễn biến – kết quả", "Ý nghĩa/so sánh"];
    case "dia-li": return ["Atlat", "Biểu đồ", "Nhận xét – giải thích", "Từ khóa"];
    case "tin-hoc": return ["Mục tiêu thao tác", "Các bước", "Ví dụ", "Lỗi thường gặp"];
    case "tieng-phap": return ["Quy tắc", "Ví dụ song ngữ", "Bài luyện ngắn", "Ghi nhớ nhanh"];
    default: return [];
  }
}

/* ===== Lấy “Kiến thức cơ bản” theo chuỗi khớp (linh hoạt includes) ===== */
function coreNotesFor(subject: Subject, topic: string): string[] {
  const pool = CORE_NOTES[subject] || {};
  const t = topic.toLowerCase();

  // Tìm key khớp phần tên ngắn
  const key = Object.keys(pool).find(k => t.includes(k));
  return key ? pool[key] : [];
}

interface KnowledgeBaseProps {
  subject: string | null;
  onStartPractice: (subject: string, topic: string) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ subject: initialSubjectProp, onStartPractice }) => {
  const slugify = (s: string | null) => s ? s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"") : 'toan';
  
  const getValidSubjectSlug = (s: string | null): Subject => {
    const sl = slugify(s);
    return Object.keys(LABELS).includes(sl) ? sl as Subject : 'toan';
  }
  
  const [subject, setSubject] = useState<Subject>(getValidSubjectSlug(initialSubjectProp));
  const [filter, setFilter]   = useState("");
  
  useEffect(() => {
    setSubject(getValidSubjectSlug(initialSubjectProp));
  }, [initialSubjectProp]);

  const topics = (EXAM_TOPICS[subject] || []).filter(t =>
    t.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-0 sm:p-2 md:p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Kiến thức ôn thi vào lớp 10 — <span className="text-indigo-600 dark:text-indigo-400">{LABELS[subject]}</span>
        </div>

        {/* Chọn môn + tìm chủ đề */}
        <div className="rounded-2xl border dark:border-gray-700 p-3 flex flex-wrap gap-3 items-center bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LABELS) as Subject[]).map(s=>(
              <button key={s} onClick={()=>setSubject(s)}
                className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${subject===s?"bg-black text-white dark:bg-blue-600 dark:border-blue-600":"bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                {LABELS[s]}
              </button>
            ))}
          </div>
          <input
            className="ml-auto border dark:border-gray-600 rounded-xl px-3 py-2 text-sm min-w-[220px] bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Tìm chủ đề…"
            value={filter} onChange={e=>setFilter(e.target.value)}
          />
        </div>

        {/* Danh sách chủ đề */}
        <div className="rounded-2xl border dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm">
          {topics.length === 0 ? (
            <div className="opacity-60 text-center py-10 text-sm">
              Chưa có chủ đề phù hợp từ khóa.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {topics.map((t, i)=>{
                const notes = coreNotesFor(subject, t);
                return (
                  <div key={i} className="border dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 flex flex-col">
                    <div className="font-semibold text-gray-900 dark:text-white">{t}</div>

                    {/* Điểm nhớ ngắn */}
                    <ul className="text-sm mt-2 list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                      {quickSummary(subject).map((k,idx)=>(<li key={idx}>{k}</li>))}
                    </ul>

                    {/* Kiến thức cơ bản (mở rộng) */}
                    {notes.length>0 && (
                      <details className="mt-3 text-gray-800 dark:text-gray-200">
                        <summary className="text-sm cursor-pointer select-none font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Kiến thức cơ bản</summary>
                        <div className="text-sm mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <ul className="list-disc pl-5 space-y-1.5">
                            {notes.map((k,idx)=>(<li key={idx}>{k}</li>))}
                          </ul>
                        </div>
                      </details>
                    )}

                    <div className="mt-4 pt-3 border-t dark:border-gray-700 flex-grow flex items-end gap-2">
                      <button
                        className="px-3 py-1.5 rounded-lg border text-sm font-medium bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={()=>alert(`TÓM TẮT NHANH: ${LABELS[subject]} – ${t}\n\n• ${quickSummary(subject).join("\n• ")}`)}
                      >
                        Tóm tắt nhanh
                      </button>
                      <button
                        className="px-4 py-1.5 rounded-lg bg-black dark:bg-blue-600 text-white text-sm font-semibold hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
                        onClick={() => onStartPractice(LABELS[subject], t)}
                      >
                        Luyện ngay
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-xs opacity-60 mt-3 px-1">
            *Danh sách & kiến thức cốt lõi bám sát cấu trúc đề thi vào 10. Bấm <b>Kiến thức cơ bản</b> để xem nhanh công thức/khái niệm quan trọng, hoặc <b>Luyện ngay</b> để làm bài theo chủ đề.
          </div>
        </div>
      </div>
    </div>
  );
};

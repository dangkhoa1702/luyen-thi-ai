/**
 * Trang "Phụ huynh theo dõi" – Đăng ký bằng Gmail & Gmail của con.
 * Dữ liệu được lưu cục bộ trên trình duyệt.
 * Đây là phiên bản đơn giản hoá, chỉ quản lý danh sách đăng ký.
 */
import React from "react";

// Types and localStorage helpers are now self-contained within the component.
type LinkItem = { parent: string; child: string; createdAt: number };
const KEY = "guardian.links.v1";

const loadLinks = (): LinkItem[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const saveLinks = (arr: LinkItem[]) => localStorage.setItem(KEY, JSON.stringify(arr));

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export const ParentDashboard: React.FC = () => {
  const [parent, setParent] = React.useState("");
  const [child, setChild]   = React.useState("");
  const [links, setLinks]   = React.useState<LinkItem[]>(loadLinks());
  const [msg, setMsg]       = React.useState<string>("");

  function addLink() {
    setMsg("");
    if (!isEmail(parent) || !isEmail(child)) {
      setMsg("Vui lòng nhập đúng định dạng email.");
      return;
    }
    const exists = links.some(l => l.parent === parent && l.child === child);
    if (exists) { setMsg("Cặp email này đã được đăng ký."); return; }
    const next = [...links, { parent, child, createdAt: Date.now() }];
    setLinks(next); saveLinks(next);
    setParent(""); setChild("");
    setMsg("Đã đăng ký theo dõi thành công.");
  }

  function removeLink(idx: number) {
    if (window.confirm("Bạn có chắc muốn xoá đăng ký này?")) {
        const next = links.filter((_,i)=>i!==idx);
        setLinks(next); saveLinks(next);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="rounded-2xl border dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-lg">
          <div className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
            Bảng theo dõi của <span className="text-indigo-600 dark:text-indigo-400">Phụ huynh</span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Nhập Gmail để nhận báo cáo tuần và theo dõi tiến bộ. Dữ liệu được lưu an toàn trên thiết bị của bạn.
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            <input
              className="border dark:border-gray-600 rounded-lg p-3 flex-1 min-w-[240px] bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Gmail phụ huynh"
              value={parent}
              onChange={e=>setParent(e.target.value)}
            />
            <input
              className="border dark:border-gray-600 rounded-lg p-3 flex-1 min-w-[240px] bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Gmail của con"
              value={child}
              onChange={e=>setChild(e.target.value)}
            />
            <button
              onClick={addLink}
              className="px-5 py-3 rounded-lg bg-black dark:bg-blue-600 text-white font-semibold hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
            >
              Đăng ký theo dõi
            </button>
          </div>
          {!!msg && <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">{msg}</div>}
        </div>

        {/* Danh sách đăng ký */}
        <div className="rounded-2xl border dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Danh sách đã đăng ký</h2>
          {links.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-center py-10">
              Chưa có đăng ký theo dõi nào. Hãy điền thông tin bên trên để bắt đầu.
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((l,idx)=>(
                <div key={idx} className="flex items-center justify-between border dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50">
                  <div className="text-sm">
                    <p><strong className="font-semibold text-gray-800 dark:text-gray-200">Phụ huynh:</strong> {l.parent}</p>
                    <p><strong className="font-semibold text-gray-800 dark:text-gray-200">Học sinh:</strong> {l.child}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded-lg border border-red-500/50 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-medium transition-colors"
                      onClick={()=>removeLink(idx)}
                    >Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

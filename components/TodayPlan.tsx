import React from "react";
import { loadCurrentPlan, practiceLinkForPack } from "../plan/planUtils";
import { labelOf } from "../profile/logic";

export default function TodayPlan() {
  const plan = loadCurrentPlan();

  if (!plan) {
    return (
      <div className="p-4">
        <div className="max-w-3xl mx-auto rounded-2xl border bg-white dark:bg-gray-800 p-4">
          <div className="text-lg font-semibold mb-1">Kế hoạch hôm nay</div>
          <div className="text-sm opacity-70">
            Chưa có kế hoạch. Hãy vào mục <b>Kế hoạch học tập</b> để tạo kế hoạch trước nhé.
          </div>
        </div>
      </div>
    );
  }

  const nextTask = plan.tasks.find((t) => !t.done);
  const next3 = plan.tasks.filter((t) => !t.done).slice(0, 3);
  const totalDone = plan.tasks.filter((t) => t.done).length;
  const progress = Math.round((totalDone / Math.max(1, plan.tasks.length)) * 100);

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="rounded-2xl border bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold">
              Kế hoạch hôm nay — {labelOf(plan.subject)}
            </div>
            <div className="text-sm opacity-60">Tiến độ: {progress}%</div>
          </div>

          {!nextTask ? (
            <div className="text-sm opacity-70">Tuyệt vời! Bạn đã hoàn thành tất cả nhiệm vụ 🎉</div>
          ) : (
            <div className="rounded-xl border p-3">
              <div className="text-sm opacity-70">Nhiệm vụ gần nhất</div>
              <div className="font-medium mt-1">
                {nextTask.type === "practice" ? "Luyện tập" : nextTask.type === "theory" ? "Lý thuyết" : "Ôn tập"} —{" "}
                {nextTask.topic} • {nextTask.minutes}’
              </div>
              <div className="mt-2 flex gap-2">
                <a
                  className="px-3 py-1 rounded-lg bg-black text-white text-sm"
                  href={practiceLinkForPack(plan.subject, nextTask.topic, nextTask.exercise)}
                >
                  Học tiếp
                </a>
                {nextTask.exercise?.title && (
                  <div className="text-xs opacity-70 self-center">
                    Gói bài tập: {nextTask.exercise.title} (~{nextTask.exercise.minutes}’)
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {next3.length > 0 && (
          <div className="rounded-2xl border bg-white dark:bg-gray-800 p-4">
            <div className="text-sm opacity-70 mb-2">Sắp tới</div>
            <div className="grid sm:grid-cols-3 gap-2">
              {next3.map((t) => (
                <div key={t.id} className="rounded-lg border p-2 text-sm">
                  <div className="font-medium truncate">{t.topic}</div>
                  <div className="opacity-70">
                    {t.type === "practice" ? "Luyện tập" : t.type === "theory" ? "Lý thuyết" : "Ôn tập"} • {t.minutes}’
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
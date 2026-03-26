import type { HistoryItem } from "@/src/types/workbench";

type HistoryListProps = {
  items: HistoryItem[];
  onReuse: (prompt: string) => void;
};

export function HistoryList({ items, onReuse }: HistoryListProps) {
  if (items.length === 0) {
    return <p className="history-empty">本次会话还没有生成记录</p>;
  }

  return (
    <ul className="history-list">
      {items.map((item) => (
        <li className="history-item" key={item.id}>
          <div className="history-meta">
            <p className="history-mode">{item.mode === "image" ? "图片" : "视频"}</p>
            <p className="history-prompt">{item.prompt}</p>
            <time className="history-time">{new Date(item.createdAt).toLocaleString("zh-CN")}</time>
            <a
              className="history-link"
              href={item.assetUrl}
              target="_blank"
              rel="noreferrer"
            >
              查看资源
            </a>
          </div>
          <div className="history-actions">
            <button className="ghost-button" type="button" onClick={() => onReuse(item.prompt)}>
              复用 prompt
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

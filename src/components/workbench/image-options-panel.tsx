import type { ImageOptions } from "@/src/types/workbench";

type ImageOptionsPanelProps = {
  value: ImageOptions;
  onChange: (value: ImageOptions) => void;
};

export function ImageOptionsPanel({ value, onChange }: ImageOptionsPanelProps) {
  return (
    <div className="option-stack">
      <label className="field">
        <span className="field-label">图片尺寸</span>
        <select
          aria-label="图片尺寸"
          value={value.size}
          onChange={(event) =>
            onChange({
              ...value,
              size: event.target.value as ImageOptions["size"],
            })
          }
        >
          <option value="1024x1024">1024 × 1024</option>
          <option value="1536x1024">1536 × 1024</option>
          <option value="1024x1536">1024 × 1536</option>
        </select>
      </label>
      <label className="field">
        <span className="field-label">图片质量</span>
        <select
          aria-label="图片质量"
          value={value.quality}
          onChange={(event) =>
            onChange({
              ...value,
              quality: event.target.value as ImageOptions["quality"],
            })
          }
        >
          <option value="standard">标准</option>
          <option value="hd">高清</option>
        </select>
      </label>
      <label className="field">
        <span className="field-label">生成数量</span>
        <input
          aria-label="生成数量"
          type="number"
          min={1}
          max={4}
          value={value.count}
          onChange={(event) => onChange({ ...value, count: Number(event.target.value) || 1 })}
        />
      </label>
      <label className="field">
        <span className="field-label">风格倾向</span>
        <select
          aria-label="风格倾向"
          value={value.style}
          onChange={(event) =>
            onChange({
              ...value,
              style: event.target.value as ImageOptions["style"],
            })
          }
        >
          <option value="natural">自然</option>
          <option value="vivid">鲜明</option>
        </select>
      </label>
    </div>
  );
}

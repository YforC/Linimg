type PromptComposerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PromptComposer({ value, onChange }: PromptComposerProps) {
  return (
    <section className="panel composer-panel">
      <div className="section-copy">
        <h1>生成图像与视频</h1>
      </div>
      <label className="field">
        <textarea
          aria-label="创作描述"
          className="prompt-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="输入你的描述"
          rows={5}
        />
      </label>
    </section>
  );
}

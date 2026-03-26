export function ErrorState({ message }: { message: string }) {
  return (
    <div className="state-card error">
      <p className="state-title">生成失败</p>
      <p className="state-description">{message}</p>
    </div>
  );
}

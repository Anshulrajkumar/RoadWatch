import { useState } from "react";

const IssueUploadCard = ({
  imageName,
  videoName,
  onImageSelect,
  onVideoSelect,
  onRemoveImage,
  onRemoveVideo,
  uploading,
  progress,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [dropError, setDropError] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      setDropError(null);
      onImageSelect(file);
      return;
    }

    if (file.type.startsWith("video/")) {
      setDropError(null);
      onVideoSelect(file);
      return;
    }

    setDropError("Unsupported file type. Upload jpg, jpeg, png, or mp4.");
  };

  return (
    <div className="rounded-xl border border-border bg-white shadow-card">
      <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
        Upload Evidence
      </div>
      <div className="space-y-4 px-6 py-5">
        <div
          className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-6 text-center text-sm text-ink/70 transition ${
            dragActive ? "border-accent bg-accent/10" : "border-border"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={uploading ? undefined : handleDrop}
        >
          <p className="small-caps text-ink/60">Drag and drop</p>
          <p>Drop an image or video file here</p>
          <p className="text-xs text-ink/50">Supported: jpg, jpeg, png, mp4</p>
        </div>

        <div className="grid gap-3 text-xs text-ink/70">
          <label className="uppercase tracking-[0.12em]">Image Upload</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setDropError(null);
                onImageSelect(file);
              }
            }}
          />
          {imageName ? (
            <div className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2">
              <span className="text-sm text-ink">{imageName}</span>
              <button
                type="button"
                className="text-xs uppercase tracking-[0.12em] text-accent"
                onClick={onRemoveImage}
              >
                Remove
              </button>
            </div>
          ) : null}

          <label className="uppercase tracking-[0.12em]">Video Upload (Optional)</label>
          <input
            type="file"
            accept="video/mp4"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setDropError(null);
                onVideoSelect(file);
              }
            }}
          />
          {videoName ? (
            <div className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2">
              <span className="text-sm text-ink">{videoName}</span>
              <button
                type="button"
                className="text-xs uppercase tracking-[0.12em] text-accent"
                onClick={onRemoveVideo}
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>

        {dropError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {dropError}
          </div>
        ) : null}

        {uploading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-ink/60">
              <span>Uploading</span>
              <span>{Math.round(progress || 0)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-accent transition"
                style={{ width: `${Math.min(100, progress || 0)}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default IssueUploadCard;

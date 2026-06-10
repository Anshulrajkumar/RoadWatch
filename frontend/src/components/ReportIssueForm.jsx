import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import IssueUploadCard from "./IssueUploadCard.jsx";
import LocationFetcher from "./LocationFetcher.jsx";
import ComplaintSuccessModal from "./ComplaintSuccessModal.jsx";
import { getNearestRoad, reportIssue, rewriteIssueDescription } from "../services/api";
import { useGeolocation } from "../hooks/useGeolocation";
import { compressImage } from "../utils/compressImage";
import { useAuth } from "../contexts/AuthContext.jsx";

const ISSUE_TYPES = [
  "Pothole",
  "Crack",
  "Waterlogging",
  "Broken Divider",
  "Faded Markings",
  "Road Collapse",
  "Drainage Issue",
  "Other",
];

const DRAFT_KEY = "roadwatch.issueDraft.v1";

const readDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const ReportIssueForm = ({
  onPreviewChange,
  onRoadInfoChange,
  onLocationChange,
  onAiInsight,
  onComplaint,
  onStatusChange,
  onNavigate,
}) => {
  const { user } = useAuth();
  const draft = readDraft();
  const { getCurrentLocation } = useGeolocation();
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [coords, setCoords] = useState(null);
  const [roadInfo, setRoadInfo] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [status, setStatus] = useState({ submitting: false, progress: 0, error: null });
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [rewriteStatus, setRewriteStatus] = useState({ loading: false, error: null });
  const [draftTimestamp, setDraftTimestamp] = useState(draft?.updatedAt || null);

  const emptyValues = useMemo(
    () => ({
      issueType: "",
      description: "",
      latitude: "",
      longitude: "",
    }),
    []
  );

  const defaultValues = useMemo(() => draft?.values || emptyValues, [draft, emptyValues]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const watchLat = watch("latitude");
  const watchLng = watch("longitude");
  const watchDescription = watch("description");

  useEffect(() => {
    const subscription = watch((value) => {
      const payload = {
        values: value,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      setDraftTimestamp(payload.updatedAt);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (onPreviewChange) {
      onPreviewChange(preview);
    }
  }, [preview, onPreviewChange]);

  useEffect(() => {
    if (onRoadInfoChange) {
      onRoadInfoChange(roadInfo);
    }
  }, [roadInfo, onRoadInfoChange]);

  useEffect(() => {
    if (onLocationChange) {
      onLocationChange(coords);
    }
  }, [coords, onLocationChange]);

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  }, [status, onStatusChange]);

  useEffect(() => {
    const lat = Number.parseFloat(watchLat);
    const lng = Number.parseFloat(watchLng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setCoords({ lat, lng });
    } else {
      setCoords(null);
    }
  }, [watchLat, watchLng]);

  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview]);

  const handleImageSelect = async (file) => {
    const compressed = await compressImage(file);
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    setImageFile(compressed);
    setPreview({ url: URL.createObjectURL(compressed), type: "image", name: file.name });
  };

  const handleVideoSelect = (file) => {
    if (!imageFile) {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
      setPreview({ url: URL.createObjectURL(file), type: "video", name: file.name });
    }
    setVideoFile(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    if (videoFile) {
      setPreview({ url: URL.createObjectURL(videoFile), type: "video", name: videoFile.name });
    } else {
      setPreview(null);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    if (!imageFile) {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
      setPreview(null);
    }
  };

  const handleLocate = async () => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const position = await getCurrentLocation({ maximumAge: 0 });
      const lat = position.latitude;
      const lng = position.longitude;
      setCoords({ lat, lng });
      setValue("latitude", lat.toFixed(6));
      setValue("longitude", lng.toFixed(6));

      const roadResponse = await getNearestRoad(lat, lng);
      if (roadResponse?.road) {
        setRoadInfo(roadResponse.road);
      } else {
        setRoadInfo(null);
      }
    } catch (error) {
      setLocationError(error?.message || "Unable to access GPS location.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleRewrite = async () => {
    const description = String(getValues("description") || "").trim();
    const issueType = String(getValues("issueType") || "").trim();

    if (!description) {
      setRewriteStatus({ loading: false, error: "Add a short description first." });
      return;
    }

    setRewriteStatus({ loading: true, error: null });

    try {
      const response = await rewriteIssueDescription({ description, issueType });
      if (!response?.description) {
        throw new Error("No rewrite returned.");
      }
      setValue("description", response.description, { shouldDirty: true, shouldValidate: true });
      setRewriteStatus({ loading: false, error: null });
    } catch (error) {
      setRewriteStatus({ loading: false, error: error?.message || "Rewrite failed." });
    }
  };

  const onSubmit = async (values) => {
    if (!imageFile && !videoFile) {
      setStatus({ submitting: false, progress: 0, error: "Upload an image or video." });
      return;
    }

    setStatus({ submitting: true, progress: 0, error: null });

    try {
      const formData = new FormData();
      if (imageFile) formData.append("image", imageFile);
      if (videoFile) formData.append("video", videoFile);

      formData.append("issueType", values.issueType);
      formData.append("description", values.description || "");
      formData.append("latitude", values.latitude);
      formData.append("longitude", values.longitude);

      // Attach authenticated user ID
      if (user?.id) {
        formData.append("userId", user.id);
      }

      if (roadInfo) {
        if (roadInfo.roadCode) formData.append("roadCode", roadInfo.roadCode);
        if (roadInfo.roadName) formData.append("roadName", roadInfo.roadName);
        if (roadInfo.type) formData.append("roadType", roadInfo.type);
        if (roadInfo.authority) formData.append("authority", roadInfo.authority);
        if (roadInfo.district) formData.append("district", roadInfo.district);
        if (roadInfo.state) formData.append("state", roadInfo.state);
        if (roadInfo.displayName) formData.append("displayName", roadInfo.displayName);
        if (Number.isFinite(roadInfo.confidence)) {
          formData.append("confidence", String(roadInfo.confidence));
        }
      }

      const response = await reportIssue(formData, (event) => {
        if (!event.total) return;
        const nextProgress = Math.round((event.loaded / event.total) * 100);
        setStatus((prev) => ({ ...prev, progress: nextProgress }));
      });

      if (onAiInsight) {
        onAiInsight(response.ai);
      }
      if (onComplaint) {
        onComplaint(response.complaint);
      }
      if (response.road) {
        setRoadInfo(response.road);
      }

      setStatus({ submitting: false, progress: 100, error: null });
      reset(emptyValues);
      localStorage.removeItem(DRAFT_KEY);
      setDraftTimestamp(null);
      setImageFile(null);
      setVideoFile(null);
      if (preview?.url) URL.revokeObjectURL(preview.url);
      setPreview(null);
      setSuccessModalOpen(true);
    } catch (error) {
      setStatus({ submitting: false, progress: 0, error: error?.message || "Submission failed." });
    }
  };

  return (
    <form id="report-issue-form" className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <IssueUploadCard
        imageName={imageFile?.name || null}
        videoName={videoFile?.name || null}
        onImageSelect={handleImageSelect}
        onVideoSelect={handleVideoSelect}
        onRemoveImage={handleRemoveImage}
        onRemoveVideo={handleRemoveVideo}
        uploading={status.submitting}
        progress={status.progress}
      />

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Issue Details
        </div>
        <div className="space-y-4 px-6 py-5 text-sm text-ink/70">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.12em] text-ink/60">Issue Type</label>
            <select
              className="w-full border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
              {...register("issueType", { required: "Select an issue type." })}
            >
              <option value="">Select issue type</option>
              {ISSUE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.issueType ? (
              <div className="text-xs text-red-600">{errors.issueType.message}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-[0.12em] text-ink/60">Description</label>
              <button
                type="button"
                className="text-xs uppercase tracking-[0.12em] text-accent transition disabled:opacity-60"
                onClick={handleRewrite}
                disabled={
                  status.submitting ||
                  rewriteStatus.loading ||
                  !String(watchDescription || "").trim()
                }
              >
                {rewriteStatus.loading ? "Rewriting..." : "Rewrite using AI"}
              </button>
            </div>
            <textarea
              rows={4}
              className="w-full resize-none border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
              placeholder="Describe the road issue with details and nearby landmarks."
              {...register("description", { minLength: { value: 10, message: "Add at least 10 characters." } })}
            />
            {errors.description ? (
              <div className="text-xs text-red-600">{errors.description.message}</div>
            ) : null}
            {rewriteStatus.error ? (
              <div className="text-xs text-red-600">{rewriteStatus.error}</div>
            ) : null}
          </div>
        </div>
      </div>

      <LocationFetcher coords={coords} loading={locationLoading} error={locationError} onLocate={handleLocate} />

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Coordinates
        </div>
        <div className="grid gap-4 px-6 py-5 text-sm text-ink/70">
          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-ink/60">Latitude</label>
            <input
              className="mt-2 w-full border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
              placeholder="Latitude"
              {...register("latitude", { required: "Latitude is required." })}
            />
            {errors.latitude ? (
              <div className="text-xs text-red-600">{errors.latitude.message}</div>
            ) : null}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-ink/60">Longitude</label>
            <input
              className="mt-2 w-full border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
              placeholder="Longitude"
              {...register("longitude", { required: "Longitude is required." })}
            />
            {errors.longitude ? (
              <div className="text-xs text-red-600">{errors.longitude.message}</div>
            ) : null}
          </div>
        </div>
      </div>

      {draftTimestamp ? (
        <div className="rounded-md border border-border bg-white px-4 py-3 text-xs text-ink/60">
          Draft saved locally at {new Date(draftTimestamp).toLocaleTimeString()} (media not stored).
        </div>
      ) : null}

      {status.error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {status.error}
        </div>
      ) : null}

      <ComplaintSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        onGoToDashboard={() => {
          setSuccessModalOpen(false);
          if (onNavigate) {
            onNavigate("/complaints");
          } else {
            window.history.pushState({}, "", "/complaints");
            window.dispatchEvent(new PopStateEvent("popstate"));
          }
        }}
      />
    </form>
  );
};

export default ReportIssueForm;

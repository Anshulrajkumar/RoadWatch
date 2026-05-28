export const compressImage = async (file, options = {}) => {
  if (!file || !file.type || !file.type.startsWith("image/")) {
    return file;
  }

  const { maxWidth = 1600, maxHeight = 1600, quality = 0.74 } = options;

  try {
    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1);
    const targetWidth = Math.round(bitmap.width * ratio);
    const targetHeight = Math.round(bitmap.height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const outputQuality = outputType === "image/png" ? 0.92 : quality;

    const blob = await new Promise((resolve) =>
      canvas.toBlob((result) => resolve(result || file), outputType, outputQuality)
    );

    if (!(blob instanceof Blob)) {
      return file;
    }

    return new File([blob], file.name, { type: outputType });
  } catch (error) {
    return file;
  }
};

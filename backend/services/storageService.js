"use strict";

const { createClient } = require("@supabase/supabase-js");
const { logger } = require("../utils/logger");
const crypto = require("crypto");
const path = require("path");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  logger.warn("SUPABASE_URL or Key missing. Storage operations will fail.");
}

/**
 * Uploads a file buffer to Supabase Storage and returns the public URL.
 * @param {Object} file - The file object from Multer (contains buffer, originalname, mimetype)
 * @returns {Promise<string>} The public URL of the uploaded file
 */
const uploadToSupabaseStorage = async (file) => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Cannot upload file.");
  }
  if (!file || !file.buffer) {
    return null;
  }

  // Generate a unique filename
  const ext = path.extname(file.originalname || "");
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;

  // Upload to the 'issues' bucket
  const { data, error } = await supabase.storage
    .from("issues")
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    logger.error("Error uploading to Supabase Storage:", error);
    throw error;
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from("issues")
    .getPublicUrl(filename);

  return publicUrlData.publicUrl;
};

module.exports = {
  uploadToSupabaseStorage,
};

"use server";

import crypto from "crypto";

export async function uploadImage(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Cloudinary configuration missing in environment variables");
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "Auction 11";

    // 1. Prepare parameters for signature
    const paramsToSign = {
        folder,
        timestamp,
    };

    // 2. Sort and sign
    const sortedKeys = Object.keys(paramsToSign).sort();
    const stringToSign = sortedKeys
        .map(key => `${key}=${(paramsToSign as any)[key]}`)
        .join("&") + apiSecret;

    const signature = crypto
        .createHash("sha1")
        .update(stringToSign)
        .digest("hex");

    // 3. Prepare upload payload
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("signature", signature);
    uploadFormData.append("folder", folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: uploadFormData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url as string;
}

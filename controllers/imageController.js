const asyncHandler = require("express-async-handler");

const { uploadImageHandler } = require("./FileController");

const uploadImage = asyncHandler(async (req, res) => {
    const files = req.files;

    if (!files) {
        res.status(400).send("No files were uploaded.");
        return;
    }

    const fileUrls = [];

    await Promise.all(
        files.map(async (file) => {
            const filePath = file.path;

            try {
                const fileUrl = await uploadImageHandler(file);
                fileUrls.push({
                    title: file.originalname,
                    webContentLink: fileUrl.url.webContentLink,
                    webViewLink: fileUrl.url.webViewLink,
                    thumbnailLink: fileUrl.url.thumbnailLink,
                    mimeType: fileUrl.mimeType,
                });
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }),
    );

    return res.json(fileUrls);
});

module.exports = {
    uploadImage,
};

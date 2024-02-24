const self = (module.exports = {
    uploadImageHandler: async (file) => {
        try {
            return {
                url: {
                    webContentLink: process.env.HOST + "/storage/images/" + file.filename,
                    thumbnailLink: process.env.HOST + "/storage/images/" + file.filename,
                    webViewLink:
                        process.env.HOST + "/storage/images/" + file.filename + "?export=download",
                },
                mimeType: file.mimetype,
            };
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    },
});

const getImagePath = (imagePath?: string, fullSize?: boolean) => {
  if (!imagePath) return "/not_found.png";

  // Remove any leading slashes from the imagePath
  const cleanPath = imagePath.replace(/^\/+/, "");

  // Ensure we're using HTTPS
  return `https://image.tmdb.org/t/p/${
    fullSize ? "original" : "w500"
  }/${cleanPath}`;
};

export default getImagePath;

const getImagePath = (imagePath?: string, fullSize?: boolean) => {
  // Check if imagePath is undefined, null, empty string or just a slash
  if (!imagePath || imagePath === "/" || imagePath === "") {
    return "/not_found.png";
  }

  // Remove any leading slashes from the imagePath
  const cleanPath = imagePath.replace(/^\/+/, "");

  // If after cleaning the path is empty, return the fallback
  if (!cleanPath) {
    return "/not_found.png";
  }

  // Ensure we're using HTTPS
  return `https://image.tmdb.org/t/p/${
    fullSize ? "original" : "w500"
  }/${cleanPath}`;
};

export default getImagePath;

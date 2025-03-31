const getImagePath = (imagePath?: string, fullSize?: boolean) => {
  return imagePath
    ? `http://image.tmdb.org/t/p/${fullSize ? "original" : "w500"}/${imagePath}`
    : "https://www.freepik.com/vectors/website#referrer=detail&resource=7741849";
};

export default getImagePath;

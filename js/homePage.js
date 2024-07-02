let nextPage = "";
let isFetchingPhotos = false;

setUi();
// Fetch and render the posts
getPosts();

// Pagination and Scroll to top button
window.addEventListener("scroll", function () {
  // Threshold distance from the bottom (%);
  const threshold = 0.80;
  if (
    (window.scrollY + window.innerHeight) >= (threshold * document.body.offsetHeight) && !isFetchingPhotos
  ) {
    if (nextPage) {
      getPosts(nextPage, false);
    }
  }
});

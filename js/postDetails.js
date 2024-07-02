const postContainer = document.querySelector(".post-container");
const params = new URLSearchParams(window.location.search);
const postId = params.get("postId");
let commnetsShown = false;
let nextPage = "";
let commentCount = 0;

// Set the navbar buttons
setUi();
// Render the post
showPostDetails();
// Prevent to many requests
let isFetchingComments = false;
window.addEventListener("scroll", function () {
  // Threshold distance from the bottom (%);
  const threshold = 1;
  if (
    window.scrollY + window.innerHeight >=
      threshold * document.body.offsetHeight &&
    !isFetchingComments &&
    commnetsShown
  ) {
    if (nextPage) {
      showComments(false, nextPage);
    }
  }
});

async function showPostDetails() {
  if (isLoggedIn()) {
    try {
      const response = await axios.get(`${baseUrl}/posts/${postId}`);
      const post = await response.data.data;
      commentCount = post.comments_count;
      postContainer.innerHTML = "";
      postContainer.innerHTML = `
        <div class="post card shadow mb-3">
          <div class="card-header" style="cursor: pointer;" onclick="showProfilePage(${
                post.author.id
              })">
            <img
              class="rounded-circle border border-2"
              src="${
                typeof post.author.profile_image !== "object"
                  ? post.author.profile_image
                  : "./assets/imags/blank-profile-picture-973460.svg"
              }"
              alt="profile picture"
              width="40"
              height="40"
            />
            <span class="user-name fw-bold ms-2 text-primary">&#64;${
              post.author.id
            }</span>
          </div>
          <div class="card-body">
            <div class="post-image-container">
              ${
                typeof post.image !== "object"
                  ? `<img class="w-100" src="${post.image}" alt="profile picture"></img>`
                  : ""
              }
            </div>
            <span
              class="post-date my-2 d-block"
              style="color: rgb(155, 154, 154);"
              >${post.created_at}</span
            >
            <h5
              class="post-header ts-4 ${
                post.title !== null ? "text-black" : "text-danger"
              }"
            >
              ${post.title !== null ? post.title : "No Title"}
            </h5>
            <p
              class="post-content ts-3 ${
                post.body !== null ? "text-black" : "text-danger"
              }"
            >
              ${post.body !== null ? post.body : "No Title"}
            </p>
            <hr />
            <div
              class="post-footer d-flex justify-content-between align-items-center"
            >
              <div
                class="comments-btn d-flex align-items-center"
                style="cursor: pointer;"
                data-bs-toggle="collapse"
                data-bs-target="#post-comments-section"
                onclick="commentsButtonClicked()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                </svg>
                <span class="mx-1"
                  >(${commentCount})
                  ${commentCount != 1 ? "comments" : "comment"}</span
                >
              </div>
              <div id="post-tags-${post.author.id}"></div>
              <div id="create-comment-btn" class="btn btn-primary rounded-circle d-flex justify-content-center align-items-center" style="width: 40px; height: 40px;" data-bs-toggle="modal" data-bs-target="#new-comment-modal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                </svg>
              </div>
            </div>
            <div id="post-comments-container">
              <div>
                <div
                  class="collapse show collapse-horizontal bg-light py-1 px-3 rounded mt-3"
                  id="post-comments-section"
                >
                  <!-- Comments will be appended here -->
                  No Comments
                </div>
              </div>
            </div>
          </div>
        </div>
  `;
      showComments();
    } catch (error) {
      showAlert(error, "danger");
    }
  } else {
    showAlert("You Have To Log In", "primary", false);
  }
}

async function showComments(
  reload = true,
  url = `${baseUrl}/posts/${postId}/comments`
) {
  try {
    isFetchingComments = true;
    const response1 = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const comments = response1.data.data;
    if (comments.length) {
      const commentSectionContainer = document.getElementById(
        "post-comments-section"
      );
      if (reload) {
        commentSectionContainer.innerHTML = "";
      }
      for (let comment of comments) {
        try {
          const response2 = await axios.get(
            `${baseUrl}/users/${comment.author_id}`
          );
          const data = response2.data.data;
          const userName = data.username;
          const profileImage =
            typeof data.profile_image !== "object"
              ? data.profile_image
              : "./assets/imags/blank-profile-picture-973460.svg";
          const content = `
          <div class="comment d-flex my-3">
            <div class="user-image-container me-3">
              <img class="rounded-circle border border-2" width="40" height="40" src="${profileImage}" alt="">
            </div>
            <div class="card bg-body-secondary">
              <div id="comment-user-id" class="fs-7 text-primary px-2">@${userName}</div>
                <div class="card-body px-2 py-1">
                  <p class="card-text mb-0 fs-9">${comment.body}</p>
              </div>
            </div>
          </div>
          <hr>
          `;
          commentSectionContainer.innerHTML += content;
        } catch (error) {
          isFetchingComments = false;
          showAlert(error.response.data.message, "danger");
        }
      }
    }
    nextPage = response1.data.next_page_url;
    isFetchingComments = false;
  } catch (error) {
    isFetchingComments = false;
    showAlert(error.response.data.message, "danger");
  }
}

function commentsButtonClicked() {
  commnetsShown = !commnetsShown;
}

function addComment() {
  const comment = document.getElementById("comment-text").value;
  axios
    .post(
      `${baseUrl}/posts/${postId}/comments`,
      { body: comment },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then(() => {
      const modal = document.getElementById("new-comment-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showPostDetails();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}

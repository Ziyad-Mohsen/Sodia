const baseUrl = "https://tarmeezacademy.com/api/v1";

// ===================== UI SETUP =====================

function setUi() {
  updateNavButtons();

  const createPostPlaceholder = document.getElementById(
    "create-post-button-placeholder"
  );
  const userInfoContainer = document.getElementById("user-info");

  window.addEventListener("scroll", handleScrollToTopBtn);

  if (isLoggedIn()) {
    showCreatePostButton(createPostPlaceholder);
    showUserInfo(userInfoContainer);
  } else {
    createPostPlaceholder.innerHTML = "";
    userInfoContainer.innerHTML = "";
  }
}

function handleScrollToTopBtn() {
  const scrollToTopBtn = document.getElementById("scroll-top");
  const shouldShow =
    document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
  scrollToTopBtn.style.setProperty(
    "display",
    shouldShow ? "flex" : "none",
    "important"
  );
}

function showCreatePostButton(container) {
  container.innerHTML = `
    <button class="btn btn-primary font-weight-bold d-flex justify-content-center align-items-center rounded-circle shadow"
      style="width: 50px; height: 50px;" data-bs-toggle="modal" data-bs-target="#create-post-form" onclick="updatePostModal()">
      ${SVG_PLUS}
    </button>
  `;
}

function showUserInfo(container) {
  const { profile_image, username } = JSON.parse(localStorage.getItem("user"));
  container.innerHTML = `
    <img class="rounded-circle border border-primary" src="${
      typeof profile_image !== "object"
        ? profile_image
        : "./assets/imags/blank-profile-picture-973460.svg"
    }" alt="user image" width="40" height="40">
    <a class="ms-2 text-decoration-none me-lg-3" href="#">@${username}</a>
  `;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===================== NAVIGATION =====================

function updateNavButtons() {
  const buttonsContainer = document.querySelector(".nav-buttons");
  if (isLoggedIn()) {
    buttonsContainer.innerHTML = `
      <button class="btn btn-outline-danger d-flex justify-content-center align-items-center"
        data-bs-toggle="modal" data-bs-target="#logout-message" style="width: 40px; height: 40px;">
        ${SVG_LOGOUT}
      </button>
    `;
  } else {
    buttonsContainer.innerHTML = `
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#login-form">Login</button>
      <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#register-form">Register</button>
    `;
  }
}

function isLoggedIn() {
  return !!(localStorage.getItem("token") && localStorage.getItem("user"));
}

// ===================== AUTH =====================

function register() {
  const url = `${baseUrl}/register`;
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const image = document.getElementById("register-image").files[0];

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("email", email);
  if (image) formData.append("image", image);

  axios
    .post(url, formData)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      hideModal("register-form");
      showAlert("You have created a new account", "success");
      window.location.reload();
    })
    .catch((error) => showAlert(error.response.data.message, "danger"));
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const params = { username, password };
  const url = `${baseUrl}/login`;

  axios
    .post(url, params)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      hideModal("login-form");
      showAlert("Login Successful", "success");
      window.location.reload();
    })
    .catch((error) => showAlert(error.response.data.message, "danger"));
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  hideModal("logout-message");
  showAlert("Logged out", "warning");
  window.location.href = "index.html";
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}

// ===================== ALERTS =====================

function showAlert(message, type, disappear = true) {
  const alertPlaceholder = document.getElementById("success-alert");
  alertPlaceholder.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible" role="alert">
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  alertPlaceholder.append(wrapper);

  if (disappear) {
    setTimeout(() => {
      alertPlaceholder.innerHTML = "";
    }, 3500);
  }
}

// ===================== POSTS =====================

async function createPost(id) {
  const url = `${baseUrl}/posts${id ? `/${id}` : ""}`;
  const title = document.getElementById("new-post-title").value;
  const body = document.getElementById("new-post-body").value;
  const image = document.getElementById("new-post-image").files[0];

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  if (image) formData.append("image", image);

  try {
    let res;
    if (id) {
      res = await axios.put(url, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } else {
      res = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    }
    hideModal("create-post-form");
    if (!id) {
      window.location.href = "index.html";
    } else {
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
    showAlert(error.response.data.message, "danger");
  }
}

function getPosts(
  url = `${baseUrl}/posts`,
  reload = true,
  pagination = true,
  myProfilePage = false
) {
  const postsContainer = document.getElementById("posts-container");
  if (reload) postsContainer.innerHTML = "";

  isFetchingPhotos = true;
  axios
    .get(url)
    .then((res) => {
      isFetchingPhotos = false;
      let posts = res.data.data;
      for (const post of posts) {
        postsContainer.innerHTML += renderPost(post, myProfilePage);
        renderTags(post.id, post.tags);
      }
      if (pagination) nextPage = res.data.links.next;
    })
    .catch((error) => {
      isFetching = false;
      postsContainer.innerHTML = `
        <div>
          <img src="./assets/imags/not-found.png" alt="Not Found" class="w-100"/>
        </div>
      `;
      showAlert(error, "danger");
    });
}

function renderPost(post, myProfilePage) {
  const profileImage = post.author.profile_image;
  const userName = post.author.username;
  const postImage = post.image;
  const postDate = post.created_at;
  const postTitle = post.title;
  const postBody = post.body;
  const commentsCount = post.comments_count;

  return `
    <div class="post card shadow mb-3 overflow-hidden">
      <div class="card-header d-flex justify-content-between align-items-center w-100">
        <div id="post-user-info" style="cursor: pointer;" onclick="showProfilePage(${
          post.author.id
        })">
          <img class="rounded-circle border border-2" src="${
            typeof profileImage !== "object"
              ? profileImage
              : "./assets/imags/blank-profile-picture-973460.svg"
          }" alt="profile picture" width="40" height="40">
          <span class="user-name fw-bold ms-2 text-primary">&#64;${userName}</span>
        </div>
        ${showEditAndDeleteBtns(myProfilePage, post.id, postTitle, postBody)}
      </div>
      <div class="card-body">
        ${
          typeof postImage !== "object"
            ? `<div class="overflow-hidden" style="cursor: pointer;" onclick="showPostDetails(${post.id})">
                <img class="w-100" src="${postImage}" alt="Profile Image" onerror="this.src='./assets/imags/image-not-found-icon.svg'"></img>
              </div>`
            : ""
        }
        <span class="post-date my-2 d-block" style="color: rgb(155, 154, 154);">${postDate}</span>
        <h5 class="post-header ${
          postTitle !== null ? "text-black" : "text-danger"
        }">
          ${postTitle !== null ? postTitle : "No Title"}
        </h5>
        <p class="post-content ${
          postBody !== null ? "text-black" : "text-danger"
        }">
          ${postBody !== null ? postBody : "Empty"}
        </p>
        <hr>
        <div class="post-footer d-flex justify-content-between align-items-center" onclick="showPostDetails(${
          post.id
        })">
          <div class="comments-btn d-flex align-items-center" style="cursor: pointer;">
            ${SVG_CHEVRON_DOWN}
            <span class="mx-1">(${commentsCount}) ${
    commentsCount != 1 ? "comments" : "comment"
  }</span>
          </div>
          <div id="post-tags-${post.id}"></div>
        </div>
      </div>
    </div>
  `;
}

function renderTags(postId, tags) {
  const tagButton = document.getElementById("post-tags-" + postId);
  if (!tagButton) return;
  for (const tag of tags) {
    tagButton.innerHTML += `<button class="btn btn-sm btn-secondary">${tag.name}</button>`;
  }
}

function showPostDetails(id) {
  if (isLoggedIn()) {
    window.location.href = `postDetails.html?postId=${id}`;
  } else {
    showAlert("You Have To Log In", "danger");
  }
}

function showProfilePage(id = JSON.parse(localStorage.getItem("user")).id) {
  if (isLoggedIn()) {
    window.location.href = `profilePage.html?userId=${id}`;
  } else {
    showAlert("You Have To Log In", "danger");
  }
}

function showEditAndDeleteBtns(isUserProfile, postId, postTitle, postBody) {
  if (!isUserProfile) return "";
  return `
    <div class="post-btns">
      <button id="edit-post-btn-${postId}" data-postid="${postId}" class="btn btn-primary"
        data-bs-toggle="modal" data-bs-target="#create-post-form"
        onclick="updatePostModal(false, '${postId}', '${postTitle}', '${postBody}')">
        ${SVG_PENCIL}
      </button>
      <button id="delete-post-btn-${postId}" data-postid="${postId}" class="btn btn-danger"
        data-bs-toggle="modal" data-bs-target="#delete-post-modal"
        onclick="deletePostBtnClicked(this.dataset.postid)">
        ${SVG_TRASH}
      </button>
    </div>
  `;
}

// ===================== SVG ICONS =====================

const SVG_PLUS = `
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
  </svg>
`;

const SVG_LOGOUT = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
  </svg>
`;

const SVG_PENCIL = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
  </svg>
`;

const SVG_TRASH = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
  </svg>
`;

const SVG_CHEVRON_DOWN = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
  </svg>
`;

// ===================== END OF FILE =====================

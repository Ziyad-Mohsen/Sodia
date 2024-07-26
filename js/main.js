const baseUrl = "https://tarmeezacademy.com/api/v1";
function setUi() {
  updateNavButtons();
  const createPostPlaceholder = document.getElementById(
    "create-post-button-placeholder"
  );
  const userInfoContainer = document.getElementById("user-info");

  window.addEventListener("scroll", () => {
    const scrollToTopBtn = document.getElementById("scroll-top");
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      scrollToTopBtn.style.setProperty("display", "flex", "important");
    } else {
      scrollToTopBtn.style.setProperty("display", "none", "important");
    }
  });
  if (isLoggedIn()) {
    // Show the add post button
    createPostPlaceholder.innerHTML = `
    <button class="btn btn-primary font-weight-bold d-flex justify-content-center align-items-center rounded-circle shadow" style="width: 50px; height: 50px;" data-bs-toggle="modal" data-bs-target="#create-post-form" onclick="updatePostModal()">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
      </svg>
    </button>`;
    // Show the user info
    const { profile_image, username } = JSON.parse(
      localStorage.getItem("user")
    );
    userInfoContainer.innerHTML = `
    <img class="rounded-circle border border-primary" src="${
      typeof profile_image !== "object"
        ? profile_image
        : "./assets/imags/blank-profile-picture-973460.svg"
    }" alt="user image" width="40" height="40">
      <a class="ms-2 text-decoration-none me-lg-3" href="#">@${username}</a>
    `;
  } else {
    // Hide the add post button
    createPostPlaceholder.innerHTML = "";
    // Hide the user info
    userInfoContainer.innerHTML = "";
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateNavButtons() {
  const buttonsContainer = document.querySelector(".nav-buttons");
  if (isLoggedIn()) {
    // For logged in users
    buttonsContainer.innerHTML = `
    <button class="btn btn-outline-danger d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#logout-message" style="width: 40px; heigth: 40px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
      </svg>
    </button>`;
  } else {
    // For non-logged in users
    buttonsContainer.innerHTML = `
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#login-form">Login</button>
    <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#register-form">Register</button>
    `;
  }
}

function isLoggedIn() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (token && user) {
    return true;
  }
  return false;
}

function register() {
  const url = baseUrl + "/register";
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
  if (image) {
    formData.append("image", image);
  }

  // const params = {
  //   username: username,
  //   password: password,
  //   name: name,
  //   email: email,
  // };

  axios
    .post(url, formData)
    .then((res) => {
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const modal = document.getElementById("register-form");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("You have created a new account", "success");
      window.location.reload();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const params = {
    username: username,
    password: password,
  };
  const url = `${baseUrl}/login`;
  axios
    .post(url, params)
    .then((res) => {
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const modal = document.getElementById("login-form");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Login Successful", "success");
      window.location.reload();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}

function showAlert(myMessage, myType, disappear = true) {
  const alertPlaceholder = document.getElementById("success-alert");
  alertPlaceholder.innerHTML = "";
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(myMessage, myType);
  // Hide the alert automatically
  if (disappear) {
    setTimeout(() => {
      alertPlaceholder.innerHTML = "";
    }, 3500);
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  const modal = document.getElementById("logout-message");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
  showAlert("Logged out", "warning");
  window.location.href = "index.html";
}

async function createPost(id) {
  let url = baseUrl + "/posts";
  // create-post-form
  const newPostTitle = document.getElementById("new-post-title").value;
  const newPostBody = document.getElementById("new-post-body").value;
  const newPostImage = document.getElementById("new-post-image").files[0];

  let formData = new FormData();
  formData.append("title", newPostTitle);
  formData.append("body", newPostBody);
  if (newPostImage) {
    formData.append("image", newPostImage);
  }

  try {
    let res;
    if (id) {
      res = await axios.put(url + `/${id}`, formData, {
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
    const modal = document.getElementById("create-post-form");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    // showAlert("Post Created", "success");
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

function showProfilePage(id = JSON.parse(localStorage.getItem("user")).id) {
  if (isLoggedIn()) {
    window.location.href = `profilePage.html?userId=${id}`;
  } else {
    showAlert("You Have To Log In", "danger");
  }
}

function getPosts(
  url = `${baseUrl}/posts`,
  reload = true,
  pagination = true,
  myProfilePage = false
) {
  const postsContainer = document.getElementById("posts-container");
  if (reload) {
    postsContainer.innerHTML = "";
  }
  isFetchingPhotos = true;
  axios
    .get(url)
    .then((res) => {
      isFetchingPhotos = false;
      let posts = res.data.data;
      for (post of posts) {
        // Post content
        const profileImage = post.author["profile_image"];
        const userName = post.author.username;
        const postImage = post.image;
        const postDate = post["created_at"];
        const postTitle = post.title;
        const postBody = post.body;
        const commentsCount = post["comments_count"];
        const postTags = post.tags;

        postsContainer.innerHTML += `
        <!-- POST -->
          <div class="post card shadow mb-3 overflow-hidden">
            <div class="card-header d-flex justify-content-between align-items-center w-100">
              <div id="post-user-info" style="cursor: pointer;" onclick="showProfilePage(${
                post.author.id
              })">
                <img  class="rounded-circle border border-2" src="${
                  typeof profileImage !== "object"
                    ? profileImage
                    : "./assets/imags/blank-profile-picture-973460.svg"
                }" alt="profile picture" width="40" height="40">
                <span class="user-name fw-bold ms-2 text-primary">&#64;${userName}</span>
              </div>
              ${showEditAndDeleteBtns(
                myProfilePage,
                post.id,
                postTitle,
                postBody
              )}
            </div>
            <div class="card-body">
              ${
                typeof postImage !== "object"
                  ? `<div class="overflow-hidden" style="cursor: pointer;" onclick="showPostDetails(${post.id})"><img class="w-100" src="${postImage}" alt="Profile Image" onerror="this.src='./assets/imags/image-not-found-icon.svg'")"></img></div>`
                  : ""
              }
              <span class="post-date my-2 d-block" style="color: rgb(155, 154, 154);">${postDate}</span>
              <h5 class="post-header ${
                postTitle !== null ? "text-black" : "text-danger"
              }">${postTitle !== null ? postTitle : "No Title"}</h5>
              <p class="post-content ${
                postBody !== null ? "text-black" : "text-danger"
              }">${postBody !== null ? postBody : "Empty"}</p>
              <hr>
              <div class="post-footer d-flex justify-content-between align-items-center" onclick="showPostDetails(${
                post.id
              })">
                <div class="comments-btn d-flex align-items-center" style="cursor: pointer;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                  </svg>
                  <span class="mx-1">(${commentsCount}) ${
          commentsCount != 1 ? "comments" : "comment"
        }</span>
                </div>
                <div id="post-tags-${post.id}"></div>
                </div>
            </div>
          </div>
        <!--// POST //-->
        `;

        // Add the tags
        let tagButton = document.getElementById("post-tags-" + post.id);
        for (tag of postTags) {
          tagButton.innerHTML += `
          <button class="btn btn-sm btn-secondary">${tag.name}</button>
        `;
        }
      }
      if (pagination) {
        nextPage = res.data.links.next;
      }
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

function showPostDetails(id) {
  if (isLoggedIn()) {
    window.location.href = `postDetails.html?postId=${id}`;
  } else {
    showAlert("You Have To Log In", "danger");
  }
}

function showEditAndDeleteBtns(isUserProfile, postId, postTitle, postBody) {
  const editBtn = `
  <button id="edit-post-btn-${postId}" data-postid="${postId}" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#create-post-form" onclick="updatePostModal(false, '${postId}', '${postTitle}', '${postBody}')">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
  </svg> 
  </button>
  `;
  const deleteBtn = `
  <button id="delete-post-btn-${postId}" data-postid="${postId}" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-post-modal" onclick="deletePostBtnClicked(this.dataset.postid)">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
    </svg>
  </button>
  `;
  if (isUserProfile) {
    return `
    <div class="post-btns">
      ${editBtn}
      ${deleteBtn}
    </div>`;
  } else {
    return "";
  }
}

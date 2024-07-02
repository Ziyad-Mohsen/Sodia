const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");
let myProfilePage = false;
let myUserId = '';
if (isLoggedIn()) {
  myUserId = JSON.parse(localStorage.getItem("user")).id;
  myProfilePage = Boolean(userId == myUserId);
}
setUi();
showProfile(userId);
getPosts( `${baseUrl}/users/${userId}/posts`, true, false, myProfilePage);

async function showProfile(id) {
  const userInfoContainer = document.getElementById('user-info-container');
  try {
    const res = await axios.get(`${baseUrl}/users/${id}`)
    const data = await res.data.data;
    const image = typeof data.profile_image !== "object" ? data.profile_image : './assets/imags/blank-profile-picture-973460.svg';
    userInfoContainer.innerHTML = `
      <div class="card w-100 shadow mb-5" style="width: 18rem;">
        <div id="user-info-card" class="card-body">
          <div class="row p-3">
            <div class="col-3 d-flex justify-content-center">
              <img class="rounded-circle" src="${image}" alt="" width="80px" height="80px">
            </div>
            <div class="col-5">
              <h5 class="username text-primary">@${data.username}</h5>
              <h5 class="name">${data.name}</h5>
              <h5 class="email">${data.email}</h5>
            </div>
            <div class="col-4">
              <h5 class="fs-2">${data.posts_count} <span class="text-body-tertiary fs-6">${data.posts_count === 1 ? 'post' : 'posts'}</span></h5>
              <h5 class="fs-2">${data.comments_count} <span class="text-body-tertiary fs-6">${data.comments_count === 1 ? 'comment' : 'comments'}</span></h5>
            </div>
          </div>
        </div>
      </div>
      <div class="card p-3 border-bottom-0 rounded-0 rounded-top">
        <h4>${data.username}'posts</h4>
      </div>
      ${data.posts_count === 0 ? `<div class="card p-3">No Posts</div>` : ''}
    `;
  } catch {
    showAlert("Faild To Get User Info", "danger");
  }
}

function deletePostBtnClicked(id) {
  const deleteModal = document.getElementById("modal-delete-btn");
  deleteModal.dataset.postid = id;
}

async function deletePost(id) {
  try {
    const res = await axios.delete(`${baseUrl}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    const modal = document.getElementById("delete-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showProfile(userId);
    getPosts( `${baseUrl}/users/${userId}/posts`, true, false, myProfilePage);
  } catch (error) {
    showAlert(error, "danger");
  }
}

function updatePostModal(isNew = true, postId = '', title = '', body = '') {
  const modalHeader = document.getElementById("create-post-label");
  const postTitle = document.getElementById("new-post-title");
  const postBody = document.getElementById("new-post-body");
  const button = document.getElementById("create-post-btn");
  const imageFeild = document.getElementById("post-image-input");
  imageFeild.style.display = isNew ? "block" : "none";
  modalHeader.textContent = isNew ? "Create New Post" : "Edit Post";
  button.textContent = isNew ? "Create" : "Edit";
  postTitle.value = title;
  postBody.value = body;
  button.setAttribute("data-postid", postId)
}

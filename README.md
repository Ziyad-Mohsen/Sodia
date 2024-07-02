Sodia
=====

Sodia is a social media website built with HTML, CSS, Bootstrap, and JavaScript. This project utilizes the [Tarmeez Academy API](https://documenter.getpostman.com/view/4696539/2s83zjqN3F) to provide social media functionalities such as user registration, login/logout, creating, editing, and deleting posts, infinite scrolling, and pagination. The application consists of three main pages: Home, Post Details, and Profile. [Visit Sodia Website](https://ziyad-mohsen.github.io/Sodia/index.html)

Table of Contents
-----------------

-   [Features](#features)
-   [Pages](#pages)
-   [Technologies Used](#technologies-used)
-   [Installation](#installation)
-   [Usage](#usage)
-   [API Endpoints](#api-endpoints)
-   [Contributing](#contributing)

Features
--------

-   User registration and login/logout functionality
-   Infinite scrolling and pagination for posts
-   Create, edit, and delete posts
-   View post details and add comments
-   View user profiles and manage own posts

Pages
-----

### Home Page

-   Displays a feed of posts.
-   Supports infinite scrolling and pagination.
-   Allows users to create new posts.

### Post Details Page

-   Shows the details of a selected post.
-   Allows users to add comments to the post.

### Profile Page

-   Displays the profile of the user clicked on.
-   If viewing own profile, users can edit or delete their posts.

Technologies Used
-----------------

-   HTML
-   CSS
-   Bootstrap
-   JavaScript
-   axios
-   [Tarmeez Academy API](https://documenter.getpostman.com/view/4696539/2s83zjqN3F)

Installation
------------

1.  Clone the repository:
   
    ```sh
    git clone https://github.com/Ziyad-Mohsen/Sodia.git

3.  Navigate to the project directory:
   
    ```sh
    cd sodia

Usage
-----

1.  Open `index.html` in your web browser to start the application.
2.  Register a new user or log in with existing credentials.
3.  Explore the Home page to see the feed of posts.
4.  Click on a post to view its details and add comments.
5.  Visit user profiles by clicking on usernames.
6.  Manage your own posts by visiting your profile.

API Endpoints
-------------

This project is based on the [Tarmeez Academy API](https://tarmeezacademy.com/api/v1). Some of the key endpoints used are:

-   `POST /login`: Log in a user.
-   `POST /register`: Register a new user.
-   `GET /posts`: Retrieve a list of posts.
-   `POST /posts`: Create a new post.
-   `PUT /posts/{id}`: Edit a post.
-   `DELETE /posts/{id}`: Delete a post.
-   `GET /posts/{id}`: Retrieve post details.
-   `POST /posts/{id}/comments`: Add a comment to a post.
-   `GET /users/{id}`: Retrieve user profile details.

For a full list of endpoints and their usage, refer to the [API documentation](https://documenter.getpostman.com/view/4696539/2s83zjqN3F).

Contributing
------------

Contributions are welcome! Please fork this repository and submit a pull request for any enhancements or bug fixes.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b [Your feature]-branch`).
3.  Commit your changes (`git commit -m 'Add new feature'`).
4.  Push to the branch (`git push origin [Your feature]-branch`).
5.  Open a pull request.

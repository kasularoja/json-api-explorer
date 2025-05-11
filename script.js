const postList = document.getElementById("postList");
const postForm = document.getElementById("postForm");
const fetchButton = document.getElementById("fetchButton");
const loadingMessage = document.getElementById("loadingMessage");
const filterInput = document.getElementById("filterInput");

let allPosts = []; // Store posts globally for filtering/deleting

// Render posts into DOM
const renderPosts = (posts) => {
    postList.innerHTML = "";
    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.setAttribute("data-id", post.id);
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <button onclick="deletePost(${post.id})">Delete</button>
            <hr/>
        `;
        postList.appendChild(postElement);
    });
};

// Submit a new post
postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("titleInput").value;
    const body = document.getElementById("bodyInput").value;

    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ title, body })
    })
    .then(response => response.json())
    .then((newPost) => {
        alert("Post submitted!");
        allPosts.unshift(newPost); // Add to beginning
        renderPosts(allPosts);
        postForm.reset(); // Clear form
    })
    .catch((error) => console.error("Error submitting post:", error));
});

// Fetch and render posts
fetchButton.addEventListener("click", () => {
    loadingMessage.style.display = 'block';

    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(data => {
            allPosts = data;
            const keyword = filterInput.value.toLowerCase();
            const filteredPosts = keyword
                ? allPosts.filter(post =>
                    post.title.toLowerCase().includes(keyword) ||
                    post.body.toLowerCase().includes(keyword)
                )
                : allPosts;
            renderPosts(filteredPosts);
        })
        .catch(error => console.error("Error fetching posts:", error))
        .finally(() => {
            loadingMessage.style.display = 'none';
        });
});

// Filter while typing
filterInput.addEventListener("input", () => {
    const keyword = filterInput.value.toLowerCase();
    const filteredPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(keyword) ||
        post.body.toLowerCase().includes(keyword)
    );
    renderPosts(filteredPosts);
});

// Delete post
async function deletePost(postId) {
    try {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'DELETE',
        });
        alert(`Post ${postId} deleted.`);
        allPosts = allPosts.filter(post => post.id !== postId);
        renderPosts(allPosts);
    } catch (error) {
        console.error("Error deleting post:", error);
    }
}

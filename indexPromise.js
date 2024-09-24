document.addEventListener("DOMContentLoaded", function () {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((posts) => {
      let appElement = document.getElementById("app");
      let postPromises = posts.map((post) => {
        // Obtener el usuario y comentarios para cada post simultáneamente
        let userPromise = fetch(
          "https://jsonplaceholder.typicode.com/users?id=" + post.userId
        )
          .then((response) => response.json())
          .then((user) => user[0]); // Extraer el primer usuario del array

        let commentsPromise = fetch(
          "https://jsonplaceholder.typicode.com/comments?postId=" + post.id
        ).then((response) => response.json());

        // Resolver ambas promesas simultáneamente
        return Promise.all([userPromise, commentsPromise]).then(
          ([user, comments]) => {
            let commentHTML = '<div class="accordion" id="accordionComments">';
            comments.forEach((comment, index) => {
              commentHTML += `
                  <div class="card">
                    <div class="card-header">
                      <a class="btn" data-bs-toggle="collapse" href="#collapse${post.id}_${index}">
                        ${comment.name}
                      </a>
                    </div>
                    <div id="collapse${post.id}_${index}" class="collapse" data-bs-parent="#accordionComments">
                      <div class="card-body">${comment.body}</div>
                    </div>
                  </div>`;
            });
            commentHTML += "</div>";

            return `
                <div class="border p-3 mb-3 border-dark rounded">
                  <h2 class="card-title">${post.title}</h2>
                  <p>${post.body}</p>
                  <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#modalUser${user.id}">
                    ${user.name}
                  </button>
                  <div class="modal fade" id="modalUser${user.id}" tabindex="-1" aria-labelledby="userModalLabel${user.id}" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="userModalLabel${user.id}">${user.name}</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <p><strong>Email:</strong> ${user.email}</p>
                          <p><strong>Phone:</strong> ${user.phone}</p>
                          <p><strong>Website:</strong> ${user.website}</p>
                          <p><strong>Company:</strong> ${user.company.name}</p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  ${commentHTML}
                </div>
              `;
          }
        );
      });

      // Una vez que todas las promesas se hayan resuelto, actualizar el DOM
      Promise.all(postPromises).then((postsHTML) => {
        appElement.innerHTML = postsHTML.join("");
      });
    });
});

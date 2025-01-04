document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    const search = document.getElementById("search");
  
    // Carrega dados
    fetch("dados.json")
      .then(response => response.json())
      .then(data => {
        renderContent(data);
        search.addEventListener("input", () => filterContent(data));
      });
  
    // Renderiza conteúdo inicial
    function renderContent(data) {
      content.innerHTML = "";
      const watchedMovies = getWatchedMovies();
  
      data.forEach((item, index) => {
        const isWatched = watchedMovies.includes(index.toString());
  
        const card = `
          <div class="col-md-3 mb-4">
            <div class="card ${isWatched ? "border-success" : ""}">
              <img src="${item.cover}" class="card-img-top" alt="${item.title}" loading="lazy">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                ${
                  item.type === "filme"
                    ? `<a href="${item.url}" class="btn btn-primary" target="_blank">Assistir</a>
                       <button class="btn btn-${isWatched ? "success" : "secondary"} mt-2 mark-watched" data-id="${index}">
                         ${isWatched ? "Visto" : "Marcar como Visto"}
                       </button>`
                    : `<a href="serie.html?id=${index}" class="btn btn-primary">Ver Episódios</a>`
                }
              </div>
            </div>
          </div>`;
        content.innerHTML += card;
      });
  
      // Adiciona evento para os botões "Marcar como Visto"
      document.querySelectorAll(".mark-watched").forEach(button => {
        button.addEventListener("click", () => {
          const movieId = button.getAttribute("data-id");
          toggleWatchedMovie(movieId);
          renderContent(data); // Re-renderiza o conteúdo
        });
      });
    }
  
    // Filtra conteúdo
    function filterContent(data) {
      const query = search.value.toLowerCase();
      const filtered = data.filter(item => item.title.toLowerCase().includes(query));
      renderContent(filtered);
    }
  
    // Obter filmes marcados como vistos do localStorage
    function getWatchedMovies() {
      return JSON.parse(localStorage.getItem("watchedMovies")) || [];
    }
  
    // Alterna o status de "visto" para um filme
    function toggleWatchedMovie(movieId) {
      const watchedMovies = getWatchedMovies();
      if (watchedMovies.includes(movieId)) {
        const index = watchedMovies.indexOf(movieId);
        watchedMovies.splice(index, 1);
      } else {
        watchedMovies.push(movieId);
      }
      localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
    }
  });
  
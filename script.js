const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");

function fillDropdown(shows) {
    showSelect.innerHTML = ""
    const placeholder = document.createElement("option")
    placeholder.value = ""
    placeholder.textContent = "Please choose a show..."
    showSelect.appendChild(placeholder)
    for (const show of shows) {
      const opt = document.createElement("option")
      opt.value = show.id
      opt.textContent = show.name
      showSelect.appendChild(opt)
    }
}

async function loadShows() {
  const url = "https://api.tvmaze.com/shows?page=0";

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const shows = await res.json();
    const getRatings = (show) => show.rating?.average || 0
    shows.sort((a, b) => getRatings(b) - getRatings(a))
    const top25Shows = shows.slice(0, 25)
    fillDropdown(top25Shows)
  } catch (error) {
    console.error(error);
  }
}

loadShows();

function displayDetails(show) {
  // 1. Clear #show-details
  showDetails.innerHTML = ""
  // 2. Create and append the heading
  const heading = document.createElement("h2")
  heading.textContent = show.name
  showDetails.appendChild(heading)
  // 3. If image exists: create the img, set src and alt, append it. Otherwise: create a message element, append it
  if (show.image && show.image.medium) {
    const img = document.createElement("img")
    img.src = show.image.medium
    img.alt = `Poster for ${show.name}`
    showDetails.appendChild(img)
  } else {
    const noImg = document.createElement("p")
    noImg.textContent = "No image available."
    showDetails.appendChild(noImg)
  }
  // 4. Create a container for the summary, set its HTML, append it
  const summary = document.createElement("div")
  summary.innerHTML = show.summary || "<p>No summary available.</p>"
  showDetails.appendChild(summary)
  // 5. Create and append one line with genres, premiered, status, and rating
  const genres = show.genres && show.genres.length ? show.genres.join(", ") : "N/A"
  const premiered = show.premiered || "N/A"
  const status = show.status || "N/A"
  const rating = show.rating?.average ?? "N/A"

  const info = document.createElement("p")
  info.textContent = `Genres: ${genres} | Premiered: ${premiered} | Status: ${status} | Rating: ${rating}`
  showDetails.appendChild(info)
}

async function loadShowDetails(id) {
  const url = `https://api.tvmaze.com/shows/${id}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const show = await res.json();
    displayDetails(show)
  } catch (error) {
    console.error(error);
  }
}

showSelect.addEventListener("change", function () {
  const id = showSelect.value;

  if (id === "") {
    return;
  }

  loadShowDetails(id);
});
const showSelect = document.getElementById("show-select")
const showDetails = document.getElementById("show-details")
const message = document.getElementById("message")

function setMessage(text) {
  message.textContent = text
}

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
  const url = "https://api.tvmaze.com/shows?page=0"

  setMessage("Loading top shows...")

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`)
    }

    const shows = await res.json()
    const getRatings = (show) => show.rating?.average || 0
    shows.sort((a, b) => getRatings(b) - getRatings(a))
    const top25Shows = shows.slice(0, 25)
    fillDropdown(top25Shows)
    setMessage("")
  } catch (error) {
    console.error(error)
    setMessage("Sorry, the show list couldn't be loaded. Try again later.")
  }
}

loadShows();

function displayDetails(show) {
  showDetails.innerHTML = ""
  const heading = document.createElement("h2")
  heading.textContent = show.name
  showDetails.appendChild(heading)
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
  const summary = document.createElement("div")
  summary.innerHTML = show.summary || "<p>No summary available.</p>"
  showDetails.appendChild(summary)
  const genres = show.genres && show.genres.length ? show.genres.join(", ") : "N/A"
  const premiered = show.premiered || "N/A"
  const status = show.status || "N/A"
  const rating = show.rating?.average ?? "N/A"

  const info = document.createElement("p")
  info.textContent = `Genres: ${genres} | Premiered: ${premiered} | Status: ${status} | Rating: ${rating}`
  showDetails.appendChild(info)
}

async function loadShowDetails(id) {
  const url = `https://api.tvmaze.com/shows/${id}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("That show could not be found.");
      }
      throw new Error(`Request failed with status ${res.status}`);
    }

    const show = await res.json()
    displayDetails(show)
  } catch (error) {
    console.error(error)
    if (error.message === "That show could not be found.") {
      setMessage(error.message)
    } else {
      setMessage("Sorry, the details of the show couldn't be loaded as of now. Try again later.")
    }
  }
}

showSelect.addEventListener("change", function () {
  const id = showSelect.value

  if (id === "") {
    showDetails.innerHTML = ""
    setMessage("")
    return;
  }

  loadShowDetails(id);
});
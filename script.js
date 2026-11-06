const showSelect = document.getElementById("show-select");

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
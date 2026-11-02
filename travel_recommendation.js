document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const clearBtn = document.getElementById("clearBtn");
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("resultsContainer");

    if (searchBtn) {
        searchBtn.addEventListener("click", performSearch);
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            resultsContainer.innerHTML = "";
        });
    }

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        resultsContainer.innerHTML = "";

        if (!query) return;

        fetch("travel_recommendation.json")
            .then(response => response.json())
            .then(data => {
                let results = [];

                if (query.includes("beach")) {
                    results = data.beaches;
                } else if (query.includes("temple")) {
                    results = data.temples;
                } else if (query.includes("country") || query.includes("japan") || query.includes("brazil")) {
                    // Елдерді іздегенде ішіндегі қалаларды шығарамыз
                    data.countries.forEach(country => {
                        if (country.name.toLowerCase().includes(query) || query.includes("country")) {
                            results = results.concat(country.cities);
                        }
                    });
                } else {
                    // Жалпы сөздер бойынша іздеу
                    data.beaches.forEach(item => { if (item.name.toLowerCase().includes(query)) results.push(item); });
                    data.temples.forEach(item => { if (item.name.toLowerCase().includes(query)) results.push(item); });
                    data.countries.forEach(country => {
                        if (country.name.toLowerCase().includes(query)) {
                            results = results.concat(country.cities);
                        } else {
                            country.cities.forEach(city => {
                                if (city.name.toLowerCase().includes(query)) results.push(city);
                            });
                        }
                    });
                }

                displayResults(results);
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function displayResults(items) {
        if (items.length === 0) {
            resultsContainer.innerHTML = `<p class="no-result">No recommendations found. Try searching for "beach", "temple", or "Japan".</p>`;
            return;
        }

        items.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("result-card");

            card.innerHTML = `
                <div class="image-gallery">
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <img src="${item.imageUrl2}" alt="${item.name} second view">
                </div>
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <button class="visit-btn">Visit</button>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }
});

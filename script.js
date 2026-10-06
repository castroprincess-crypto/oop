/* =========================================================
   CEBU PICKLEBALL HUB
   JAVASCRIPT
   Connected to Java CourtAPI + MySQL
   ========================================================= */


/* =========================
   API CONFIGURATION
   ========================= */

const API_URL = "http://localhost:8080/api/courts";

let courtData = {};
let courts = [];


/* =========================
   MOBILE NAVIGATION
   ========================= */

const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

if (menuButton && navMenu) {

    menuButton.addEventListener("click", () => {
        navMenu.classList.toggle("open");
    });

}


navLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (navMenu) {
            navMenu.classList.remove("open");
        }

    });

});


/* =========================
   ACTIVE NAVIGATION
   ========================= */

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 120;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================
   COURT ELEMENTS
   ========================= */

const courtGrid =
    document.getElementById("courtGrid");

const filterButtons =
    document.querySelectorAll(".filter-button");


/* =========================
   LOCATION HELPER
   ========================= */

function normalizeLocation(location) {

    if (!location) {
        return "all";
    }

    return location
        .toLowerCase()
        .trim()
        .replace(/ city/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

}


/* =========================
   FORMAT RATE
   ========================= */

function formatRate(rate) {

    if (
        rate === null ||
        rate === undefined ||
        rate === ""
    ) {

        return "Rate not available";

    }

    const numericRate =
        Number(rate);

    if (!isNaN(numericRate)) {

        return `₱${numericRate}/hour`;

    }

    return rate;

}


/* =========================
   COURT IMAGES
   ========================= */

const courtImages = [

    "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80",

    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=900&q=80",

    "https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=900&q=80"

];


function getCourtImage(index) {

    return courtImages[
        index % courtImages.length
    ];

}


/* =========================
   LOAD COURTS FROM JAVA API
   ========================= */

async function loadCourts() {

    if (!courtGrid) {
        return;
    }


    /* Show loading message */

    courtGrid.innerHTML = `

        <div class="loading-courts">

            <h3>
                Loading courts...
            </h3>

            <p>
                Getting court information from the database.
            </p>

        </div>

    `;


    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Courts received from Java API:",
            data
        );


        /*
            The API may return either:

            [
                {...},
                {...}
            ]

            or:

            {
                "courts": [...]
            }
        */

        if (Array.isArray(data)) {

            courts = data;

        } else if (
            data &&
            Array.isArray(data.courts)
        ) {

            courts = data.courts;

        } else {

            throw new Error(
                "Invalid court data received from API."
            );

        }


        /* Check if database has no courts */

        if (courts.length === 0) {

            courtGrid.innerHTML = `

                <div class="loading-courts">

                    <h3>
                        No courts found
                    </h3>

                    <p>
                        No court records are currently available.
                    </p>

                </div>

            `;

            return;

        }


        /* Clear old manual court cards */

        courtGrid.innerHTML = "";


        /* Create court lookup */

        courtData = {};


        /* Create cards */

        courts.forEach((court, index) => {

            createCourtCard(court, index);

        });


        /* Update booking court dropdown */

        updateCourtSelect();


        console.log(
            `${courts.length} court(s) loaded successfully.`
        );


    } catch (error) {

        console.error(
            "Unable to load courts:",
            error
        );


        courtGrid.innerHTML = `

            <div class="loading-courts">

                <h3>
                    Unable to load courts
                </h3>

                <p>
                    Please make sure CourtAPI.java
                    is running on port 8080.
                </p>

                <p>
                    API:
                    http://localhost:8080/api/courts
                </p>

            </div>

        `;

    }

}


/* =========================
   CREATE COURT CARD
   ========================= */

function createCourtCard(court, index) {

    const courtName =
        court.court_name ||
        court.courtName ||
        "Unnamed Court";


    const location =
        court.location ||
        "Location unavailable";


    const rate =
        formatRate(court.rate);


    const schedule =
        court.schedule ||
        "Schedule not available";


    const facilities =
        court.facilities ||
        "";


    const bookingDetails =
        court.booking_details ||
        court.bookingDetails ||
        "Court available for booking.";


    const locationSlug =
        normalizeLocation(location);


    /*
        Store complete court information
        using the court name as the key.
    */

    courtData[courtName] = {

        name: courtName,

        location: location,

        price: rate,

        schedule: schedule,

        facilities: facilities,

        bookingDetails: bookingDetails

    };


    /* Create article */

    const card =
        document.createElement("article");


    card.className =
        "court-card";


    card.setAttribute(
        "data-location",
        locationSlug
    );


    card.setAttribute(
        "data-court",
        courtName
    );


    /* Create card HTML */

    card.innerHTML = `

        <div class="court-image">

            <img
                src="${getCourtImage(index)}"
                alt="${escapeHTML(courtName)}"
            >

            <span class="court-status available">
                AVAILABLE
            </span>

        </div>


        <div class="court-info">

            <div class="court-location">
                📍 ${escapeHTML(location)}
            </div>

            <h3>
                ${escapeHTML(courtName)}
            </h3>

            <p>
                ${escapeHTML(
                    String(bookingDetails)
                )}
            </p>


            <div class="court-details">

                <span>
                    ${escapeHTML(rate)}
                </span>

                <span>
                    🕐 ${escapeHTML(
                        String(schedule)
                    )}
                </span>

            </div>


            <div class="court-actions">

                <button
                    class="btn-small details-button"
                    data-court="${escapeAttribute(courtName)}"
                >
                    DETAILS
                </button>

                <button
                    class="btn-small book-button"
                    data-court="${escapeAttribute(courtName)}"
                >
                    BOOK
                </button>

            </div>

        </div>

    `;


    courtGrid.appendChild(card);

}


/* =========================
   SECURITY HELPERS
   ========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return String(value)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================
   UPDATE BOOKING DROPDOWN
   ========================= */

function updateCourtSelect() {

    const courtSelect =
        document.getElementById("courtSelect");


    if (!courtSelect) {
        return;
    }


    /* Keep first option */

    courtSelect.innerHTML = `

        <option value="">
            Choose a court
        </option>

    `;


    courts.forEach(court => {

        const courtName =
            court.court_name ||
            court.courtName ||
            "Unnamed Court";


        const option =
            document.createElement("option");


        option.value =
            courtName;


        option.textContent =
            courtName;


        courtSelect.appendChild(option);

    });

}


/* =========================
   COURT FILTERING
   ========================= */

function filterCourts(filter) {

    const cards =
        document.querySelectorAll(".court-card");


    cards.forEach(card => {

        const location =
            card.getAttribute("data-location");


        if (
            filter === "all" ||
            location === filter
        ) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

}


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        const filter =
            button.getAttribute("data-filter");


        filterCourts(filter);

    });

});


/* =========================
   SEARCH COURTS
   ========================= */

const searchButton =
    document.getElementById("searchButton");

const locationFilter =
    document.getElementById("locationFilter");

const searchDate =
    document.getElementById("searchDate");


if (searchButton) {

    searchButton.addEventListener("click", () => {

        const selectedLocation =
            locationFilter.value;


        filterButtons.forEach(button => {

            const filter =
                button.getAttribute("data-filter");


            button.classList.remove("active");


            if (
                filter === selectedLocation
            ) {

                button.classList.add("active");

            }

        });


        filterCourts(
            selectedLocation
        );


        document
            .getElementById("courts")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

}


/* =========================
   COURT MODAL
   ========================= */

const courtModal =
    document.getElementById("courtModal");

const modalClose =
    document.getElementById("modalClose");

const modalCourtName =
    document.getElementById("modalCourtName");

const modalLocation =
    document.getElementById("modalLocation");

const modalPrice =
    document.getElementById("modalPrice");

const modalRating =
    document.getElementById("modalRating");

const modalBookButton =
    document.getElementById("modalBookButton");


/* =========================
   OPEN COURT DETAILS
   ========================= */

document.addEventListener("click", (event) => {

    const detailsButton =
        event.target.closest(
            ".details-button"
        );


    if (!detailsButton) {
        return;
    }


    const courtName =
        detailsButton.getAttribute(
            "data-court"
        );


    const court =
        courtData[courtName];


    if (!court) {

        console.error(
            "Court information not found:",
            courtName
        );

        return;

    }


    modalCourtName.textContent =
        court.name;


    modalLocation.textContent =
        court.location;


    modalPrice.textContent =
        court.price;


    /*
        Your current database/API does not
        provide a rating field.

        Therefore we do not invent a rating.
    */

    modalRating.textContent =
        "Not available";


    /* Update operating hours */

    const modalDetails =
        document.querySelector(
            ".modal-details"
        );


    if (modalDetails) {

        const paragraphs =
            modalDetails.querySelectorAll("p");


        /*
            Paragraph 3 is the operating
            hours paragraph in your HTML.
        */

        if (paragraphs.length >= 3) {

            paragraphs[2].innerHTML = `

                🕐 <strong>
                    Operating Hours:
                </strong>

                <span>
                    ${escapeHTML(
                        String(court.schedule)
                    )}
                </span>

            `;

        }

    }


    /* Add facilities if available */

    let facilitiesElement =
        document.getElementById(
            "modalFacilities"
        );


    if (!facilitiesElement) {

        facilitiesElement =
            document.createElement("p");

        facilitiesElement.id =
            "modalFacilities";


        modalDetails.appendChild(
            facilitiesElement
        );

    }


    if (court.facilities) {

        facilitiesElement.innerHTML = `

            🏟️ <strong>
                Facilities:
            </strong>

            <span>
                ${escapeHTML(
                    String(court.facilities)
                )}
            </span>

        `;

        facilitiesElement.style.display =
            "block";

    } else {

        facilitiesElement.style.display =
            "none";

    }


    /* Store selected court */

    modalBookButton.setAttribute(
        "data-court",
        courtName
    );


    /* Show modal */

    courtModal.classList.add("show");


    document.body.style.overflow =
        "hidden";

});


/* =========================
   CLOSE MODAL
   ========================= */

function closeModal() {

    courtModal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeModal
    );

}


if (courtModal) {

    courtModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === courtModal
            ) {

                closeModal();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


/* =========================
   BOOK BUTTONS
   ========================= */

const courtSelect =
    document.getElementById("courtSelect");

const bookingSection =
    document.getElementById("booking");


document.addEventListener("click", (event) => {

    const bookButton =
        event.target.closest(
            ".book-button"
        );


    if (!bookButton) {
        return;
    }


    const courtName =
        bookButton.getAttribute(
            "data-court"
        );


    if (courtSelect) {

        courtSelect.value =
            courtName;

    }


    bookingSection.scrollIntoView({
        behavior: "smooth"
    });

});


/* =========================
   BOOK FROM MODAL
   ========================= */

if (modalBookButton) {

    modalBookButton.addEventListener(
        "click",
        () => {

            const courtName =
                modalBookButton.getAttribute(
                    "data-court"
                );


            if (courtSelect) {

                courtSelect.value =
                    courtName;

            }


            closeModal();


            bookingSection.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


/* =========================
   BOOKING FORM
   ========================= */

const bookingForm =
    document.getElementById("bookingForm");

const playerName =
    document.getElementById("playerName");

const playerContact =
    document.getElementById("playerContact");

const bookingDate =
    document.getElementById("bookingDate");

const bookingTime =
    document.getElementById("bookingTime");

const playerCount =
    document.getElementById("playerCount");

const bookingList =
    document.getElementById("bookingList");


/* =========================
   SET MINIMUM DATE
   ========================= */

const today =
    new Date()
        .toISOString()
        .split("T")[0];


if (bookingDate) {
    bookingDate.min = today;
}


if (searchDate) {
    searchDate.min = today;
}


/* =========================
   LOCAL STORAGE
   ========================= */

function getBookings() {

    const bookings =
        localStorage.getItem(
            "pickleballBookings"
        );


    if (!bookings) {

        return [];

    }


    try {

        return JSON.parse(
            bookings
        );

    } catch (error) {

        console.error(
            "Unable to read bookings:",
            error
        );

        return [];

    }

}


function saveBookings(bookings) {

    localStorage.setItem(
        "pickleballBookings",
        JSON.stringify(bookings)
    );

}


/* =========================
   DISPLAY BOOKINGS
   ========================= */

function displayBookings() {

    if (!bookingList) {
        return;
    }


    const bookings =
        getBookings();


    if (bookings.length === 0) {

        bookingList.innerHTML = `

            <div class="empty-bookings">

                <div>
                    📅
                </div>

                <h3>
                    No bookings yet
                </h3>

                <p>
                    Your reservations will appear here.
                </p>

                <a
                    href="#booking"
                    class="btn btn-primary"
                >
                    BOOK A COURT
                </a>

            </div>

        `;

        return;

    }


    bookingList.innerHTML = "";


    bookings.forEach(
        (booking, index) => {

            const bookingElement =
                document.createElement(
                    "div"
                );


            bookingElement.className =
                "booking-item";


            bookingElement.innerHTML = `

                <div>

                    <span class="section-label">
                        BOOKING #${index + 1}
                    </span>

                    <h3>
                        ${escapeHTML(
                            booking.court
                        )}
                    </h3>

                    <p>
                        👤 ${escapeHTML(
                            booking.name
                        )}
                    </p>

                    <p>
                        📅 ${escapeHTML(
                            booking.date
                        )}
                    </p>

                    <p>
                        🕐 ${escapeHTML(
                            booking.time
                        )}
                    </p>

                    <p>
                        👥 ${escapeHTML(
                            booking.players
                        )}
                    </p>

                </div>


                <div>

                    <span class="booking-confirmed">
                        CONFIRMED
                    </span>

                </div>

            `;


            bookingList.appendChild(
                bookingElement
            );

        }
    );

}


/* =========================
   SUBMIT BOOKING
   ========================= */

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const booking = {

                name:
                    playerName.value.trim(),

                contact:
                    playerContact.value.trim(),

                court:
                    courtSelect.value,

                date:
                    bookingDate.value,

                time:
                    bookingTime.value,

                players:
                    playerCount.value

            };


            /* Validation */

            if (
                !booking.name ||
                !booking.contact ||
                !booking.court ||
                !booking.date ||
                !booking.time
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            const bookings =
                getBookings();


            bookings.push(
                booking
            );


            saveBookings(
                bookings
            );


            displayBookings();


            bookingForm.reset();


            bookingDate.min =
                today;


            alert(
                "Your court booking has been submitted successfully!"
            );


            document
                .getElementById("bookings")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


/* =========================
   SEARCH DATE
   ========================= */

if (searchDate) {

    searchDate.addEventListener(
        "change",
        () => {

            console.log(
                "Selected date:",
                searchDate.value
            );

        }
    );

}


/* =========================
   INITIALIZE WEBSITE
   ========================= */

displayBookings();


/*
    IMPORTANT:

    Load court information from
    Java + MySQL when the page starts.
*/

loadCourts();
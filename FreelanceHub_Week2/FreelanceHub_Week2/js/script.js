document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("active"));
  }

  // Sample freelancer and service data for the marketplace
  const freelancers = [
    {id:1,name:"James Anderson",role:"Full-stack Developer",service:"I will build a responsive business website",category:"Web Development",rating:4.9,reviews:120,price:12000,initials:"JA",avatar:"https://i.pravatar.cc/120?img=12",bio:"Full-stack developer focused on fast, accessible and responsive websites for growing businesses.",skills:["HTML","CSS","JavaScript","React"],experience:"5 years"},
    {id:2,name:"Sofia Martinez",role:"Brand Designer",service:"I will design a memorable logo and brand identity",category:"Graphic Design",rating:5.0,reviews:85,price:8500,initials:"SM",avatar:"https://i.pravatar.cc/120?img=47",bio:"Brand designer creating thoughtful visual identities, social graphics and polished brand systems.",skills:["Logo Design","Illustrator","Photoshop","Branding"],experience:"4 years"},
    {id:3,name:"Marcus Kim",role:"Data Analyst",service:"I will clean and visualize your business data",category:"Data Analysis",rating:4.8,reviews:200,price:10000,initials:"MK",avatar:"https://i.pravatar.cc/120?img=11",bio:"Data analyst turning spreadsheets and business data into clear reports and useful dashboards.",skills:["Excel","SQL","Power BI","Python"],experience:"6 years"},
    {id:4,name:"Aisha Patel",role:"Growth Marketer",service:"I will create a social media marketing strategy",category:"Digital Marketing",rating:4.9,reviews:96,price:9500,initials:"AP",avatar:"https://i.pravatar.cc/120?img=44",bio:"Digital marketer helping small brands grow through content planning, campaigns and performance insights.",skills:["SEO","Social Media","Meta Ads","Content"],experience:"4 years"},
    {id:5,name:"Oliver Lewis",role:"Mobile Developer",service:"I will create a modern mobile app interface",category:"Mobile App Development",rating:4.7,reviews:74,price:18000,initials:"OL",avatar:"https://i.pravatar.cc/120?img=13",bio:"Mobile developer building smooth app experiences with a focus on performance and usability.",skills:["Flutter","Dart","Firebase","UI"],experience:"3 years"},
    {id:6,name:"Noor Hassan",role:"UI/UX Designer",service:"I will design clean app and website UI in Figma",category:"Graphic Design",rating:5.0,reviews:63,price:7500,initials:"NH",avatar:"https://i.pravatar.cc/120?img=32",bio:"UI/UX designer creating simple, user-friendly interfaces, wireframes and clickable prototypes.",skills:["Figma","Wireframes","Prototyping","Design Systems"],experience:"3 years"},
    {id:7,name:"Hamza Ali",role:"Content Writer",service:"I will write SEO-friendly website content",category:"Writing & Translation",rating:4.8,reviews:51,price:5000,initials:"HA",avatar:"https://i.pravatar.cc/120?img=15",bio:"Content writer producing clear website copy, blog articles and product descriptions.",skills:["SEO Writing","Research","Copywriting"],experience:"3 years"},
    {id:8,name:"Maya Chen",role:"Web Designer",service:"I will redesign your landing page for conversions",category:"Web Development",rating:4.9,reviews:110,price:14000,initials:"MC",avatar:"https://i.pravatar.cc/120?img=49",bio:"Web designer combining visual design and usability to create engaging landing pages.",skills:["HTML","CSS","Figma","Responsive Design"],experience:"5 years"}
  ];

  const money = value => "PKR " + Number(value).toLocaleString("en-PK");
  const safe = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));

  // Home page search redirects to the marketplace page
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", event => {
      event.preventDefault();
      const query = document.getElementById("searchInput").value.trim();
      window.location.href = "find-freelancers.html?search=" + encodeURIComponent(query);
    });
  }
  document.querySelectorAll(".popular-searches button").forEach(button => {
    button.addEventListener("click", () => {
      window.location.href = "find-freelancers.html?search=" + encodeURIComponent(button.dataset.search || "");
    });
  });

  // Marketplace: live search, category filter and sorting
  const browseGrid = document.getElementById("browseGrid");
  if (browseGrid) {
    const search = document.getElementById("browseSearch");
    const category = document.getElementById("categoryFilter");
    const sort = document.getElementById("sortFilter");
    const params = new URLSearchParams(window.location.search);
    if (params.has("search")) search.value = params.get("search");
    if (params.has("category")) {
      const requested = params.get("category");
      const matchingOption = [...category.options].find(option => option.value === requested || option.textContent === requested);
      if (matchingOption) category.value = matchingOption.value;
    }

    function renderCards() {
      const query = search.value.trim().toLowerCase();
      const selectedCategory = category.value;
      let results = freelancers.filter(person => {
        const searchable = [person.name,person.role,person.service,person.category,...person.skills].join(" ").toLowerCase();
        return (!query || searchable.includes(query)) && (selectedCategory === "All" || person.category === selectedCategory);
      });
      if (sort.value === "price-low") results.sort((a,b) => a.price-b.price);
      if (sort.value === "price-high") results.sort((a,b) => b.price-a.price);
      if (sort.value === "rating") results.sort((a,b) => b.rating-a.rating || b.reviews-a.reviews);
      document.getElementById("resultsCount").textContent = `${results.length} freelancer${results.length === 1 ? "" : "s"} found`;
      if (!results.length) {
        browseGrid.innerHTML = '<div class="market-empty"><h3>No freelancers found</h3><p>Try another keyword or choose a different category.</p><button class="btn btn-outline" id="clearFilters" type="button">Clear filters</button></div>';
        return;
      }
      browseGrid.innerHTML = results.map(person => `
        <article class="market-card">
          <div class="market-card-top">
            <img class="market-avatar" src="${safe(person.avatar)}" alt="${safe(person.name)} profile photo" onerror="this.style.display='none'">
            <div><h3 class="market-name">${safe(person.name)}</h3><p class="market-role">${safe(person.role)}</p></div>
          </div>
          <span class="market-category">${safe(person.category)}</span>
          <h2 class="market-service">${safe(person.service)}</h2>
          <p class="market-rating">⭐ <strong>${person.rating.toFixed(1)}</strong> · ${person.reviews} reviews</p>
          <div class="market-card-bottom"><div class="market-price">Starting price<strong>${money(person.price)}</strong></div>
          <a class="btn btn-outline" href="freelancer-details.html?id=${person.id}">View Profile</a></div>
        </article>`).join("");
    }
    [search,category,sort].forEach(control => control.addEventListener(control === search ? "input" : "change", renderCards));
    browseGrid.addEventListener("click", event => {
      if (event.target.id === "clearFilters") { search.value = ""; category.value = "All"; sort.value = "recommended"; renderCards(); }
    });
    renderCards();
  }

  // Freelancer profile / service details
  const details = document.getElementById("freelancerDetails");
  if (details) {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const person = freelancers.find(item => item.id === id);
    if (!person) {
      details.innerHTML = '<div class="market-empty"><h2>Profile not found</h2><a class="btn btn-primary" href="find-freelancers.html">Back to freelancers</a></div>';
    } else {
      details.innerHTML = `
        <div class="detail-layout">
          <section class="detail-card">
            <div class="detail-profile"><img src="${safe(person.avatar)}" alt="${safe(person.name)} profile photo" onerror="this.style.display='none'">
              <div><h1>${safe(person.name)}</h1><p class="market-role">${safe(person.role)}</p><p class="market-rating">⭐ ${person.rating.toFixed(1)} · ${person.reviews} client reviews</p></div></div>
            <span class="market-category">${safe(person.category)}</span><h2>${safe(person.service)}</h2>
            <h3>About this freelancer</h3><p class="detail-copy">${safe(person.bio)}</p>
            <h3>Skills</h3><div class="detail-skills">${person.skills.map(skill=>`<span>${safe(skill)}</span>`).join("")}</div>
            <a class="btn btn-primary" href="mailto:hello@freelancehub.example?subject=${encodeURIComponent("Enquiry for " + person.name)}">Contact Freelancer</a>
          </section>
          <aside class="detail-card"><p class="market-role">Service starting price</p><div class="detail-price">${money(person.price)}</div>
            <div class="detail-stat"><span>Rating</span><strong>⭐ ${person.rating.toFixed(1)} / 5</strong></div>
            <div class="detail-stat"><span>Reviews</span><strong>${person.reviews}</strong></div>
            <div class="detail-stat"><span>Experience</span><strong>${safe(person.experience)}</strong></div>
            <div class="detail-stat"><span>Category</span><strong>${safe(person.category)}</strong></div>
            <a class="btn btn-outline" style="width:100%;margin-top:20px" href="find-freelancers.html">Back to Results</a>
          </aside>
        </div>`;
    }
  }

  // Keep the simple Week 1 contact form working if present
  const contactForm = document.getElementById("contactForm");
  if (contactForm) contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("name")?.value || "there";
    alert(`Thank you, ${name}! Your message has been sent successfully.`);
    contactForm.reset();
  });
});

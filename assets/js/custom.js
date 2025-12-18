let categoryPage = 1;
let productPage = 1;
let samplePage = 1;
let quotationPage = 1;
let cmsEditor = null;



/***********************
 * GLOBAL STATE
 ***********************/
const STORAGE_KEYS = {
  categories: "axoli_categories",
  products: "axoli_products"
};

/***********************
 * DEFAULT DATA (ONCE)
 ***********************/
const DEFAULT_CATEGORIES = [
  { name: "Floor Tiles", products: 24, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=300" },
  { name: "Wall Tiles", products: 18, image: "" },
  { name: "Bathroom Tiles", products: 12, image: "" },
  { name: "Kitchen Tiles", products: 9, image: "" },
  { name: "Outdoor Tiles", products: 6, image: "" } 
];

const DEFAULT_PRODUCTS = [
  {
    name: "Marble White",
    category: "Floor Tiles",
    size: "600x600",
    finish: "Glossy",
    digital: "Wall Tiles",
    description: "Premium marble finish tile",
    primary: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=300",
    secondary: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200"
    ]
  },
  {
    name: "Stone Grey",
    category: "Wall Tiles",
    size: "300x600",
    finish: "Matte",
    digital: "Wall Tiles",
    description: "Stone texture wall tile",
    primary: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
    secondary: []
  },
  {
    name: "Wood Oak",
    category: "Outdoor Tiles",
    size: "200x1200",
    finish: "Matt",
    digital: "Wall Tiles",
    description: "Wooden plank tile",
    primary: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
    secondary: []
  },
  {
    name: "Classic Beige",
    category: "Bathroom Tiles",
    size: "300x300",
    finish: "Glossy",
    digital: "Wall Tiles",
    description: "Bathroom floor tile",
    primary: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300",
    secondary: []
  },
  {
    name: "Kitchen Black",
    category: "Kitchen Tiles",
    size: "300x600",
    finish: "Matt",
    digital: "Wall Tiles",
    description: "Modern kitchen tile",
    primary: "https://images.unsplash.com/photo-1761850648640-2ee5870ee883?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    secondary: []
  }
];


/***********************
 * STORAGE HELPERS
 ***********************/
function loadData(key, fallback) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return [...fallback];
  }
  return JSON.parse(data);
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/***********************
 * INIT DATA
 ***********************/
let categories = loadData(STORAGE_KEYS.categories, DEFAULT_CATEGORIES);
let products = loadData(STORAGE_KEYS.products, DEFAULT_PRODUCTS);

/***********************
 * TAB NAVIGATION
 ***********************/
function openPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  document.querySelectorAll(".menu li").forEach(li => li.classList.remove("active"));
  event.currentTarget.classList.add("active");

  if (pageId === "dashboard") {
    setTimeout(renderSmallCharts, 100);
  }
}



/***********************
 * DASHBOARD CHARTS
 ***********************/
let sampleChartSmall = null;
let userChartSmall = null;

function renderSmallCharts() {
  const sampleCanvas = document.getElementById("sampleChartSmall");
  const userCanvas = document.getElementById("userChartSmall");

  // Safety check (canvas exists & Chart loaded)
  if (typeof Chart === "undefined") return;

  if (sampleCanvas) {
    sampleChartSmall?.destroy();
    sampleChartSmall = new Chart(sampleCanvas, {
      type: "bar",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
          data: [12, 18, 9, 15],
          backgroundColor: "#f04d0c",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  if (userCanvas) {
    userChartSmall?.destroy();
    userChartSmall = new Chart(userCanvas, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
          data: [5, 9, 6, 12],
          borderColor: "#111827",
          backgroundColor: "rgba(17,24,39,0.1)",
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}


/***********************
 * SIDEBAR
 ***********************/
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("collapsed");
}

/***********************
 * LOGOUT
 ***********************/
function handleLogout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/***********************
 * CATEGORY HELPERS
 ***********************/
function getInitialAvatar(name = "") {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  return `<div class="initial-avatar">${letter}</div>`;
}


function renderCategories() {
  const tbody = document.querySelector("#categoryTable tbody");
  if (!tbody) return;

  const pageData = paginate(categories, categoryPage);

  tbody.innerHTML = pageData.map((cat, i) => `
    <tr>
      <td>${(categoryPage - 1) * PAGE_SIZE + i + 1}</td>
      <td>${cat.image ? `<img src="${cat.image}">` : getInitialAvatar(cat.name)}</td>
      <td>${cat.name}</td>
      <td>${cat.products}</td>
      <td>
        <span class="action-btn" onclick="editCategory(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
          <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg></span>
                  <span class="action-btn" onclick="deleteCategory(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
          <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </td>
    </tr>
  `).join("");

   renderPagination(
    "categoryPagination",
    categories.length,
    categoryPage,
    p => {
      categoryPage = p;
      renderCategories();
    }
  );

  saveData(STORAGE_KEYS.categories, categories);
}

/***********************
 * CATEGORY CRUD
 ***********************/
function openAddCategory() {
  categoryForm.reset();
  editIndex.value = "";
  modalTitle.innerText = "Add New Category";
  categoryModal.style.display = "flex";
}

function editCategory(i) {
  categoryName.value = categories[i].name;
  editIndex.value = i;
  modalTitle.innerText = "Edit Category";
  categoryModal.style.display = "flex";
}

function deleteCategory(i) {
  if (confirm("Delete this category?")) {
    categories.splice(i, 1);
    if (categoryPage > Math.ceil(categories.length / PAGE_SIZE)) {
      categoryPage--;
    }
    renderCategories();
  }
}

function closeCategoryModal() {
  categoryModal.style.display = "none";
}

categoryForm.addEventListener("submit", e => {
  e.preventDefault();

  const imgFile = categoryImage.files[0];
  const img = imgFile ? URL.createObjectURL(imgFile) : "";

  if (editIndex.value === "") {
    categories.push({ name: categoryName.value, products: 0, image: img });
  } else {
    categories[editIndex.value].name = categoryName.value;
    if (img) categories[editIndex.value].image = img;
  }

  closeCategoryModal();
  renderCategories();
});

/***********************
 * PRODUCT HELPERS
 ***********************/
function loadProductCategories(selected = "") {
  const select = document.getElementById("productCategory");
  if (!select) return;

  select.innerHTML = "";

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name;
    if (cat.name === selected) option.selected = true;
    select.appendChild(option);
  });
}

function renderProducts() {
  const tbody = document.querySelector("#productTable tbody");
  if (!tbody) return;

  const pageData = paginate(products, productPage);

  tbody.innerHTML = pageData.map((p, i) => `
    <tr>
      <td>${(productPage - 1) * PAGE_SIZE + i + 1}</td>
      <td>${p.primary ? `<img src="${p.primary}" width="40">` : "-"}</td>
      <td>${p.secondary.map(img => `<img src="${img}" width="32">`).join("")}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.size}</td>
      <td>${p.finish}</td>
      <td>${p.digital}</td>
      <td class="desc-cell">${p.description}</td>
      <td>
        <span class="action-btn" onclick="editProduct(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
        <span class="action-btn" onclick="deleteProduct(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
      </td>
    </tr>
  `).join("");

 renderPagination(
    "productPagination",
    products.length,
    productPage,
    p => {
      productPage = p;
      renderProducts();
    }
  );

  saveData(STORAGE_KEYS.products, products);
}

/***********************
 * PRODUCT CRUD
 ***********************/
function openAddProduct() {
  productForm.reset();
  productEditIndex.value = "";
  productModalTitle.innerText = "Add Product";

  loadProductCategories(); // 👈 ALWAYS load fresh categories

  productModal.style.display = "flex";
}

function editProduct(i) {
  const p = products[i];

  productName.value = p.name;
  productSize.value = p.size;
  productFinish.value = p.finish;
  productDigital.value = p.digital;
  productDescription.value = p.description;

  loadProductCategories(p.category); // 👈 preload selected category

  productEditIndex.value = i;
  productModalTitle.innerText = "Edit Product";
  productModal.style.display = "flex";
}


function deleteProduct(i) {
  if (confirm("Delete this product?")) {
    products.splice(i, 1);
    if (productPage > Math.ceil(products.length / PAGE_SIZE)) {
      productPage--;
    }
    renderProducts();
  }
}

function closeProductModal() {
  productModal.style.display = "none";
}

productForm.addEventListener("submit", e => {
  e.preventDefault();

  const primary = productPrimary.files[0]
    ? URL.createObjectURL(productPrimary.files[0])
    : "";

  const secondary = [...productSecondary.files].map(f => URL.createObjectURL(f));

  const data = {
    name: productName.value,
    category: productCategory.value,
    size: productSize.value,
    finish: productFinish.value,
    digital: productDigital.value,
    description: productDescription.value,
    primary,
    secondary
  };

  if (productEditIndex.value === "") {
    products.push(data);
  } else {
    products[productEditIndex.value] = data;
  }

  closeProductModal();
  renderProducts();
});



/***********************
 * SAMPLE DATA
 ***********************/
const SAMPLE_KEY = "axoli_samples";

const DEFAULT_SAMPLES = [
  {
    name: "John Doe",
    email: "john@example.com",
    sample: "Need floor tile sample – matte finish"
  },
  {
    name: "Riya Patel",
    email: "riya@gmail.com",
    sample: "Bathroom tile sample in beige color"
  }
];

let samples = loadData(SAMPLE_KEY, DEFAULT_SAMPLES);

function renderSamples() {
  const tbody = document.querySelector("#sampleTable tbody");
  if (!tbody) return;

  const pageData = paginate(samples, samplePage);

  tbody.innerHTML = pageData.map((s, i) => `
    <tr>
      <td>${(samplePage - 1) * PAGE_SIZE + i + 1}</td>
      <td>${s.name}</td>
      <td>${s.email}</td>
      <td>${s.sample}</td>
      <td>
        <span class="action-btn" onclick="deleteSample(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
      </td>
    </tr>
  `).join("");

renderPagination(
    "samplePagination",
    samples.length,
    samplePage,
    p => {
      samplePage = p;
      renderSamples();
    }
  );

  saveData(SAMPLE_KEY, samples);
}

function deleteSample(i) {
  if (confirm("Delete this sample request?")) {
    samples.splice(i, 1);
    if (samplePage > Math.ceil(samples.length / PAGE_SIZE)) {
      samplePage--;
    }
    renderSamples();
  }
}




/***********************
 * QUOTATION DATA
 ***********************/
const QUOTATION_KEY = "axoli_quotations";

const DEFAULT_QUOTATIONS = [
  {
    name: "Amit Shah",
    email: "amit@gmail.com",
    message: "Need quotation for 200 boxes of floor tiles"
  },
  {
    name: "Neha Verma",
    email: "neha@yahoo.com",
    message: "Please share price for kitchen tiles"
  }
];

let quotations = loadData(QUOTATION_KEY, DEFAULT_QUOTATIONS);

function renderQuotations() {
  const tbody = document.querySelector("#quotationTable tbody");
  if (!tbody) return;

    const pageData = paginate(quotations, quotationPage);


  tbody.innerHTML = pageData.map((q, i) => `
    <tr>
      <td>${(quotationPage - 1) * PAGE_SIZE + i + 1}</td>
      <td>${q.name}</td>
      <td>${q.email}</td>
      <td> ${q.message}</td>
      </td>
      <td>
        <span class="action-btn" onclick="deleteQuotation(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
      </td>
    </tr>
  `).join("");

  renderPagination(
    "quotationPagination",
    quotations.length,
    quotationPage,
    p => {
      quotationPage = p;
      renderQuotations();
    }
  );

  saveData(QUOTATION_KEY, quotations);
}

function deleteQuotation(i) {
  if (confirm("Delete this quotation?")) {
    quotations.splice(i, 1);
    if (quotationPage > Math.ceil(quotations.length / PAGE_SIZE)) {
      quotationPage--;
    }
    renderQuotations();
  }
}


/***********************
 * PAGINATION ENGINE
 ***********************/
const PAGE_SIZE = 10;

function paginate(data, page) {
  const start = (page - 1) * PAGE_SIZE;
  return data.slice(start, start + PAGE_SIZE);
}

function renderPagination(containerId, total, currentPage, onPageChange) {
  const pages = Math.ceil(total / PAGE_SIZE);
  const container = document.getElementById(containerId);
  if (!container || pages <= 1) {
    if (container) container.innerHTML = "";
    return;
  }

  container.innerHTML = "";

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => onPageChange(i);
    container.appendChild(btn);
  }
}




/***********************
 * CMS DOM ELEMENTS (FIX)
 ***********************/
const cmsForm = document.getElementById("cmsForm");
const cmsTitle = document.getElementById("cmsTitle");
const cmsSlug = document.getElementById("cmsSlug");
const cmsEditIndex = document.getElementById("cmsEditIndex");


/***********************
 * CMS CONFIG
 ***********************/
const CMS_KEY = "axoli_cms_pages";

/***********************
 * DEFAULT CMS PAGES (ONCE)
 ***********************/
const DEFAULT_CMS_PAGES = [
  {
    id: 1,
    title: "Terms & Conditions",
    slug: "terms-and-conditions",
    content: "<h2>Terms & Conditions</h2><p>Use of this website is subject to terms.</p>"
  },
  {
    id: 2,
    title: "Privacy Policy",
    slug: "privacy-policy",
    content: "<h2>Privacy Policy</h2><p>Your privacy is important to us.</p>"
  },
  {
    id: 3,
    title: "Cookie Policy",
    slug: "cookie-policy",
    content: "<h2>Cookie Policy</h2><p>We use cookies to improve experience.</p>"
  }
];

let cmsData = loadData(CMS_KEY, DEFAULT_CMS_PAGES);
let cmsId = cmsData.length
  ? Math.max(...cmsData.map(p => p.id)) + 1
  : 1;

/* Modal */
function openCMSModal() {
  cmsEditIndex.value = "";
  cmsForm.reset();

  document.getElementById("cmsModal").style.display = "flex";

  setTimeout(initCMSEditor, 100);
}


function closeCMSModal() {
  document.getElementById("cmsModal").style.display = "none";

  if (cmsEditor) {
    cmsEditor.value = "";
  }
}




/* Auto Slug */
document.getElementById("cmsTitle").addEventListener("input", function () {
  document.getElementById("cmsSlug").value = this.value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
});


/* Submit CMS */
cmsForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    id: cmsEditIndex.value
      ? cmsData[cmsEditIndex.value].id
      : cmsId++,
    title: cmsTitle.value,
    slug: cmsSlug.value,
    content: cmsEditor.value
  };

  if (cmsEditIndex.value === "") {
    cmsData.push(data);
  } else {
    cmsData[cmsEditIndex.value] = data;
  }

  saveData(CMS_KEY, cmsData);   // ✅ REQUIRED
  renderCMSTable();
  closeCMSModal();
});



/* Render Table */
function renderCMSTable() {
  const tbody = document.querySelector("#cmsTable tbody");
  tbody.innerHTML = "";

  cmsData.forEach((item, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>${item.slug}</td>
        <td>
          <span class="action-btn" onclick="editCMS(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
          <span class="action-btn" onclick="deleteCMS(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
          <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg></span>
          <span class="action-btn" onclick="viewCMS(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12Z" fill="#000000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.83 11.2807C19.542 7.15186 15.8122 5 12 5C8.18777 5 4.45796 7.15186 2.17003 11.2807C1.94637 11.6844 1.94361 12.1821 2.16029 12.5876C4.41183 16.8013 8.1628 19 12 19C15.8372 19 19.5882 16.8013 21.8397 12.5876C22.0564 12.1821 22.0536 11.6844 21.83 11.2807ZM12 17C9.06097 17 6.04052 15.3724 4.09173 11.9487C6.06862 8.59614 9.07319 7 12 7C14.9268 7 17.9314 8.59614 19.9083 11.9487C17.9595 15.3724 14.939 17 12 17Z" fill="#000000"/>
</svg></span>
        </td>
      </tr>
    `;
  });
}


function initCMSEditor() {
  if (cmsEditor) return;

  cmsEditor = new Jodit("#cmsContent", {
    height: 300,
    toolbarAdaptive: false,
    toolbarSticky: false
  });
}


function editCMS(i) {
  const item = cmsData[i];

  cmsEditIndex.value = i;
  cmsTitle.value = item.title;
  cmsSlug.value = item.slug;

  document.getElementById("cmsModal").style.display = "flex";

  setTimeout(() => {
    initCMSEditor();
    cmsEditor.value = item.content;
  }, 100);
}

function deleteCMS(i) {
  if (!confirm("Delete this CMS page?")) return;

  cmsData.splice(i, 1);
  saveData(CMS_KEY, cmsData);   // ✅ REQUIRED
  renderCMSTable();
}



function viewCMS(i) {
  document.getElementById("viewTitle").innerText = cmsData[i].title;
  document.getElementById("viewContent").innerHTML = cmsData[i].content;

  document.getElementById("cmsViewModal").style.display = "flex";
}

function closeCMSView() {
  document.getElementById("cmsViewModal").style.display = "none";
}



/***********************
 * INIT
 ***********************/
window.addEventListener("load", () => {
  renderCategories();
  renderProducts();
  renderSamples();
  renderQuotations();
  renderSmallCharts();
  renderCMSTable(); // ✅ ADD THIS
});



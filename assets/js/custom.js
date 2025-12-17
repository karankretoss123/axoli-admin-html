
let inquiryChartSmall = null;
let userChartSmall = null;

function renderSmallCharts() {

  // Inquiry Chart
  const inquiryCtx = document.getElementById('inquiryChartSmall');
  if (inquiryCtx) {
    if (inquiryChartSmall) inquiryChartSmall.destroy();

    inquiryChartSmall = new Chart(inquiryCtx, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          data: [12, 18, 9, 15],
          backgroundColor: '#f04d0c',
          borderRadius: 6
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // User Registration Chart
  const userCtx = document.getElementById('userChartSmall');
  if (userCtx) {
    if (userChartSmall) userChartSmall.destroy();

    userChartSmall = new Chart(userCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          data: [5, 9, 6, 12],
          borderColor: '#111827',
          backgroundColor: 'rgba(17,24,39,0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

/* Trigger charts when dashboard opens */
function openPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
  event.currentTarget.classList.add('active');

  if (pageId === 'dashboard') {
    setTimeout(renderSmallCharts, 100);
  }
}


window.addEventListener('load', renderSmallCharts);


function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
}

// Render chart on first load
window.addEventListener('load', () => {
    renderInquiryChart();
});


function handleLogout() {
  // optional: clear session / local storage
  localStorage.clear();
  sessionStorage.clear();

  // redirect to login page
  window.location.href = "login.html"; // or login.html
}




let categories = [
  { name: "Floor Tiles", products: 24, image: "" },
  { name: "Wall Tiles", products: 18, image: "" }
];


function getInitialAvatar(name) {
  const letter = name.trim().charAt(0).toUpperCase();
  return `
    <div class="initial-avatar">
      ${letter}
    </div>
  `;
}

function renderCategories() {
  const tbody = document.querySelector("#categoryTable tbody");
  tbody.innerHTML = "";

  categories.forEach((cat, index) => {
    const imageCell = cat.image
      ? `<img src="${cat.image}" alt="${cat.name}">`
      : getInitialAvatar(cat.name);

    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${imageCell}</td>
        <td>${cat.name}</td>
        <td>${cat.products}</td>
        <td>
          <span class="action-btn" onclick="editCategory(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
          <span class="action-btn" onclick="deleteCategory(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
 <span class="action-btn" onclick="viewcategory(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12Z" fill="#000000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.83 11.2807C19.542 7.15186 15.8122 5 12 5C8.18777 5 4.45796 7.15186 2.17003 11.2807C1.94637 11.6844 1.94361 12.1821 2.16029 12.5876C4.41183 16.8013 8.1628 19 12 19C15.8372 19 19.5882 16.8013 21.8397 12.5876C22.0564 12.1821 22.0536 11.6844 21.83 11.2807ZM12 17C9.06097 17 6.04052 15.3724 4.09173 11.9487C6.06862 8.59614 9.07319 7 12 7C14.9268 7 17.9314 8.59614 19.9083 11.9487C17.9595 15.3724 14.939 17 12 17Z" fill="#000000"/>
</svg></span>
        </td>
      </tr>
    `;
  });
}


/* Add */
function openAddCategory() {
  document.getElementById("modalTitle").innerText = "Add New Category";
  document.getElementById("editIndex").value = "";
  document.getElementById("categoryForm").reset();
  document.getElementById("categoryModal").style.display = "flex";
}

/* Edit */
function editCategory(index) {
  const cat = categories[index];
  document.getElementById("modalTitle").innerText = "Edit Category";
  document.getElementById("categoryName").value = cat.name;
  document.getElementById("editIndex").value = index;
  document.getElementById("categoryModal").style.display = "flex";
}

/* Delete */
function deleteCategory(index) {
  if (confirm("Are you sure you want to delete this category?")) {
    categories.splice(index, 1);
    renderCategories();
  }
}

function closeCategoryModal() {
  document.getElementById("categoryModal").style.display = "none";
}

/* Submit */
document.getElementById("categoryForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = categoryName.value;
  const file = categoryImage.files[0];
  const img = file ? URL.createObjectURL(file) : "";
  const editIndex = document.getElementById("editIndex").value;

  if (editIndex === "") {
    categories.push({ name, products: 0, image: img });
  } else {
    categories[editIndex].name = name;
    if (file) categories[editIndex].image = img;
  }

  closeCategoryModal();
  renderCategories();
});

/* Init */
renderCategories();

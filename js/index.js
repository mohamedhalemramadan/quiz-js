let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn

$(document).ready(function () {
    searchByName("").then(function () {
        $(".loading-screen").fadeOut(500);
        $("body").css("overflow", "auto");
    });
});
//   close and open side navigation 
function openSideNav() {
    $(".side-nav-menu").animate({ left: 0 }, 500);
    $(".open-close-icon").removeClass("fa-align-justify").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({ top: 0 }, 100 * (i + 5));
    }
}

function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
    $(".side-nav-menu").animate({ left: -boxWidth }, 500);
    $(".open-close-icon").removeClass("fa-x").addClass("fa-align-justify");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({ top: 300 }, 500);
    }
}

closeSideNav();

$(".side-nav-menu .open-close-icon").click(function () {
    if ($(".side-nav-menu").css("left") === "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
});



function displayMeals(arr) {
    let cartoona = "";
    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    rowData.innerHTML = cartoona
}
function displayMealDetails(meal) {

    searchContainer.innerHTML = "";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = cartoona
}

function displayCategories(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `

    }
    rowData.innerHTML = cartoona;
}
async function getCategories(){

    rowData.innerHTML=""
    searchContainer.innerHTML=""
    $(".inner-loading-screen").fadeIn(300)
    let responseCat = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    data = await responseCat.json()

    displayCategories(data.categories)
    $(".inner-loading-screen").fadeOut(300)
    
}
async function getCategoryMeals(cat) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
    data = await response.json()


    displayMeals(data.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}
function displayArea(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}

async function getArea() {
    rowData.innerHTML = ""
    searchContainer.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300)
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    displayArea(respone.meals)
    $(".inner-loading-screen").fadeOut(300)

    console.log(respone.meals);
}


async function getAreaMeals(area) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}
async function getIngredients() {
    rowData.innerHTML = ""
    searchContainer.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    displayIngredients(respone.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
}
function displayIngredients(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}
async function getIngredientsMeals(ingredients) {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}

async function getMealDetails(mealID) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();

    displayMealDetails(respone.meals[0])
    $(".inner-loading-screen").fadeOut(300)

}


function displaySearchInputs() {
    searchContainer.innerHTML = `<div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`
    rowData.innerHTML = ""
}
async function searchByName(term) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()
    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

} {

}

async function searchByFLetter(term) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    term == "" ? term = "s" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}


async function getMealDetails(mealID) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();

    displayMealDetails(respone.meals[0])
    $(".inner-loading-screen").fadeOut(300)

}
function displayMealDetails(meal) {

    searchContainer.innerHTML = "";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = cartoona
}
function displayContact() {
    rowData.innerHTML = `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                        <div id="nameAlert" class="alert alert-danger mt-1 d-none">Special Characters and Numbers not allowed</div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" type="email" class="form-control" placeholder="Enter Email">
                        <div id="emailAlert" class="alert alert-danger mt-1 d-none">Enter valid email. *Ex: xxx@yyy.zzz</div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" type="text" class="form-control" placeholder="Enter phone">
                        <div id="phoneAlert" class="alert alert-danger mt-1 d-none">Enter valid Phone Number</div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" type="number" class="form-control" placeholder="Enter Age">
                        <div id="ageAlert" class="alert alert-danger mt-1 d-none">Enter valid Age</div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" type="password" class="form-control" placeholder="Enter Password">
                        <div id="passwordAlert" class="alert alert-danger mt-1 d-none">Enter valid password. *Minimum eight characters, at least one letter and one number:*</div>
                    </div>
                    <div class="col-md-6">
                        <input id="rePasswordInput" type="password" class="form-control" placeholder="Enter RePassword">
                        <div id="repasswordAlert" class="alert alert-danger mt-1 d-none">Enter valid Repassword</div>
                    </div>
                </div>
                <button id="submitBtn" class="btn btn-outline-danger px-2 mt-3">Submit</button>
            </div>
        </div>`;

    submitBtn = document.getElementById("submitBtn");

    document.getElementById("nameInput").addEventListener("input", validateName);
    document.getElementById("emailInput").addEventListener("input", validateEmail);
    document.getElementById("phoneInput").addEventListener("input", validatePhone);
    document.getElementById("ageInput").addEventListener("input", validateAge);
    document.getElementById("passwordInput").addEventListener("input", validatePassword);
    document.getElementById("rePasswordInput").addEventListener("input", validateRePassword);
}

let validationStates = {
    name: false,
    email: false,
    phone: false,
    age: false,
    password: false,
    rePassword: false,
};

function validateName() {
    let nameInput = document.getElementById("nameInput").value;
    let isValid = /^[a-zA-Z ]+$/.test(nameInput);
    document.getElementById("nameAlert").classList.toggle("d-none", isValid);
    validationStates.name = isValid;
    validateForm();
}

function validateEmail() {
    let emailInput = document.getElementById("emailInput").value;
    let isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
    document.getElementById("emailAlert").classList.toggle("d-none", isValid);
    validationStates.email = isValid;
    validateForm();
}

function validatePhone() {
    let phoneInput = document.getElementById("phoneInput").value;
    let isValid = /^[0-9]{10}$/.test(phoneInput);
    document.getElementById("phoneAlert").classList.toggle("d-none", isValid);
    validationStates.phone = isValid;
    validateForm();
}

function validateAge() {
    let ageInput = document.getElementById("ageInput").value;
    let isValid = /^[1-9][0-9]?$|^100$/.test(ageInput);
    document.getElementById("ageAlert").classList.toggle("d-none", isValid);
    validationStates.age = isValid;
    validateForm();
}

function validatePassword() {
    let passwordInput = document.getElementById("passwordInput").value;
    let isValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(passwordInput);
    document.getElementById("passwordAlert").classList.toggle("d-none", isValid);
    validationStates.password = isValid;
    validateForm();
}

function validateRePassword() {
    let rePasswordInput = document.getElementById("rePasswordInput").value;
    let passwordInput = document.getElementById("passwordInput").value;
    let isValid = rePasswordInput === passwordInput;
    document.getElementById("repasswordAlert").classList.toggle("d-none", isValid);
    validationStates.rePassword = isValid;
    validateForm();
}

function validateForm() {
    submitBtn.disabled = !Object.values(validationStates).every(state => state);
}
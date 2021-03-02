//1 fd9f87a4 - 9ffe5c6268161a20361278a9ac94f755
//2 fcd9ebeb - 890b35597209bccf850ad0e521ebce52
const nxtPage = document.getElementById('nxtPage');
const prvPage = document.getElementById('prevPage');
const search  = document.getElementById('keyWord').value;
const loc  = document.getElementById('location').value;
const loadingElement = document.querySelector('.loading-element');
const resContainer = document.getElementById('resultContainer');
const cardBody = document.getElementsByClassName('card');
var APP_ID = 'fcd9ebeb';
var API_KEY = '890b35597209bccf850ad0e521ebce52';
var BASE_URL = 'https://api.adzuna.com/v1/api/jobs';
var currentPage = 1;
var BASE_PARAMS = `search/${currentPage}?&results_per_page=10&content-type=application/json`;
var targetURL = `${BASE_URL}/gb/${BASE_PARAMS}&app_id=${APP_ID}&app_key=${API_KEY}&what=${search}&where=${loc}`;
var jobs = [];
var jobResult = {
    results:[]
};
var maxPage;


class jobSearch{
    constructor(searchFormSelector, nxtFormSelector, prvFormSelector){
        this.searchForm = document.getElementById(searchFormSelector);
        this.nxtBtn = document.getElementById(nxtFormSelector);
        this.prevBtn = document.getElementById(prvFormSelector);
    }
    searchFormEventListener() {
        this.searchForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            maxPage
            let res = await searchQuery(targetURL);
            // console.log(res.count);
            let jobsCount = res.count;
            let jobs = res.results;
            startLoading();
            resultCount(jobsCount);
            if(jobs) {
            //    console.log(jobs);
                //jobResult = jobs;                                
                stopLoading();
                showResults(jobs);
                document.getElementById('searchPage').style.display = "block";
            }else{
                stopLoading();
            }
        })        
    }
    nextFormListener() {
        this.nxtBtn.addEventListener('click', async function() {
            currentPage += 1;
            let nextUrl = `${BASE_URL}/gb/search/${currentPage}?&results_per_page=10&content-type=application/json&app_id=${APP_ID}&app_key=${API_KEY}&what=${search}&where=${loc}`;
            let res = await searchQuery(nextUrl);
            let jobs = res.results;
            startLoading();
            if(jobs) {
            //    console.log(jobs);
                // jobResult = jobs;                                
                stopLoading();
                clearResults();
                showResults(jobs);
                let prevBtn = document.getElementsByClassName('disabled');
                if(currentPage === 2){
                    prevBtn[0].className = 'active';
                }               
            }else{
                stopLoading();
            }
        })    
    }
    prevFormListener() {
        this.prevBtn.addEventListener('click', async function() {
            
            if(currentPage === 1){
                document.getElementsByClassName('prev-btn').classlist.add('disabled');
            }else{
                let prevUrl = `${BASE_URL}/gb/search/${currentPage}?&results_per_page=10&content-type=application/json&app_id=${APP_ID}&app_key=${API_KEY}&what=${search}&where=${loc}`;
                let res = await searchQuery(prevUrl);
                let jobs = res.results;
                startLoading();
                if(jobs) {
                //    console.log(jobs);
                    // jobResult = jobs;                                
                    stopLoading();
                    clearResults();
                    showResults(jobs);
                    currentPage -= 1;
                    if(currentPage === 1){
                        document.getElementsByClassName('prev-btn').classlist.add('disabled');
                    }                
                }else{
                    stopLoading();
                }
            }            
        })    
    } 
}

function resultCount(count){
    let h2 = document.createElement('h2');
    let resCount = document.getElementById('resultCount');    
    h2.setAttribute('class', 'bg-dark text-center jumbotron-fluid text-white-50');
    resCount.appendChild(h2);
    h2.innerHTML = `Jobs Found : ${formatNumber(count)}`;
}
function showResults(result) {
    
    for(let i = 0;i < result.length; i++){
        let job = result[i];
        //console.log(result[i]);
        let divCard = document.createElement('div');
        let cardBody = document.createElement('div');
        let salary = document.createElement('h5');
        let cardtitle = document.createElement('h4');
        let companyName = document.createElement('h5');
        let jobLoc = document.createElement('h5');
        let cardText = document.createElement('p');
        let applyNow = document.createElement('a');
        divCard.setAttribute('class', 'card jumbotron-fluid');
        cardBody.setAttribute('class', 'card-body');
        cardtitle.setAttribute('class', 'card-title text-capitalize');
        companyName.setAttribute('class', 'com-name');
        jobLoc.setAttribute('class', 'job-loc');
        cardText.setAttribute('class', 'card-text');
        resContainer.appendChild(divCard);
        divCard.appendChild(cardBody);
        cardBody.appendChild(cardtitle);
        cardBody.appendChild(salary);
        cardBody.appendChild(companyName);
        cardBody.appendChild(jobLoc);
        cardBody.appendChild(cardText);
        cardBody.appendChild(applyNow);
        cardtitle.innerHTML = `<strong><u>${job.title}</u></strong>`;
        salary.innerHTML = `Salary: £ ${formatSalary(job.salary_max)}`;
        companyName.innerHTML = `Company: ${job.company.display_name}`;
        jobLoc.innerHTML = `Location: ${job.location.display_name}`
        cardText.innerHTML = `${job.description}`;
        applyNow.innerHTML = `<a class="btn btn-outline-info" href = ${job.redirect_url}" target="_Blank">View Job</a>`;
    }
}
function clearResults() {
    resContainer.innerHTML = '';
}

function formatSalary(value) {
    if(value === undefined){
        let salary = 0;
    }else{
        salary = value.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, "$1,"); 
    // .replace('^(?!0\.00)[1-9]\d{0,2}(,\d{3})*(\.\d\d)?$');
    }
    return salary;
}
function formatNumber(val) {
    if(val === undefined){
        let value = 0;
    }else{
        value = val.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, "$1,");
    }
    return value;
}
async function searchQuery(url) {
    const result = await fetch(url);
    const data = await result.json();

    return data;
}
function startLoading() {
    loadingElement.classList.add('loading');
  }

function stopLoading() {
    loadingElement.classList.remove('loading');
  }

var JS = new jobSearch('searchForm','nxtPage', 'prevPage');
JS.searchFormEventListener();
JS.nextFormListener();
JS.prevFormListener();
// //histogram
// let loc1 = 'UK', loc2 = 'South East England', loc3 = 'Surrey';
// let histogramUrl = `${BASE_URL}/gb/histogram?app_key=${API_KEY}&app_id=${APP_ID}&location0=${loc1}&location1=${loc2}&location2=${loc3}`;

// fetch(histogramUrl)
// .then(response => response.json())
// .then(result => console.log(result))
// .catch(err => {
// 	console.error(err);
// });


//https://api.adzuna.com/v1/api/{vertical}/gb/categories?app_id=fd9f87a4&app_key=9ffe5c6268161a20361278a9ac94f755
//category
// let catUrl = `${BASE_URL}/gb/categories?app_key=${API_KEY}&app_id=${APP_ID}`;

// fetch(catUrl)
// .then(response => response.json())
// .then(result => console.log(result))
// .catch(err => {
// 	console.error(err);
// });

// //https://api.adzuna.com/v1/api/jobs/gb/top_companies?app_id=fd9f87a4&app_key=9ffe5c6268161a20361278a9ac94f755
// //top_comp
// let topCompUrl = `${BASE_URL}/sg/top_companies?app_key=${API_KEY}&app_id=${APP_ID}`;

// fetch(topCompUrl)
// .then(response => response.json())
// .then(result => console.log(result))
// .catch(err => {
// 	console.error(err);
// });

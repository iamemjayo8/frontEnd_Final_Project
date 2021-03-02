//https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=fcd9ebeb&app_key=890b35597209bccf850ad0e521ebce52&results_per_page=20&what=web%20developer

//1 fd9f87a4 - 9ffe5c6268161a20361278a9ac94f755
//2 fcd9ebeb - 890b35597209bccf850ad0e521ebce52
const resultContainer = document.querySelector('.result-container');
var pageNumber = 1;
var jobName = 'web%20developer';
var apiKey = '890b35597209bccf850ad0e521ebce52';
var appId = 'fcd9ebeb';
var baseURL = 'https://api.adzuna.com/v1/api/jobs/gb';
var baseParam = `/search/${pageNumber}?&results_per_page=10&what=${jobName}`;
(function() {
    let webDevJobs = (resultContainer) => {        
        async function jobSearch(url) {
            const result = await fetch(url)
            const data = await result.json()

            return data
        }
        function showResult(jobs, num, container) {
            let resultSelector = document.querySelector(container)
            let tmpNode = document.createElement('div')
            resultSelector.appendChild(tmpNode);
            tmpNode.innerHTML = `
            <div id="result-section" class="p-16 text-center">
                <h4>${formatNumber(num)} jobs found for <strong>${jobName.replace(/[^a-zA-Z ]/g, " ")}</strong></h4>
            </div>`
            jobs.forEach(job => {
                let div = document.createElement('div')
                div.innerHTML = `
                <h4>${job.location.display_name}</h4>
                <p>${job.description}</p>
                <a class="btn btn-outline-info" href="${job.redirect_url}">${job.title}</a>
                <hr>`
                resultSelector.appendChild(div)
            });
        }
        async function getResult () {
            let targetURL = `${baseURL}${baseParam}&app_id=${appId}&app_key=${apiKey}`
            let jobResults = await jobSearch(targetURL)
            let jobs = jobResults.results
            let jobCount = jobResults.count
            showResult(jobs, jobCount, resultContainer)
            document.getElementById('searchPage').style.display = "block";
            pageNumber += 1;
            console.log(pageNumber);
        }
        function formatNumber(val) {
            if(val === undefined){
                let value = 0;
            }else{
                value = val.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, "1,");
            }
            return value;
        }
        getResult();
        // nextPage();
    };

    window.webDeveloperJob = webDevJobs;
}());

(function() {
    let wd;

    function run() { 
        wd = webDeveloperJob('.result-container');
    }
    run();

    const nxtBtn = document.getElementById('nxtPage');
    const prvBtn = document.getElementById('prevPage');
    nxtBtn.addEventListener('click', () => {
        clearResult();
        nextResult();

    })

    prvBtn.addEventListener('click', () => {
        clearResult();
        prevResult();
    })

    function clearResult() {
        resultContainer.innerHTML = '';
    }

    async function jobSearch(url) {
        const result = await fetch(url)
        const data = await result.json()

        return data
    }
    async function nextResult() {
        let targetURL = `${baseURL}/search/${pageNumber}?&results_per_page=10&what=${jobName}&app_id=${appId}&app_key=${apiKey}`
        let jobResults = await jobSearch(targetURL)
        let jobs = jobResults.results
        let jobCount = jobResults.count
        showResult(jobs, jobCount, resultContainer)
        document.getElementById('searchPage').style.display = "block";
        let prevBtn = document.getElementsByClassName('disabled');
                if(pageNumber === 2){
                    prevBtn[0].className = 'active';
                }  
        pageNumber += 1;
        console.log(pageNumber);   
    }
    async function prevResult() {
        if(pageNumber === 1){
            document.getElementsByClassName('prev-btn').classlist.add('disabled');
        }else{
            let targetURL = `${baseURL}${baseParam}&app_id=${appId}&app_key=${apiKey}`
            let jobResults = await jobSearch(targetURL)
            let jobs = jobResults.results
            let jobCount = jobResults.count
            showResult(jobs, jobCount, resultContainer)
            document.getElementById('searchPage').style.display = "block";
            if(pageNumber === 1){
                document.getElementsByClassName('prev-btn').classlist.add('disabled');
            }   
            pageNumber -= 1;
        }
    }
    function showResult(jobs, num, container) {
        let tmpNode = document.createElement('div')
        container.appendChild(tmpNode);
        tmpNode.innerHTML = `
        <div id="result-section" class="p-16 text-center">
            <h4>${formatNumber(num)} jobs found for <strong>${jobName.replace(/[^a-zA-Z ]/g, " ")}</strong></h4>
        </div>`
        jobs.forEach(job => {
            let div = document.createElement('div')
            div.innerHTML = `
            <h4>${job.location.display_name}</h4>
            <p>${job.description}</p>
            <a class="btn btn-outline-info" href="${job.redirect_url}">${job.title}</a>
            <hr>`
            container.appendChild(div)
        });
    }
    function formatNumber(val) {
        if(val === undefined){
            let value = 0;
        }else{
            value = val.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, "1,");
        }
        return value;
    }
}());
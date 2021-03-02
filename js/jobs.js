//https://api.adzuna.com/v1/api/jobs/gb/categories?app_id=fcd9ebeb&app_key=890b35597209bccf850ad0e521ebce52

//1 fd9f87a4 - 9ffe5c6268161a20361278a9ac94f755
//2 fcd9ebeb - 890b35597209bccf850ad0e521ebce52

(function() {
    let jobsCategory = (resultContainer) => {
        this.resultContainer = resultContainer;
        let apiKey = '890b35597209bccf850ad0e521ebce52';
        let appId = 'fcd9ebeb';
        let baseURL = 'https://api.adzuna.com/v1/api/jobs/gb/categories?';      
        async function jobSearch(url) {
            const result = await fetch(url)
            const data = await result.json()

            return data
        }
        function makeCategoryList(name, container) {
            let resultSelector = document.querySelector(container)
            let tmpNode = document.createElement('div')
            resultSelector.appendChild(tmpNode);
            tmpNode.setAttribute('class', 'col-md-2, m-1')
            tmpNode.innerHTML = `
            <span>
                <input type="Button" value="${name}" onclick="msg()">
            </span>`            
        }
        async function getCategory () {
            let targetURL = `${baseURL}&app_id=${appId}&app_key=${apiKey}`
            let res = await jobSearch(targetURL)
            let categories = res.results
            for(let i = 0;i < categories.length; i++){
                let label = categories[i].label
                makeCategoryList(label, this.resultContainer)
            }
        }
        getCategory(); 
    };

    window.j_category = jobsCategory;
}());

(function() {
    function run() {
        let jc;
        jc = j_category('.category');
        // wd.getResult();
    }

    run();
}());
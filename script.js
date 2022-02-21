
let startConverter = () => {
    let selectors = document.querySelectorAll('.currency-selector');
    let fromName = document.querySelector('#fromName');
    let toName = document.querySelector('#toName');
    let fromCurrency = document.querySelector('#fromCurrency');
    let toCurrency = document.querySelector('#toCurrency');
    let fromValue = document.querySelector('#fromValue');
    let toValue = document.querySelector('#toValue');
    let errMessage = document.querySelector('#errMessage');
    let swapBtn = document.querySelector('#swapBtn');

    let setCurrency = () => {
        fromName.innerText = fromCurrency.options[fromCurrency.selectedIndex].dataset.name;
        toName.innerText = toCurrency.options[toCurrency.selectedIndex].dataset.name;
    }

    let convert = (value) => {
        errMessage.style.display = 'none';
        fetch(`https://free.currconv.com/api/v7/convert?apiKey=d4cf3228112bfb5a29f5&q=${fromCurrency.value}_${toCurrency.value}&compact=y`)
        .then((response)=>response.json())
        .then((rate)=> {toValue.value = (value * rate[`${fromCurrency.value}_${toCurrency.value}`].val).toFixed(2)})    
        .catch((e)=>console.log(e))
    }

    let handleChange = () => {
        !isNaN(fromValue.value) ? convert(fromValue.value) : errMessage.style.display = 'block';
    }
    let updateAll = () => {
        setCurrency();
        handleChange();
    }

    let swapCurrency = () => {
        let temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        updateAll();
    }

    toCurrency.onchange = updateAll;
    fromCurrency.onchange = updateAll;
    fromValue.oninput = handleChange;
    swapBtn.onclick = swapCurrency;

    fetch('https://free.currconv.com/api/v7/currencies?apiKey=d4cf3228112bfb5a29f5')
    .then((response)=>response.json())
    .then(({results})=> {
        const frag = document.createDocumentFragment();
        const ordered = {};
        Object.keys(results).sort().forEach(function(key) {
            ordered[key] = results[key];
        });
        for (const cur in ordered) {
            if (results.hasOwnProperty(cur)) {
                const option = document.createElement('option');
                option.setAttribute('value', results[cur].id);
                option.dataset.name = results[cur].currencyName;
                option.innerText = results[cur].id;
                frag.append(option);
            }}
            return [frag, frag.cloneNode(true)]
        }
    )
    .then((frags)=>{
        selectors.forEach((selector,key)=>{
            selector.appendChild(frags[key]);
        })
        setCurrency();
    })
    .catch((e)=>console.log(Error(e)))

}

window.addEventListener('load', startConverter);
const currencyEl1 = document.getElementById("currency1")
const currencyEl2 = document.getElementById("currency2")
const amountEl1 = document.getElementById('amount1')
const amountEl2 = document.getElementById('amount2')
const rateEl = document.getElementById('exrate')
const swapEl = document.getElementById("swap")


// 접속 국가 코드 API
const getCountryCode = async () => {
    const response = await fetch('ipinfo.io/115.23.169.78?token=ee80ef1287629b')
    if (response.status === 200) {
        const location = await response.json()
        return location.country
    } else {
        throw new Error('Unable to get your location')
    }
}
 
// 접속 국가의 환율 코드 API
const getCurrencyCode = async (countryCode) => {
    const response = await fetch('https://api.countrylayer.com/v2/bed888a76044fc32a553b719485a2678')
    if (response.status === 200) {
    const data = await response.json()
    const country = data.find((country) => country.alpha2Code === countryCode)
    return country.currencies[0].code
    } else {
    throw new Error('Unable to get the currency code')
    }
}

// 우리나라에서 접속했다면 KRW가 기본으로 선택되도록
getCountryCode().then((data) => {
    return getCurrencyCode(data)
    }).then((data) => {
    for (i = 0; i < currencyEl2.options.length; i ++) {
        if (currencyEl2.options[i].value === data) {
        currencyEl2.options[i].selected = true
        calculate()
        }
    }
    }).catch((err) => {
    console.log(err)
})

// 환율 정보 API
const getRates = async (baseCode, resultCode) => {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCode}`)
    if (response.status === 200) {
        const data = await response.json()
        return data.rates[resultCode]
    } else {
        throw new Error('Unable to get the rate')
    }
}

// 환율 계산
const calculate = async () => {
    const currency_one = currencyEl1.value
    const currency_two = currencyEl2.value
    const data = await getRates(currency_one, currency_two)

    rateEl.innerText = `1 ${currency_one} = ${data.toFixed(4)} ${currency_two}`
    amountEl2.value = await (data * amountEl1.value).toFixed(4)
    
    }

// 기준 통화와 환산 통화를 바꿔주는 swap 버튼
swapEl.addEventListener('click', () => {
    const temp = currencyEl1.value
    currencyEl1.value = currencyEl2.value
    currencyEl2.value = temp
    calculate()
})

currencyEl1.addEventListener('change',calculate)
amountEl1.addEventListener('input',calculate)
currencyEl2.addEventListener('change',calculate)
amountEl2.addEventListener('input',calculate)

calculate()
const amountInput = document.getElementById("amount")
const fromCurrency = document.getElementById("from")
const toCurrency = document.getElementById("to")
const swapBtn = document.getElementById("swapBtn")
const resultDiv = document.getElementById("result")

async function getCurrencyList() {
    try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
        const data = await res.json()
        const currencies = Object.keys(data.rates)


        currencies.forEach(code => {
            fromCurrency.innerHTML += `<option value="${code}">${code}</option>`
            toCurrency.innerHTML += `<option value="${code}">${code}</option>`
        })
        fromCurrency.value = "USD"
        toCurrency.value = "INR"

    } catch (err) {
        resultDiv.innerHTML = `<p class="text-muted">Currency load failed. Try again later</p>`
    }

}

async function convertCurrency() {
    const amount = parseFloat(amountInput.value)
    const from = fromCurrency.value
    const to = toCurrency.value

    if (isNaN(amount)) {
        if (amountInput.value.trim() !== "") {
            resultDiv.innerHTML = `❌Please Enter Valid amount`
        } else {
            resultDiv.innerHTML = ""
        } return;
    }

    resultDiv.innerHTML = `converting...⌛`

    try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
        const data = await res.json()
        const rate = data.rates[to]
        const converted = amount * rate

        if (isNaN(converted)) {
            resultDiv.innerHTML = `<p class="text-danger">Invalid conversion.</p>`
            return;
        }

        resultDiv.innerHTML = `<h3>${amount} ${from} = ${converted.toFixed(2)} ${to}</h3>`
    } catch (err) {
        resultDiv.innerHTML = `<p class="text-danger">Conversion failed. Try again later.</p>`
    }
}


amountInput.addEventListener("input", convertCurrency);
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);


swapBtn.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    const amount = parseFloat(amountInput.value);
    if (!isNaN(amount)) {
        convertCurrency();
    } else {
        resultDiv.innerHTML = "";
    }
});

getCurrencyList();


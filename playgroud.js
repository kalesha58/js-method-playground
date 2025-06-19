const methodInput = document.getElementById('method');
const arrayInput = document.getElementById('arrayInput');
const functionInput = document.getElementById('functionInput');
const outputCode = document.getElementById('outputCode');
const historyList = document.getElementById('history');

const examples = {
  map: { arr: "[1,2,3]", fn: "x => x * 10" },
  filter: { arr: "[1,2,3,4]", fn: "x => x % 2 === 0" },
  find: { arr: "[1,2,3,4]", fn: "x => x > 2" },
  reduce: { arr: "[1,2,3,4]", fn: "(acc, cur) => acc + cur" },
  call: { arr: "N/A", fn: "function() { return `Hi ${this.name}` }" },
  apply: { arr: "N/A", fn: "function(a,b) { return a + b + ' by ' + this.name }" },
  bind: { arr: "N/A", fn: "function() { return 'Bound: ' + this.name }" }
};

// Populate dropdown
Object.keys(examples).forEach(m => {
  methodInput.innerHTML += `<option value="${m}">${m}()</option>`;
});

// Load example on click
function loadExample() {
  const m = methodInput.value;
  const e = examples[m];
  if (e.arr !== "N/A") arrayInput.value = e.arr;
  functionInput.value = e.fn;
}

// Run and evaluate
function run() {
  const m = methodInput.value;
  let res, arr, fn;
  try {
    if (m !== 'call' && m !== 'apply' && m !== 'bind') {
      arr = eval(arrayInput.value);
      fn = eval(`(${functionInput.value})`);
    } else {
      fn = eval(`(${functionInput.value})`);
    }

    switch (m) {
      case 'map': res = arr.map(fn); break;
      case 'filter': res = arr.filter(fn); break;
      case 'find': res = arr.find(fn); break;
      case 'reduce': res = arr.reduce(fn); break;
      case 'call': res = fn.call({name:'Alice'}); break;
      case 'apply': res = fn.apply({name:'Bob'}, [5,10]); break;
      case 'bind': const bound = fn.bind({name:'Charlie'}); res = bound(); break;
    }

    const output = JSON.stringify(res, null, 2);
    outputCode.textContent = output;
    Prism.highlightElement(outputCode);

    saveHistory({ method: m, array: arrayInput.value, fn: functionInput.value, result: res });
  } catch (e) {
    outputCode.textContent = `Error: ${e.message}`;
    Prism.highlightElement(outputCode);
  }
}

// History
function saveHistory(item) {
  const hist = JSON.parse(localStorage.getItem('playHist') || '[]');
  hist.unshift(item);
  localStorage.setItem('playHist', JSON.stringify(hist.slice(0, 5)));
  renderHistory();
}

function renderHistory() {
  const hist = JSON.parse(localStorage.getItem('playHist') || '[]');
  historyList.innerHTML = '';
  hist.forEach((h,i) => {
    const li = document.createElement('li');
    li.textContent = `${h.method} → result: ${JSON.stringify(h.result)}`;
    li.onclick = () => {
      methodInput.value = h.method;
      if (examples[h.method]?.arr !== "N/A") arrayInput.value = h.array;
      functionInput.value = h.fn;
    };
    historyList.appendChild(li);
  });
}

renderHistory();

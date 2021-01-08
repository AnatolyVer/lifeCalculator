'use strict'

const button1 = document.getElementById("1")
const button2 = document.getElementById("2")
const list = document.getElementById("list")
const change = document.getElementById("changeConfirm")
const closeM = document.getElementById("close")
let idCh

const getItem = ({product,price,id}) => 
`<div class="product" id="product-${id}"><span class="listContent">  ${product}</span>
<span class="contentPrice" style="color:red">-${price}</span>
<button class="rButton" data-id="${id}">Редактировать</button>
<button class="deleteButton" id="${id}">Удалить</button>
</div>`


const calculateLost = () => {
  const arr = JSON.parse(getData('cart'))
  let sum = 0 
  arr.forEach(product => sum += Number(product.price))
  localStorage.setItem('losing',sum)
}


const getData = key =>{
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
  if (!localStorage.getItem('earning')) {
    localStorage.setItem('earning', 0);
  }
  if (!localStorage.getItem('losing')) {
    localStorage.setItem('losing', 0);
  }
  return localStorage.getItem(key)
}

const getStatus = () => {
  const diff = (getData('earning') - getData('losing'))
  return `
<div class="status"><div class="statusContent">Доходы:<a style="color:green;">+${getData('earning')}</a></div>
<div class="statusContent">Расходы:<a style="color:red;">-${getData('losing')}</a></div>
<div class="statusContent">Прибыль:<a>${diff}</a></div></div>`
}


const deleteProduct = ({target}) =>{
  const elem = document.getElementById(`product-${target.id}`);
  const modal = document.getElementById('modal')
  let arr = JSON.parse(getData('cart'));
  if (target.hasAttribute('data-id'))
  {
    modal.style.display = "block"
    idCh = target.getAttribute('data-id')
    return
  }
  elem.parentNode.removeChild(elem);
  
  const elemForDelete = arr.find((elem) => elem.id == target.id);
  arr = arr.filter(elem => elem != elemForDelete)
  localStorage.setItem("losing",Number(getData('losing')) - Number(elemForDelete.price))
  localStorage.setItem('cart', JSON.stringify(arr));
  Refresh()
}


const changeClick = ({target}) =>{
  const arr = JSON.parse(getData('cart'));
  const elemForChange = arr.find(elem => elem.id == idCh)
  const product = document.getElementById('inputProductCh').value
  const price = document.getElementById('inputPriceCh').value
  if (price && product)
  {
    elemForChange.product = product
    elemForChange.price = price
    modal.style.display = "none"
    localStorage.setItem('cart', JSON.stringify(arr));
  }
  calculateLost()
  Refresh()
}

const closeModal = () =>  modal.style.display = "none"


const Refresh = () => {
while(list.firstChild)  list.firstChild.remove()
while(payment.firstChild)  payment.firstChild.remove()
payment.insertAdjacentHTML('beforeend', getStatus())
const data = JSON.parse(getData('cart'));
data.forEach((product) =>
  list.insertAdjacentHTML('beforeend', getItem(product))
  )
}

const confirmEarn = ({ target }) => {
   const earn = document.getElementById("inputEarn").value
   if (earn > 0 && earn < 100000000) localStorage.setItem("earning",Number(getData('earning')) + Number(earn))
   Refresh()
  }


const confirmLose = ({ target }) => {
    const product = document.getElementById("inputProduct").value
    const price = document.getElementById("inputPrice").value
    if (product && price){
      if (price > 0 && price < 100000000){
        localStorage.setItem("losing",Number(getData('losing')) + Number(price))
        const arr = JSON.parse(getData('cart'));
        let id 
        arr[arr.length - 1]?.id ? id = arr[arr.length - 1].id + 1 : id = 1 //проверка  для установки id для продукта
        arr.push({product,price,id})
        localStorage.setItem('cart', JSON.stringify(arr));
      }
    }
    Refresh()
    calculateLost()
}



const init = () => {
button1.addEventListener('click', confirmEarn)
button2.addEventListener('click', confirmLose)
list.addEventListener('click', deleteProduct)
change.addEventListener('click', changeClick)
closeM.addEventListener('click', closeModal)
getData('cart')
  Refresh()
}

init()
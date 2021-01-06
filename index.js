'use strict'

const button1 = document.getElementById("1")
const button2 = document.getElementById("2")
const list = document.getElementById("list")
const change = document.getElementById("changeConfirm")
const closeM = document.getElementById("close")
let idCh

const getItem = ({product,price,id}) => 
`<div class="product" id=product-${id}><span class="listContent">  ${product}</span>
<span class="contentPrice" style="color:red">-${price}</span>
<button class="rButton" data-id="${id}">Редактировать</button>
<button class="deleteButton" id="${id}">Удалить</button>
</div>`


const getStatus = () => {
  let diff = (localStorage.getItem("earning") - localStorage.getItem("losing"))
  return `
<div class="status"><div class="statusContent">Доходы:<a style="color:green;">+${localStorage.getItem("earning")}</a></div>
<div class="statusContent">Расходы:<a style="color:red;">-${localStorage.getItem("losing")}</a></div>
<div class="statusContent">Прибыль:<a>${diff}</a></div></div>`
}


const delet = ({target}) =>{
  const elem = document.getElementById(`product-${target.id}`);
  const modal = document.getElementById('modal')
  let arr = JSON.parse(localStorage.getItem('cart'));
  if (target.hasAttribute('data-id'))
  {
    modal.style.display = "block"
    idCh = target.getAttribute('data-id')
    return
  }
  elem.parentNode.removeChild(elem);
  
  const elemForDelete = arr.find((elem) => elem.id == target.id);
  arr = arr.filter(elem => elem != elemForDelete)
  localStorage.setItem("losing",Number(localStorage.getItem("losing")) - Number(elemForDelete.price))
  localStorage.setItem('cart', JSON.stringify(arr));
  Refresh()
}


const changes = ({target}) =>{
  const arr = JSON.parse(localStorage.getItem('cart'));
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
  Refresh()
}

const closeModal = () =>  modal.style.display = "none"


const Refresh = () => {
while(list.firstChild)  list.firstChild.remove()
while(payment.firstChild)  payment.firstChild.remove()
payment.insertAdjacentHTML('beforeend', getStatus())
const data = JSON.parse(localStorage.getItem('cart'));
data.forEach((product) =>
  list.insertAdjacentHTML('beforeend', getItem(product))
  )
}

const click1 = ({ target }) => {
   const earn = document.getElementById("inputEarn").value
   localStorage.setItem("earning",Number(localStorage.getItem("earning")) + Number(earn))
   Refresh()
  }


const click2 = ({ target }) => {
    const product = document.getElementById("inputProduct").value
    const price = document.getElementById("inputPrice").value
    if (!localStorage.getItem('cart')) {
      localStorage.setItem('cart', JSON.stringify([]));
    }
    if (product && price){
        localStorage.setItem("losing",Number(localStorage.getItem("losing")) + Number(price))
        const arr = JSON.parse(localStorage.getItem('cart'));
        let id 
        arr[arr.length - 1]?.id ? id = arr[arr.length - 1].id + 1 : id = 1
        arr.push({product,price,id})
        localStorage.setItem('cart', JSON.stringify(arr));
    }
    Refresh()
}



const init = () => {
button1.addEventListener('click', click1)
button2.addEventListener('click', click2)
list.addEventListener('click', delet)
change.addEventListener('click', changes)
closeM.addEventListener('click', closeModal)
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
  Refresh()
}


init()
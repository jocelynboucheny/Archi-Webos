let gallery = document.querySelector(".gallery");
gallery.classList.add("gallery");
let galleryArray = [];
let filtersArray = [];

const fetchGallery = async function() {
     await fetch("http://localhost:5678/api/works")
    .then(function(res) {
            return res.json();
    })

    .then(function(value) {
      console.log(value)
      galleryArray.push(...value)
    })
    
};

const createGallery = function (works){
    
    works.forEach(work => {
        console.log(work) 
        const galleryFigure = document.createElement("figure");
        const figureImage = document.createElement("img");
        const figureText = document.createElement("figcaption");
        figureImage.src = work.imageUrl;
        galleryFigure.setAttribute("data-id", work.id)

        figcaption = work.title;
        figureText.classList.add("galleryFigcaption");
        figureText.textContent = figcaption;

         galleryFigure.appendChild(figureImage);
         galleryFigure.appendChild(figureText);
         galleryFigure.classList.add("category" + work.categoryId);
         galleryFigure.classList.add("all");
         gallery.appendChild(galleryFigure);
         console.log(galleryFigure) 
    });
    
}

const handleGallery = async function () {
  await fetchGallery();
  createGallery(galleryArray);

}

window.onload = handleGallery()
console.log(galleryArray)
// *** Filtres

let filters = document.querySelector(".filterContainer")



const getCategory = async function() {
    await fetch("http://localhost:5678/api/categories")
    .then(function(res){
        console.log(res)
        if(res.ok) {
            return res.json()
        }
    })
    .then(function(data){
        console.log(data)

        for(i=0; i<data.length; i++){
            let filterButton = document.createElement("button")
            filterButton.classList.add("filter")
            filterButton.innerHTML = data[i].name
            filterButton.dataset.category = "category" + data[i].id
            filters.appendChild(filterButton)
            console.log(filterButton)
        }

        for(const button of filters.children){
            button.addEventListener('click', () => {
                filterWorks(button.dataset.category)})
        }
    })};

function filterWorks(category){
    console.log(category)
    for(const child of gallery.children){
        if(child.classList.contains(category)){
            child.style.display = "Block"
        } else{
            child.style.display = "None"
        }
       }
};

window.onload = getCategory()

// *** Homepage_edit

let editToken = localStorage.getItem('token')

if (editToken !== null) {
    document.querySelectorAll('.edit_display').forEach(a => {
        a.style.display = 'Flex'
    })
    let filtres = document.querySelector(".filterContainer")
    filtres.style.display = 'none'

    let loginLink = document.querySelector('.loginLink')
    loginLink.innerHTML = 'logout' 
}

let modal = null
const focusableSelector = 'button, a, input, textarea'
let focusables = []

// * Gallery Modal *

let modalGallery = document.querySelector(".modal_gallery")

const fetchAllWorks = function() {
    fetch("http://localhost:5678/api/works")
    .then(function(res) {
        if (res.ok) {
            return res.json()
        }
    })
    .then(function(value) {
        console.log(value)
        modalGallery.innerHTML = ''
    value.forEach((items ) => {
            let modalFigure = document.createElement("figure")
            modalFigure.classList.add("gallery_card")
            modalFigure.setAttribute("id", "modalFigure")
            console.log(modalFigure)

            let modalFigureImage = document.createElement("img")
            let modalImage = items.imageUrl
            modalFigureImage.src = modalImage
            modalFigureImage.classList.add("modal_figureImage")
            modalFigure.setAttribute("data-id", items.id)

            let modalFigureText = document.createElement("figcaption")
            modalFigureText.classList.add("gallery_textEdit")
            modalFigureText.innerHTML = '<a href="#" class="gallery_textEdit">éditer</a>'

            let modalFigureDeleteIcon = document.createElement("button")
            modalFigureDeleteIcon.classList.add("modal_deleteButton")
            modalFigureDeleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
            modalFigureDeleteIcon.addEventListener('click',function ()  {deleteWorks(items)} )
            modalFigure.appendChild(modalFigureImage)
            modalFigure.appendChild(modalFigureText)
            modalFigure.appendChild(modalFigureDeleteIcon)
            modalGallery.appendChild(modalFigure)
        })
    })
} 

fetchAllWorks()

// * Modal *

const openModal = function (e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute('href'))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus()
    modal.style.display = null
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    fetchAllWorks()
}

const closeModal = function (e) {
    if (modal === null) return
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null; 
    fetchGallery()
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
    console.log(index)

    if (e.shiftKey === true) {
        index--
    } else {
        index ++
    } 
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
    console.log(focusables)
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
}) 

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})

// * Modal 2 *

let modalWrapper = document.querySelector('.modal_wrapper')
let modalTitle = document.querySelector('.modal_title')
let modalLigne1 = document.querySelector('.ligne')
let newPictureButton = document.querySelector('.modal_button')
let galleryDeleteButton = document.querySelector('.modal_delete')

let buttonArrowModal2 = document.createElement("button")
let modalForm = document.createElement("form")
let modalLigne = document.createElement("div")

const openModal2 = function (e) {
    e.preventDefault();

    modalWrapper.removeChild(modalGallery)
    modalWrapper.removeChild(newPictureButton)
    modalWrapper.removeChild(galleryDeleteButton)
    modalWrapper.removeChild(modalLigne1)
    
    modalTitle.innerHTML = 'Ajout Photo'

    buttonArrowModal2.innerHTML = '<i class="fa-solid fa-arrow-left"></i>'
    buttonArrowModal2.classList.add("arrow_button")

    modalForm.innerHTML = '<div class="addPicture_container"><i class="fa-regular fa-image addPicture_icon"></i><label for="uploadPictureButton" class="addPicture_button">+ Ajouter photo</label><input type="file" class="upload" id="uploadPictureButton" name="image" accept=".png, .jpg, .jpeg" style="opacity: 0;"/><p class="addPicture_text">jpg, png : 4mo max</p></div><label class="modal2_formLabel">Titre</label><input class="modal2_formInpute" id="formTitle" type="text" name="title" required><label class="modal2_formLabel">Catégorie</label><select id="formCategory" class="modal2_formInpute" name="category" type="select" required><option value="" selected disabled></option><option value="1">Objets</option><option value="2">Appartements</option><option value="3">Hôtels & restaurants</option></select><div class="errorMessage"></div><input class="validate_button" id="valid_button" type="submit" value="Valider" />'
    modalForm.classList.add('modal2_form')

    modalLigne.classList.add('ligne2')

    modalWrapper.appendChild(buttonArrowModal2)
    modalWrapper.appendChild(modalForm)
    modalWrapper.appendChild(modalLigne)

// * Ajout preview picture *

let addPictureContainer = document.querySelector('.addPicture_container')
let addPictureIcon = document.querySelector('.addPicture_icon')
let addPictureButton = document.querySelector('.addPicture_button')
let addPictureText = document.querySelector('.addPicture_text')
let addPictureInput = document.querySelector('.upload')

addPictureInput.addEventListener('change', preview)

function preview() {
    addPictureContainer.removeChild(addPictureIcon)
    addPictureContainer.removeChild(addPictureButton)
    addPictureContainer.removeChild(addPictureText)

    let picturePreviewFile = addPictureInput.files

    if(validFileType(picturePreviewFile[0])) {
        let picturePreview = document.createElement('img')
        picturePreview.classList.add('previewPicture')
        picturePreview.src = window.URL.createObjectURL(picturePreviewFile[0])

        addPictureContainer.appendChild(picturePreview)
    }
}

var fileTypes = [
    'image/jpeg',
    'image/png'
  ]
  
function validFileType(file) {
    
for(var i = 0; i < fileTypes.length; i++) {
    console.log(fileTypes)
    if(file.type === fileTypes[i]) {
    return true;
    }
}

return false
}

// Récupération des éléments HTML
let imgValid = document.getElementById("uploadPictureButton");
let titleValid = document.getElementById("formTitle");
let projectValid = document.getElementById("formCategory");
let buttonValider = document.getElementById("valid_button");

uploadPictureButton.addEventListener('change',(even)=>{
    even.preventDefault();
    if (uploadPictureButton.value !== "") {
        imgValid = true;
    }else{
        imgValid = false;
    }
    activeButtonValide(imgValid, titleValid, projectValid)
})


formTitle.addEventListener('input',(even)=>{
    even.preventDefault();
    if (formTitle.value !== "") {
        titleValid = true;
    }else{
        titleValid = false;
    }
    activeButtonValide(imgValid, titleValid, projectValid)
})

formCategory.addEventListener('input',(even)=>{
    even.preventDefault();
    if (formCategory.value !== "") {
        projectValid = true;
    }else{
        projectValid = false;
    }
    activeButtonValide(imgValid, titleValid, projectValid)
})

 function activeButtonValide(imgValid, titleValid, projectValid){
  if (imgValid == true && titleValid == true && projectValid == true ) {
    console.log(imgValid)
    buttonValider.classList.add('button_green')
  } else {
    buttonValider.classList.add('button_grey')
  }
};
}



newPictureButton.addEventListener('click', (openModal2))

// * Return modal with arrow button *

const returnModal1 = function(e) {        
    modalTitle.innerHTML = 'Galerie Photo'

    modalWrapper.removeChild(buttonArrowModal2)
    modalWrapper.removeChild(modalForm)
    modalWrapper.removeChild(modalLigne)

    modalWrapper.appendChild(modalTitle)
    modalWrapper.appendChild(modalGallery)
    modalWrapper.appendChild(modalLigne1)
    modalWrapper.appendChild(newPictureButton)
    modalWrapper.appendChild(galleryDeleteButton)


}




buttonArrowModal2.addEventListener('click', (returnModal1))

// * Ajout nouveaux travaux  *

modalForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const form = new FormData(modalForm)

    let token = localStorage.getItem('token')

    fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
        'Authorization' : `Bearer ${token}`
        },
        body: form
    }).then(res => {
        if (res.ok) {
            return res.json()
        } else if (res.status === 400) {
            let errorText = document.querySelector(".errorMessage")
            return errorText.innerHTML = "Action impossible."
        } else if (res.status === 401) {
            let errorText = document.querySelector(".errorMessage")
            return errorText.innerHTML = "Action non autorisée !"
        } else if (res.status === 500) {
            let errorText = document.querySelector(".errorMessage")
            return errorText.innerHTML = "Veuillez ajouter une photo."
        }
    }).then(function(data){
        console.log(data)
          createGallery([data])
            returnModal1()
            closeModal()
            modalForm.reset()
    })
})

// * Suppression des travaux  *

 
const removeworksElements = (id)=>{
    const works = document.querySelectorAll(`[data-id = "${id}"]` )
    console.log(works)
    works.forEach(item =>item.remove())
}

   let token = localStorage.getItem('token')

  const deleteWorks = (work) => {
  const id = work.id
     fetch("http://localhost:5678/api/works/" + id, {
          method: 'DELETE',
          headers: {  
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
    }).then(res => {
        if (res.status === 204) {
            return removeworksElements(id)
        } else if (res.status === 401) {
        
        } else if (res.status === 500) {
            
        }
    
    })
} 
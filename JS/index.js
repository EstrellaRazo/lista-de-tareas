console.log("Se vinculó el archivo 😉");

const formulario = document.getElementById('formulario');
const listaTareas = document.getElementById('lista-tareas');
const templanteTarea = document.getElementById('templateTarea').content; //Content: para obtener lo de dentro de la etiqueta
const fragment = document.createDocumentFragment(); //Poder copiar el fragmento de código de dentro

let tareas = {};

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('tareas')) //Si tareas está en mi local storage
    {
        tareas = JSON.parse(localStorage.getItem('tareas')) //Convertir el JSON a manipulación de variable normal
    }   
    pintarTareas();
}); //Cuando cargue mi pagina se ejecuta esto

formulario.addEventListener('submit', (e) => {
    e.preventDefault() //Es para que solo capture el enter una vez
    setTarea(e)
});

listaTareas.addEventListener('click', (e) => {
    btnAcciones(e);
});

const btnAcciones = e => {
    if(e.target.classList.contains('fa-check-circle'))
    {
        tareas[e.target.dataset.id].estado = true;
        pintarTareas()
    }

    if(e.target.classList.contains('fa-minus-circle'))
    {
        delete tareas[e.target.dataset.id]
        pintarTareas()
    }

    if(e.target.classList.contains('fa-undo-alt'))
    {
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
    }

    e.stopPropagation()
}

const setTarea = e => {
    const texto = e.target.querySelector('input').value; //Para tomat el texto del contenedor de tarea

    if(texto.trim() === ''){
        return;
    }

    const tarea = {
        id: Date.now(), //Fecha en la que se ejecutó
        texto,
        estado: false  //porque no se ha terminado
    }

    tareas[tarea.id] = tarea
    pintarTareas()
    formulario.reset()
    e.target.querySelector('input').focus()
}

const pintarTareas = () => {
    localStorage.setItem('tareas', JSON.stringify(tareas));

    if(Object.values(tareas).length === 0)
    {
        listaTareas.innerHTML = `
        <div class="alert alert-dark">
        Sin tareas pendientes 👍😊
        </div> `
        return;
    }

    listaTareas.innerHTML = '';

    Object.values(tareas).forEach((tarea) => {
        const clone = templanteTarea.cloneNode(true);
        clone.querySelector('p').textContent = tarea.texto;

        if(tarea.estado){
            clone.querySelectorAll('.fa')[0].classList.replace('fa-check-circle', 'fa-undo-alt');
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary');
            clone.querySelector('p').style.textDecoration = 'line-through';
        }

        clone.querySelectorAll('.fa')[0].dataset.id = tarea.id;
        clone.querySelectorAll('.fa')[1].dataset.id = tarea.id;
        
        fragment.appendChild(clone)
    })
    listaTareas.appendChild(fragment)
};
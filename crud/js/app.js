const firebaseConfig = {
    apiKey: "AIzaSyB3eBFRQ7Q_-LWEJD5lqm9jN2IViilPDIw",
    authDomain: "crud-ad54c.firebaseapp.com",
    databaseURL: "https://crud-ad54c-default-rtdb.firebaseio.com",
    projectId: "crud-ad54c",
    storageBucket: "crud-ad54c.appspot.com",
    messagingSenderId: "988556145365",
    appId: "1:988556145365:web:2dde70db68a5c359de285c",
    measurementId: "G-RGHCLRSZ1C"
}

const closeUpdateModal = document.getElementById('closeUpdateModal')
const updateForm = document.getElementById('Update-form')
const openModal = document.getElementById('openRegisterModal')
const modal = document.getElementById('modal')
const closeModal = document.getElementById('closeRegisterModal')
const updateModal = document.getElementById('modal-update')
const registerForm = document.getElementById('register-form')
const studentsTable = document.getElementById('studentsTable')
firebase.initializeApp(firebaseConfig);
const studentRef = firebase.database().ref('students');

const showUpdateModal = () => {
    updateModal.classList.toggle('is-active')
}

const showRegisterModal = () => {
    modal.classList.toggle('is-active')
}
openModal.addEventListener('click', showRegisterModal)
closeModal.addEventListener('click', showRegisterModal)

const deleteStudent = (uid) => {
    firebase.database().ref(`student/${uid}`).remove()
}

closeUpdateModal.addEventListener('click', showUpdateModal)

window.addEventListener('DOMContentLoaded', async (e) => {
    await studentRef.on('value', (students) => {
        studentsTable.innerHTML = ''
        students.forEach((student) => {
            let studentData = student.val()
            studentsTable.innerHTML += `<tr>
                <th>1</th>
                <td>${studentData.Nombre}</td>
                <td>${studentData.Apellido_Paterno}</td>
                <td>${studentData.Apellido_Materno}</td>
                <td>${studentData.Telefono}</td>
                <td>${studentData.Correo_Electrónico}</td>
                <td>
                <button class ="button is-warning" data-id="${studentData.Uid}">
                    <i class ="fas fa-pencil-alt"></i>
                </button>
                <button class ="button is-danger" data-id="${studentData.Uid}">
                    <i class ="fas fa-trash"></i>
                </button>
                </td>
            </tr>`

            const updateButtons = document.querySelectorAll('.is-warning')
            updateButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    showUpdateModal()
                    firebase.database().ref(`students/${e.target.dataset.id}`).once('value').then((student) => {
                        const data = student.val()
                        updateForm['nombre'].value = data.Nombre
                        updateForm['apePat'].value = data.Apellido_Paterno
                        updateForm['apeMat'].value = data.Apellido_Materno
                        updateForm['cel'].value = data.Telefono
                        updateForm['email'].value = data.Correo_Electrónico
                        updateForm['desc'].value = data.Descripcion
                    })
                    const uid = e.target.dataset.id
                    updateForm.addEventListener('submit', (e) => {
                        e.preventDefault()

                        const nombre = updateForm['nombre'].value
                        const apellidoPaterno = updateForm['apePat'].value
                        const apellidoMaterno = updateForm['apeMat'].value
                        const telefono = updateForm['cel'].value
                        const correoElectronico = updateForm['email'].value
                        const descripcion = updateForm['desc'].value

                        firebase.database().ref(`students/${uid}`).update({ 
                            Nombre: nombre,
                            Apellido_Paterno: apellidoPaterno,
                            Apellido_Materno: apellidoMaterno,
                            Telefono: telefono,
                            Correo_Electrónico: correoElectronico,
                            Descripcion: descripcion
                        })
                        showUpdateModal()
                    })
                })
            })

            const deleteButtons = document.querySelectorAll('.is-danger')
            deleteButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    deleteStudent(e.target.dataset.id)
                })
            })
        })
    })
})

registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const nombre = registerForm['nombre'].value
    const apellidoPaterno = registerForm['apePat'].value
    const apellidoMaterno = registerForm['apeMat'].value
    const telefono = registerForm['cel'].value
    const correoElectronico = registerForm['email'].value
    const descripcion = registerForm['desc'].value

    const registerStudent = studentRef.push()

    registerStudent.set({
        Uid: registerStudent.path.pieces_[1],
        Nombre: nombre,
        Apellido_Paterno: apellidoPaterno,
        Apellido_Materno: apellidoMaterno,
        Telefono: telefono,
        Correo_Electrónico: correoElectronico,
        Descripcion: descripcion


    })
    showRegisterModal()
})

const fs = require('fs')
const users = require('/pageRocketseat/users.json')
const { age, date } = require('/pageRocketseat/public/scripts/utils.js')

// Menu
exports.menu = function(req, res) {
    return res.render("students/menu.njk", {students: users.students})
}

// create
exports.create = function(req, res) {
    return res.render("students/create.njk")
}

// post
exports.post = function(req, res) {
    // req.query
    // req.body, (para pegar os dados do corpo)
    // {"avatar_url", "name", "birth", "teaching", "services"}

    const keys = Object.keys(req.body)

    for (key of keys) {
        // req.body.key == ""
        if(req.body[key] == "") {
            return res.send(`Please, fill the field: ${ key.toUpperCase() }`)
        }
    }
    
    birth = Date.parse(req.body.birth)
    const created_at = Date.now()
    
    let id = 1
    const lastMember = users.students[users.students.length - 1]

    if (lastMember) {
        id = lastMember.id + 1
    }

 
    users.students.push({
        ...req.body,
        id,
        birth,
        created_at
    })

    fs.writeFile("users.json", JSON.stringify(users, null, 2), function(err) {
        if(err) {
            return res.send("Write users error!")
        }
        return res.redirect("/students")
    })

    // return res.send(req.body)
}

// show
exports.show = function(req, res) {

    const { id } = req.params
    
    const foundStudent = users.students.find(function(student) {
        return student.id == id
    })

    if (!foundStudent) {
        return res.send("Student not found!")
    }

    const ideal_student = {
        ...foundStudent,
        age: age(foundStudent.birth),
        birth: date(foundStudent.birth).birthDay,
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundStudent.created_at)
    }

    return res.render("students/show.njk", { student: ideal_student })

}

// edit
exports.edit = function(req, res) {

    const { id } = req.params

    const foundStudent = users.students.find(function(student) {
        return student.id == id
    })

    if (!foundStudent) {
        return res.send("Student not found!")
    }

    //Fixing date 
    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).iso
    }


    return res.render("students/edit.njk", { student })
}

// put
exports.put = function(req, res) {

    const { id } = req.body
    let index = 0

    const foundStudent = users.students.find(function(student, foundIndex) {
        if (id == student.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundStudent) {
        return res.send("Student not found!")
    }

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    users.students[index] = student

    fs.writeFile('users.json', JSON.stringify(users, null, 2), function(err) {
        if (err) {
            res.send("Write file erro!")
        }
        return res.redirect(`/students/${id}`)
    })
}

// delete
exports.delete = function(req, res) {

    const { id } = req.body

    const filteredInstructors = users.students.filter(function(student) {
        return student.id != id
    })

    users.students = filteredInstructors

    fs.writeFile('users.json', JSON.stringify(users, null, 2), function(err) {
        if (err) {
            return res.send("Write file erro!")
        }
        return res.redirect('/students')
    })
}
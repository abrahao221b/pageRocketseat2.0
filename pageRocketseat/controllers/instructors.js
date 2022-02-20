const fs = require('fs')
const users = require('/pageRocketseat/users.json')
const { age, date } = require('/pageRocketseat/public/scripts/utils.js')


function teaching(instructor) {
    if (instructor.teaching == 'P') {
        return "Presencial"
    } else {
        return "Online"
    } 
}
 
function degree(instructor) {
    switch(instructor.degree) {
        case 'H':
            return "Ensino Médio Completo"
        case 'C':
            return "Ensino Superior Completo"
        case 'P':
            return "Ensino Superior completo. Com graduação"
        case 'M':
            return "Ensino Superior completo. Com graduação e mestrado"
        case 'D':
            return "Ensino Superior completo. Com gradução e doutorado"
        case 'PM':
            return "Ensino Superior completo. Com gradução, mestrado e doutorado"
        case 'PD':
            return "Ensino Superior completo. Com gradução, doutorado e pos. doutorado"
        case 'PMD':
            return "Ensino Superior completo. Com gradução, mestrado, doutorado e pos. doutorado"
        default:
            return ""
    }
}

// Menu
exports.menu = function(req, res) {
    return res.render("instructors/menu.njk", {instructors: users.instructors})
}

// create
exports.create = function(req, res) {
    return res.render("instructors/create.njk")
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

    let { avatar_url, birth, degree, name, teaching, services} = req.body
    
    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(users.instructors.length + 1)

 
    users.instructors.push({
        id,
        name,
        birth,
        degree,
        teaching,
        services,
        avatar_url,
        created_at
    })

    fs.writeFile("users.json", JSON.stringify(users, null, 2), function(err) {
        if(err) {
            return res.send("Write users error!")
        }
        return res.redirect("/instructors")
    })

    // return res.send(req.body)
}

// show
exports.show = function(req, res) {

    const { id } = req.params
    
    const foundInstructor = users.instructors.find(function(instructor) {
        return instructor.id == id
    })

    if (!foundInstructor) {
        return res.send("Instructor not found!")
    }

    const ideal_instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        degree: degree(foundInstructor),
        teaching: teaching(foundInstructor),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at)
    }

    return res.render("instructors/show.njk", { instructor: ideal_instructor })

}

// edit
exports.edit = function(req, res) {

    const { id } = req.params

    const foundInstructor = users.instructors.find(function(instructor) {
        return instructor.id == id
    })

    if (!foundInstructor) {
        return res.send("Instructor not found!")
    }

    //Fixing date 
    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }


    return res.render("instructors/edit.njk", { instructor })
}

// put
exports.put = function(req, res) {

    const { id } = req.body
    let index = 0

    const foundInstructor = users.instructors.find(function(instructor, foundIndex) {
        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundInstructor) {
        return res.send("Instructor not found!")
    }

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    users.instructors[index] = instructor

    fs.writeFile('users.json', JSON.stringify(users, null, 2), function(err) {
        if (err) {
            res.send("Write file erro!")
        }
        return res.redirect(`/instructors/${id}`)
    })
}

// delete
exports.delete = function(req, res) {

    const { id } = req.body

    const filteredInstructors = users.instructors.filter(function(instructor) {
        return instructor.id != id
    })

    users.instructors = filteredInstructors

    fs.writeFile('users.json', JSON.stringify(users, null, 2), function(err) {
        if (err) {
            return res.send("Write file erro!")
        }
        return res.redirect('/instructors')
    })
}
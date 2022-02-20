const express = require('express')
const routes = express.Router()
const courses = require("./data")
const instructors = require('./controllers/instructors')
const students = require('./controllers/students')

// Main-page
routes.get("/", function(req, res) {
    return res.render("page-home.njk")
})

routes.get("/contents", function(req, res) {
    return res.render("contents.njk", {items: courses})
})

routes.get("/course", function(req, res) {
    const id = req.query.id

    const course = courses.find(function(course) {
        return course.id == id
    })

    if (!course) {
        return res.send("Course not found!!")
    }

    return res.render("course.njk", {item: course})
})

//Instructors routes
routes.get("/instructors", instructors.menu)
routes.get('/instructors/create', instructors.create)
routes.post('/instructors', instructors.post)
routes.get('/instructors/:id', instructors.show)
routes.get('/instructors/:id/edit', instructors.edit)
routes.put('/instructors', instructors.put)
routes.delete('/instructors', instructors.delete)

//Students routes
routes.get("/students", students.menu)
routes.get('/students/create', students.create)
routes.post('/students', students.post)
routes.get('/students/:id', students.show)
routes.get('/students/:id/edit', students.edit)
routes.put('/students', students.put)
routes.delete('/students', students.delete)

module.exports = routes
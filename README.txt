Documentation:
---------------------------------------------------------------
packages used:

server: 		express v4.18.2
			body-parser v1.20.1

mongoDB:		mongoose v6.7.3

authentication:	jsonwebtoken v8.5.1

encryption: 	bcryptjs v2.4.3

validation: 	express-validator v6.14.2

sending emails:	nodemailer v6.8.0
			nodemailer-sendgrid-transport v0.2.0

(dev)runtime:	nodemon v2.0.20
---------------------------------------------------------------
server running on: http://localhost:3000/
---------------------------------------------------------------
mongoDB Atlas url:
mongodb+srv://jozo:jozo@application.n6nqazb.mongodb.net/notes

mongoDB compass url:
mongodb+srv://jozo:jozo@application.n6nqazb.mongodb.net/test
---------------------------------------------------------------
jsonwebtoken secret:

"jwtsecret"
---------------------------------------------------------------
users in database you can sign in to

email:	user1@mail.com
password:	password1

email:	user2@mail.com
password:	password2
---------------------------------------------------------------
requests body and routes:
-------------
desription: signs a user up

method:	PUT
url:		http://localhost:3000/auth/signup

body:

{
    "email": "",
    "password": "",
    "confirmPassword": "",
    "username": ""
}

-------------
desription: logs a user in

method:	POST
url:		http://localhost:3000/auth/login

body:

{
    "email": "",
    "password": ""
}

-------------
desription: create a category

method:	PUT
url:		http://localhost:3000/category

body:

{
    "categoryName": ""
}

-------------
desription: get list of all categories for logged in user 

method:	GET
url:		http://localhost:3000/category

body: null

-------------
desription: update a category name

method:	PATCH
url:		http://localhost:3000/category

body:

{
    "categoryName": "",
    "updatedCategoryName": ""
}

-------------
desription: delete a category and all of its notes

method:	DELETE
url:		http://localhost:3000/category

body:

{
    "categoryName": ""
}

-------------
desription: fetch posts by category

method:	POST
url:		http://localhost:3000/category

body:

{
    "categoryName": ""
}

-------------
desription: create a note

method:	PUT
url:		http://localhost:3000/note

body:

{
    "title": "",
    "content": "",
    "tags": [""],
    "categoryName": ""
}

-------------
desription: fetch a note by title

method:	POST
url:		http://localhost:3000/note

body:

{
    "title": ""
}

-------------
desription:	fetch all notes sorted by most recent update

method:	GET
url:		http://localhost:3000/note

body: null

-------------
desription: update a note by fetching a title

method:	PATCH
url:		http://localhost:3000/note

body:

{
    "title": "",
    "updatedTitle": "",
    "updatedContent": "",
    "updatedTags": [""]
}

-------------
desription: delete a note by title

method:	DELETE
url:		http://localhost:3000/note

body:

{
    "title": ""
}

-------------
desription: fetch notes from tag, sorted by most recent update

method:	POST
url:		http://localhost:3000/note/tag

body:

{
    "tag": ""
}

(((try looking for "love" tag many notes share this tag)))
---------------------------------------------------------------






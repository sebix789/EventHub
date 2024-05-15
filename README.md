# EventHub

EventHub is a web application made for creating, sharing, managing and searching events available in selected area. Application allows users to registering accounts and organizing events.

Link to UX in Figma: https://www.figma.com/file/MFShbVGAifpyu9dJTD91UC/Landing-Page?type=design&node-id=0%3A1&mode=design&t=Asw57yESECFsdS0Y-1

Technical Overview:
- Start Page: users can see all events available in selected area. This view also allows users to search the specific event
- Registraiting/Log In account card: allows users to create or log in to exisiting account
- Main Page: allows users to create their own event after successfull log in and display upcoming events created by logged user
- Create Event Details: display a specific form used to create Event
- My Event: display all events created
- My Event Details: display specific details about created event: name, date, map with localisation, description and possibility to edit event details

Getting Started

You need to download database MongoDB and connect with following link:
mongodb://localhost:27017

First you need to type "cd eventHub"
Next you need to run command 'npm install' to download all neceserry dependencies.
If there is any error, run an 'npm i "missing dependencie"' and it should work.

Next you need to run in terminal "cd eventHub" and then "npm start" it should run your server MongoDB.

In another command prompt type "cd eventHub" and then "npm run dev" to view your website clicking on your link following link that popped up on terminal.

Package used in project:
- @fortawesome/fontawesome-free: "^6.5.2",
- @types/mongoose: "^5.11.97",
- @types/multer-gridfs-storage: "^4.0.8",
- @types/node: "^20.12.11",
- axios: "^1.6.8",
- bcryptjs: "^2.4.3",
- body-parser: "^1.20.2",
- cors: "^2.8.5",
- express: "^4.19.2",
- jsonwebtoken: "^9.0.2",
- mongodb: "^6.6.1",
- mongoose: "^8.3.4",
- multer: "^1.4.4",
- multer-gridfs-storage: "^1.3.0",
- nodemon: "^3.1.0",
- ts-node: "^10.9.2",
- vue: "^3.4.21",
- vue-leaflet: "^0.1.0",
- vue-router: "^4.3.2",
- vue-toastification: "^2.0.0-rc.5",
- vue3-google-map: "^0.20.0",
- vue3-leaflet: "^1.0.48",
- vuex: "^4.0.2"

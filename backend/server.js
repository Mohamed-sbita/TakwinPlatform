const express = require('express');
const cors = require('cors');
require('./config/connect');
require('dotenv').config();


const userRoute = require('./routes/user');
const actualiteRoute = require('./routes/actualite');
const departmentRoute = require('./routes/department');
const classRoute = require('./routes/class');
const groupeRoute = require('./routes/groupe');
const matiereRoute = require('./routes/matiere');
const emploiDuTempsRoutes = require('./routes/emploiDuTemps');
const attendanceRoute = require('./routes/attendance');
const statRoute = require('./routes/stat');
const contactMessage = require('./routes/contactRoute');
const attestationRoutes = require('./routes/attestation');
const notifRoute = require('./routes/noti');
const { createAdminAccount } = require('./controllers/user');
const coursRoute = require('./routes/cours');


const app = express();
app.use(express.json());
app.use(cors());


app.use('/user', userRoute);
app.use('/actualite', actualiteRoute);
app.use('/notif', notifRoute);
app.use('/departments', departmentRoute);
app.use('/classes', classRoute);
app.use('/groupes', groupeRoute);
app.use('/matieres', matiereRoute);
app.use('/emplois-du-temps', emploiDuTempsRoutes);
app.use('/attendance', attendanceRoute);
app.use('/stats', statRoute);
app.use('/contact', contactMessage);
app.use('/cours', coursRoute);




app.use('/attestations', attestationRoutes);

app.use('/files', express.static('./uploads'));

app.listen(3000, ()=>{
    createAdminAccount();
})
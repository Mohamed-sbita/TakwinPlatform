const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');
const fs = require('fs');
const nodemailer = require('nodemailer');

const createAdminAccount = async () => {
    try {
        const existAdmin = await User.find({ role: 'admin' });
        if (existAdmin.length === 0) {
            const adminData = {
                nom: 'ADMIN',
                prenom: 'ADMIN',
                email: process.env.EMAIL,
                password: bcrypt.hashSync(process.env.PASS, 10),
                tel: process.env.TEL,
                role: 'admin',
                dateNaissance: new Date(),
                codeInscription: 'ADMIN001',
                adresse: 'Admin Address',
                nomParent: 'Admin Parent',
                telParent: process.env.TEL,
                createdAt: new Date()
            };

            const admin = new User(adminData);
            await admin.save();
            console.log('Admin account created successfully');
        } else {
            console.log('Admin account already exists');
        }
    } catch (error) {
        console.error('Error creating admin account:', error);
    }
};


const createUserAccount = async (req, res) => {
    try {
        const { nom, prenom, email, password, tel, role, telParent, adresse, nomParent ,dateNaissance } = req.body;

        const hashedPassword = bcrypt.hashSync(password, 10);

        const userData = {
            nom,
            prenom,
            email,
            password: hashedPassword,
            tel,
            role,
            dateNaissance: dateNaissance ? new Date(dateNaissance) : new Date(),
            codeInscription: generateRandomCode(),
            adresse,
            nomParent,
            telParent,
            createdAt: new Date()
        };

        const user = new User(userData);
        const result = await user.save();

        // Configurer le transporteur d'email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Contenu HTML de l'email
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: 'Bienvenue sur la plateforme Takwin',
            html: `
               <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #2c3e50;">Bienvenue sur Takwin, ${prenom} ${nom} 👋</h2>
    <p style="font-size: 16px; color: #555;">
      Nous avons le plaisir de vous informer que votre compte sur la plateforme <strong>Takwin</strong> a été créé avec succès. Vous trouverez ci-dessous vos identifiants de connexion :
    </p>
    <table style="width: 100%; margin-top: 20px; font-size: 16px;">
      <tr>
        <td style="padding: 8px 0;"><strong>Email :</strong></td>
        <td>${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Mot de passe :</strong></td>
        <td>${password}</td>
      </tr>
    </table>
    <div style="margin-top: 30px; text-align: center;">
      <a href="https://takwin.tn/login" style="background-color: #3498db; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">Accéder à votre espace</a>
    </div>
    <p style="color: #555; font-size: 14px;">Bien cordialement,<br>L'équipe <strong>Takwin</strong></p>
  </div>
</div>

            `
        };

        // Envoyer l'email
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Erreur lors de l\'envoi de l\'email :', err);
            } else {
                console.log('Email de bienvenue envoyé :', info.response);
            }
        });

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Erreur lors de la création du compte utilisateur :', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const payload = {
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            image: user.image,
            tel: user.tel,
            role: user.role,
            dateNaissance: user.dateNaissance,
            createdAt: user.createdAt,
            idClasse: user.idClasse
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY);

        res.status(200).json({
            success: true,
            token: token
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const list = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .sort({ createdAt: -1 })

        res.status(200).send(
            users
        );
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const byGroupe = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' }, idGroupe: req.params.id })
            .select('-password -resetPasswordToken -resetPasswordExpires');

        res.status(200).send(
            users
        );
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const byId = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .populate('idClasse')
            .populate('idGroupe')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).send(user);
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        if (req.image) {
            updateData.image = req.image;
        }

        if (updateData.password) {
            updateData.password = bcrypt.hashSync(updateData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const payload = {
            _id: updatedUser._id,
            nom: updatedUser.nom,
            prenom: updatedUser.prenom,
            email: updatedUser.email,
            image: updatedUser.image,
            tel: updatedUser.tel,
            role: updatedUser.role,
            dateNaissance: updatedUser.dateNaissance,
            createdAt: updatedUser.createdAt,
            idClasse: updatedUser.idClasse
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY);

        res.status(200).json({
            success: true,
            token: token,
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const generateTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

const sendWelcomeEmail = async (email, nom, prenom, plainPassword) => {
    const transporter = generateTransporter();
    const link = `${process.env.CLIENT_URL}/login`;

    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: 'Bienvenue sur la plateforme ',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 30px;">
              <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #2c3e50;">Bonjour ${prenom} ${nom},</h2>
                <p>Votre compte sur <strong></strong> a été créé avec succès.</p>
                <p>Voici vos informations de connexion :</p>
                <ul style="line-height: 1.6; font-size: 16px;">
                  <li><strong>Email :</strong> ${email}</li>
                  <li><strong>Mot de passe :</strong> ${plainPassword}</li>
                </ul>
                <div style="text-align: center; margin-top: 25px;">
                  <a href="http://localhost:4200/login" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Se connecter</a>
                </div>
                <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">Si vous n’êtes pas à l’origine de cette inscription, veuillez ignorer cet email ou nous contacter.</p>
                <p style="color: #343a40; font-size: 14px;">Cordialement,<br>L’équipe </p>
              </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

const bulkCreateStagiaires = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier n’a été téléchargé.'
            });
        }

        const workbook = xlsx.readFile(req.file.path);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = xlsx.utils.sheet_to_json(worksheet);

        const requiredFields = ['Nom', 'Prénom', 'Email', 'Date de Naissance', 'tel', 'Code Inscription', 'Adresse', 'Nom Parent', 'Tél Parent'];
        const missingFields = requiredFields.filter(field => !Object.keys(excelData[0] || {}).includes(field));

        if (missingFields.length > 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: `Champs manquants : ${missingFields.join(', ')}`
            });
        }

        const results = [];
        const errors = [];

        for (const [index, row] of excelData.entries()) {
            try {
                const existingUser = await User.findOne({
                    $or: [
                        { email: row.Email },
                        { codeInscription: row['Code Inscription'] }
                    ]
                });

                if (existingUser) {
                    errors.push({
                        row: index + 1,
                        message: `Utilisateur avec l'email ${row.Email} ou le code ${row['Code Inscription']} existe déjà.`
                    });
                    continue;
                }

                // Traitement de la date de naissance
                let dateNaissance;
                const rawDate = row['Date de Naissance'];

                if (typeof rawDate === 'number') {
                    dateNaissance = new Date((rawDate - 25569) * 86400 * 1000);
                } else if (typeof rawDate === 'string') {
                    const [day, month, year] = rawDate.split('/');
                    if (!day || !month || !year) {
                        errors.push({
                            row: index + 1,
                            message: `Format de date invalide pour ${row.Email}`
                        });
                        continue;
                    }
                    dateNaissance = new Date(`${year}-${month}-${day}`);
                } else {
                    errors.push({
                        row: index + 1,
                        message: `Date de naissance invalide pour ${row.Email}`
                    });
                    continue;
                }

                if (isNaN(dateNaissance.getTime())) {
                    errors.push({
                        row: index + 1,
                        message: `Date de naissance illisible pour ${row.Email}`
                    });
                    continue;
                }

                // Utiliser la date formatée comme mot de passe en clair
                const plainPassword = dateNaissance.toLocaleDateString('fr-FR');
                const hashedPassword = bcrypt.hashSync(plainPassword, 10);

                const stagiaireData = {
                    nom: row.Nom,
                    prenom: row.Prénom,
                    email: row.Email,
                    dateNaissance: dateNaissance,
                    tel: row.tel || '',
                    codeInscription: row['Code Inscription'],
                    adresse: row.Adresse,
                    nomParent: row['Nom Parent'],
                    telParent: row['Tél Parent'],
                    password: hashedPassword,
                    role: 'stagiaire',
                    idClasse: req.body.idClasse,
                    idGroupe: req.body.idGroupe,
                    createdAt: new Date()
                };

                const stagiaire = new User(stagiaireData);
                const savedUser = await stagiaire.save();

                // ✉️ Envoyer l'email de bienvenue
                await sendWelcomeEmail(savedUser.email, savedUser.nom, savedUser.prenom, plainPassword);

                results.push({
                    row: index + 1,
                    _id: savedUser._id,
                    email: savedUser.email
                });

            } catch (error) {
                errors.push({
                    row: index + 1,
                    message: error.message
                });
            }
        }

        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            createdCount: results.length,
            errorCount: errors.length,
            createdUsers: results,
            errors: errors
        });

    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error('Erreur de création en masse :', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



function generateRandomCode() {
    return 'USR' + Date.now().toString().slice(-6);
}

module.exports = {
    createAdminAccount,
    createUserAccount,
    signIn,
    list,
    byId,
    deleteUser,
    update,
    bulkCreateStagiaires,
    byGroupe
};
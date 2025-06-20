const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,


    auth: {
        user: process.env.EMAIL_SENDER, // your email
        pass: process.env.EMAIL_PASSWORD // your email password
    }
});

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('No account with that email address exists.');
        }

        // Generate token
        const token = crypto.randomBytes(20).toString('hex');

        // Set token and expiration (1 hour from now)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
        await user.save();

        // Create reset link
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Instructions de réinitialisation du mot de passe - TAKWIN',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                    <h2 style="color: #333;">Réinitialisation de votre mot de passe - TAKWIN</h2>
                </div>
                <div style="padding: 20px;">
                    <p>Bonjour,</p>
                    <p>Nous avons reçu une demande de réinitialisation du mot de passe de votre compte.</p>
                    
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="background-color: #007bff; color: white; padding: 10px 20px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Réinitialiser mon mot de passe
                        </a>
                    </p>
                    
                    <p>Ou copiez et collez ce lien dans votre navigateur :</p>
                    <p style="word-break: break-all; font-size: 14px; color: #555;">
                        ${resetLink}
                    </p>
                    
                    <p>Ce lien expirera dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, 
                    veuillez ignorer cet e-mail ou contacter notre support.</p>
                    
                    <p>Merci,<br>L'équipe TAKWIN</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; 
                            font-size: 12px; color: #666;">
                    <p>© ${new Date().getFullYear()} TAKWIN. Tous droits réservés.</p>
                </div>
            </div>
            `,
            text: `Instructions de réinitialisation du mot de passe - TAKWIN\n\n` +
                  `Vous recevez ce message car une demande de réinitialisation du mot de passe a été faite pour votre compte.\n\n` +
                  `Veuillez cliquer sur le lien suivant, ou le copier dans votre navigateur pour continuer :\n\n` +
                  `${resetLink}\n\n` +
                  `Ce lien expirera dans 1 heure.\n\n` +
                  `Si vous n'avez pas fait cette demande, vous pouvez ignorer cet e-mail.\n`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).send({message:'Password reset email sent.'});

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing forgot password request.');
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find user by token and check expiration
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        // Hash new password
        user.password = bcrypt.hashSync(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        // Send confirmation email
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_SENDER,
            subject: 'Votre mot de passe a été modifié - TAKWIN',
            text: `Bonjour,\n\n` +
                  `Ceci est une confirmation que le mot de passe de votre compte ${user.email} vient d'être modifié avec succès.\n\n` +
                  `Si vous n'êtes pas à l'origine de cette modification, veuillez contacter immédiatement notre support.\n\n` +
                  `Merci,\n` +
                  `L'équipe TAKWIN`
            
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({message:'Password has been updated.'});

    } catch (error) {
        console.error(error);
        res.status(500).send('Error resetting password.');
    }
};

module.exports = { forgotPassword, resetPassword };
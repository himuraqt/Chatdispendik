const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("🚀 Server is starting...");

// 🔹 Middleware Debugging
app.use((req, res, next) => {
    console.log(`➡️ [${req.method}] ${req.path}`);
    next();
});

// 🔹 **Tambahkan Log saat Router di-load**
console.log("🛠 Loading auth routes...");
app.use('/auth', authRoutes);
console.log("✅ Auth routes loaded!");

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if(type === 'message.new') {
        members
            .filter((member) => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if(!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                        .then(() => console.log('Message sent!'))
                        .catch((err) => console.log(err));
                }
            });

        return res.status(200).send('Message sent!');
    }

    return res.status(200).send('Not a new message request');
});

// 🔹 **Pastikan Ini di Bagian Terakhir**
app.all("*", (req, res) => {
    console.log(`⚠️ Route ${req.originalUrl} not found.`);
    res.status(404).send(`Route ${req.originalUrl} not found.`);
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

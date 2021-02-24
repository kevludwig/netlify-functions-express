import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

export default function expressApp(functionName) {
    const app = express();
    const router = express.Router();

    const routerBasePath = `/api/${functionName}/`;

    // origins that are allowed to call the function if it is used outside of netlify team
    const allowedOrigins = [
        "https://app.example.com",
        "https://example.com",
    ];

    // check origin
    var corsOptions = {
        origin: (origin, callback) => {
            if (
                process.env.NETLIFY_DEV === "true" ||
                allowedOrigins.includes(origin)
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        optionsSuccessStatus: 200,
    };

    router.use(cors(corsOptions));

    // POST /sendmail/: send email using nodemailer
    router.post("/sendmail/", async (req, res) => {
        try {
            const { name, email, message } = JSON.parse(req.body);
            console.log(name, email, message);

            const HTMLTemplate = `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
            </head>
            
            <body>
                <div
                    style="padding: 20px; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">
                    <div class="content-wrapper">
                        <p>Hello ${name},</p>
                        <p>
                            thank you for your message:
                        </p>
                        <p>${message}</p>
                        <p>
                            Kind regards<br />
                            <strong>
                                Company
                            </strong>
                        </p>
                    </div>
                </div>
            </body>
            
            </html>`;

            let transporter = nodemailer.createTransport({
                host: SMTP_SERVER_GOES_HERE,
                port: SMTP_PORT_GOES_HERE,
                auth: {
                    user: USER_GOES_HERE,
                    pass: PASSWORD_GOES_HERE,
                },
            });
            let mailOptions = {
                from: "Company <mail@example.com>",
                to: email,
                subject: "Request from customer",
                html: HTMLTemplate,
            };
            const info = await transporter.sendMail(mailOptions);
            res
                .status(200)
                .send({
                    message: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\nResponse: ${info.response}`,
                    success: true
                });
        } catch (error) {
            res.status(400).send({
                message: "Bad Request: " + error.message,
                success: false
            });
        }
    });

    app.use(routerBasePath, router);
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));

    return app;
}

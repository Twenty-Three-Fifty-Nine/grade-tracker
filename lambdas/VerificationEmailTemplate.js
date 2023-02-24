const VerificationEmailTemplate = (props) => {
    const { email, displayName, token } = props;
    const link = `http://localhost:3000/verify?token=${token}&email=${email}`;
    return `
<html lang="en">
    <head>
        <title>23:59 Email Verification</title>
        <style>
            .content {
                width: 100%;
                max-width: 600px;
            }
            .content h1 {
                font-size: 24px;
                font-weight: 600;
                padding: 0;
            }
            .content p {
                font-size: 16px;
                font-weight: 400;
                padding: 0;
            }
            .content a {
                font-size: 16px;
                font-weight: 400;
                padding: 0;
            }
            button {
                font-size: 17px;
                padding: 0.5em 2em;
                border: transparent;
                box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
                background: #32382c;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                margin: 0 auto;
                transition: 0.2s;
            }

            button:hover {
                background: hsl(90, 12%, 40%);
            }

            button:active {
                transform: translate(0em, 0.2em);
            }
        </style>
    </head>
    <body>
        <div class="content">
            <h1>Hi ${displayName},</h1>
            <p>
                Thank you for signing up to
                <a href="https://twentythreefiftynine.com" target="_blank" referrerpolicy="no-referrer">23:59</a>!
                Please click the button below to verify your email address.
            </p>
            <a href="${link}" target="_blank" rel="noopener">
            <button type="button" >
                Verify Now!
            </button>
            </a>
            <p>
                Kind regards,<br />
                2359 Admin
            </p>
        </div>
    </body>
</html>
        `;
};

export default VerificationEmailTemplate;

const EmailTemplate = (props) => {
    const { email, displayName, token } = props;
    const link = `https://twentythreefiftynine.com/reset-password?token=${token}&email=${email}`;
    return `
<html lang="en">
    <head>
        <title>23:59 Password Reset Email</title>
        <style>
            .content {
                width: 100%;
                max-width: 600px;
                background-color: #fff;
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
                You recently requested to reset your password for your
                <a href="https://twentythreefiftynine.com" target="_blank" referrerpolicy="no-referrer">23:59</a> account.
                Click the button below to reset it.
            </p>
            <a href="${link}" target="_blank" rel="noopener">
            <button type="button" >
                Reset Password
            </button>
            </a>
            <p>
                If you did not request a password reset, please
                <strong>ignore</strong> this email. This
                password reset is only valid for the next hour.
            </p>
            <p>
                Kind regards,<br />
                2359 Admin
            </p>
        </div>
    </body>
</html>
        `;
};

export default EmailTemplate;

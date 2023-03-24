/**
 * Twenty Three Fifty Nine - Grade tracking tool
 * Copyright (C) 2023  Abdulrahman Asfari and Christopher E Sa
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

const DeletedAccountEmailTemplate = () => {
    return `
<html lang="en">
    <head>
        <title>23:59 Account Deletion</title>
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
            <h1>Hello,</h1>
            <p>
                We're sorry to see you go. Your account on <a href="https://twentythreefiftynine.com">23:59</a> has been deleted.
                This is the last email you will recieve from us.
            </p>
            <p>
                All the best,<br />
                2359 Admin
            </p>
        </div>
    </body>
</html>
        `;
};

export default DeletedAccountEmailTemplate;

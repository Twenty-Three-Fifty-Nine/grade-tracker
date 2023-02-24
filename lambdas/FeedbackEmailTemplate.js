const FeedbackEmailTemplate = (props) => {
    const { email, displayName, message, feedbackType } = props;
    return `
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        background-color: #f2f2f2;
        font-family: Arial, Helvetica, sans-serif;
      }

      main {
        margin: 0 auto;
        width: 90%;
        background-color: #fff;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 0 10px #8b8b8b80;
      }

      img {
        width: 100%;
        max-width: 300px;
        display: block;
        margin: 0 auto;
      }

      h2 {
        text-align: left;
        margin-bottom: 0;
        font-size: 1rem;
      }

      div {
        padding: 10px;
      }

      div p {
        margin: 0;
        line-height: 1.5;
      }

      #message {
        padding: 10px;
        margin-top: 10px;
        border-radius: 8px;
        background-color: #f2f2f2;
      }
    </style>
  </head>
  <body>
    <main>
      <h2>Information:</h2>
      <div id="contact-info">
        <p>Name: ${displayName}</p>
        <p>Email: <a href="mailto:test@testing.com">${email}</a></p>
        <p>Contact Reason: ${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)}</p>
      </div>
        <h2>Message:</h2>
        <div id="message">
          <p>${message}</p>
        </div>
    </main>
  </body>
</html>
        `;
};

export default FeedbackEmailTemplate;

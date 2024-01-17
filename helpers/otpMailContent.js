const mail = ({ otp }) => {
  const content = `
        <html>
          <head>
            <style>
              img{
                width:auto;
                heigth:350px;
              }
            </style>
          </head>
          <body>

            <h3>Hi,</h3>
            <p>Greetings!</p>
            <p>You are just a step away from accessing your E-Shopping account</p>
            <p>We are sharing a verification code to access your account. The code is valid for 5 minutes and usable only once.</p>
            <p>Once you have verified the code, you'll be prompted to set a new password immediately. This is to ensure that only you have access to your account.</p>
            <p>Your OTP: <b>${otp}</b></p>
            <p>Expires in: <b>5 minutes</b></p>
            <p>Best Regards,</p>
            <p>Team E-Shopping</p>
          </body>
        </html>`;
  return content;
};

module.exports = mail;

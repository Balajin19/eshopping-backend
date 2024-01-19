const orderMail = (name, orderNo, status, address, phone, date) => {
  const content = `
  <html >
    <head>
    <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
 
     <style>
            body {
                font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            }

            .order-btn {
                padding: 7px;
                background-color: #0d6efd;
                color: white;
                border: 1px solid #0d6efd;
                border-radius: 3px;
            }

            .order-btn a {
                text-decoration: none;
                color: white;
            }

            .mail {
                border: 1px solid rgba(248, 245, 245, 0.904);
                background-color: rgba(248, 245, 245, 0.904);
            }

            .mail .container {
                width: 50%;
                border: 1px solid white;
                border-radius: 3px;
                margin: 5%;
                padding: 20px;
                background-color: white;
                margin-top: 25px;
            }

            .order-details {
                width: 55%;
                padding: 8px;
                border-right: 1.7px solid rgb(233, 231, 231);
            }

                       .address-details {
                width: 45%;
                padding: 10px;
                margin: 5px;
            }

            .row {
                display: flex;
                justify-content: space-around;
            }
        </style>
    </head>

    <body>
        <div class="mail">
            <div class="container">
                <h3 class="mb-5 ">Hi ${name},</h3>
                <div class="row">
              ${
                status === "Cancel"
                  ? `<p>We would like to inform you that we have processed your cancellation request for the Order ${orderNo} has been cancelled.</p>`
                  : `<div class="order-details">
                        <h4>Item in your order has been ${status}!</h4>
                        ${
                          status === "Delivered"
                            ? `<p>Item in order with order number ${orderNo} has been delivered! </p>`
                            : `
                        <p>Your order will be delivered ${
                          status === "Confirmed" ? `by ${date}` : "soon"
                        }.</p>
                        <br>
                      <p> ${
                        status === "Confirmed"
                          ? `We are pleased to confirm your order number ${orderNo}.`
                          : `Your order number ${orderNo} is ${status}`
                      } </p>`
                        }
                        <p>Thanks for shopping with E-Shopping!</p>
                        <button class="order-btn">
                            <a href="http://localhost:3000/dashboard/user/orders">
                                Manage your order
                            </a>
                        </button>
                    </div>
                    <div class="address-details">
                        <h4>Delivery Address</h4>
                        <h4>${name}</h4>
                        <p>${address}</p>
                        <p>Mobile no: ${phone}</p>
                    </div>`
              }
                </div>
                <br>
                <footer>
                    <p>Please share your queries regarding orders, send mail to <a
                            href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a>.</p>
                </footer>
            </div>
        </div>
    </body>
</html>`;
  return content;
};
module.exports = orderMail;

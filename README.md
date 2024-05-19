
# NodeJs Ecommerce App

A simple API Based Ecommerce App Developed with NodeJs

# Project Summary
This project features a fully working e-commerce app with no UI where users can browse products,review them, add them to their cart and finalize their purchase. in addition to that their is also an admin role where he can have more access to the application by adding products or brands, make coupons and much more. (pictures and files are uploaded to cloud using cloudinary)

# Some Features (Pictures)

![confirm your email](https://github.com/AliAmr527/ECommerce-App/assets/131396543/c4718333-576f-4485-8cf5-67540ff35b84)

![email invoice](https://github.com/AliAmr527/ECommerce-App/assets/131396543/1076de78-5849-4945-a38a-545fec657006)

![thank you page](https://github.com/AliAmr527/ECommerce-App/assets/131396543/30aeeea4-f192-42d8-9eae-e21d2b47b09b)


## Deployment

To get this project up and running you need to have both NodeJs and mongoDB if you are using a local database installed and run the following command to install all the needed dependencies.

```bash
  npm i
```

* Make a cloudinary account if you don't have one already

* Enable App Password in your gmail account

* Make a .env file to include all the needed environment variables

* (Optional) for running on a local database simply paste the localhost link in the env variable. otherwise past the mongo atlas URL in the env variable.

Then, to start the project simply type.

```bash
  node index.js
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_LOCAL`

`PORT`

`SALT_ROUND`

`ENCRYPTION_KEY`

`TOKEN_SIGNATURE`

`MOOD`

`BEARER_KEY`

`gmail`

`gmailPass`

`outlookEmail`

`outlookPassword`

`facebookLink`

`instegram`

`twitterLink`

`logo`

`cloud_name`

`api_key`

`api_secret`

`STRIPE_SECRET_KEY`

`END_POINT_SECRET`


# Netlify functions using express and cors

This project is using express and cors for netlify functions and solves the issue of netlify and cors. 

Because there is a bug using the "netlify-lambda serve functions" (it won't find any modules to build) you need to build the functions before serving with "netlify dev".
This process is covered by the start script:

```
yarn start
```

If you deploy the functions with your project to netlify you can add the build command for the functions:

```
yarn build
```

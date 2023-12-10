export default ({ env }) => ({
  //
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: "strapi-provider-plugin-mandrill",
      providerOptions: {
        apiKey: env("MANDRILL_API_KEY"),
      },
      settings: {
        defaultFrom: "contact@email.com",
        defaultName: "Test",
        defaultReplyTo: "test@email.com",
        defaultHtml: "Test",
        defaultText: "Test",
      },
    },
  },
  "webthree-auth": {
    enabled: true,
    resolve: "./src/plugins/webthree-auth", // path to plugin folder
  },
});

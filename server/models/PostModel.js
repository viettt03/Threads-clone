const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    user: {
      type: Object,
    },
    likes: [
      {
        userName: {
          type: String,
        },
        userId: {
          type: String,
        },
        userAvatar: {
          type: String,
        },
      },
    ],
    replies: [
      {
        user: {
          type: Object,
        },
        title: {
          type: String,
        },
        image: {
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: [
          {
            userName: {
              type: String,
            },
            userId: {
              type: String,
            },
            userAvatar: {
              type: String,
            },
          },
        ],
        reply: [
          {
            user: {
              type: Object,
            },
            title: {
              type: String,
            },
            image: {
              public_id: {
                type: String,
              },
              url: {
                type: String,
              },
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
            likes: [
              {
                userName: {
                  type: String,
                },
                userId: {
                  type: String,
                },
                userAvatar: {
                  type: String,
                },
              }]
          }
        ]
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

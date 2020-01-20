# whisperbot
a Slack bot to interact with Intercom for myself 📞:robot:

<img src='https://user-images.githubusercontent.com/870741/72726798-aa045800-3bcc-11ea-983f-f5a66bb4b680.png' width='250px'>

## Deployment
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Intercom Apps

This app use these webhook topics.

- conversation.user.replied
- conversation.user.created
- conversation.admin.replied
- conversation.admin.closed
- conversation.admin.noted

And `https://whisperbot.example.com/intercom` is webhook endpoint.

### Slack App

This app require BotToken, and these settings.

- Event Subscriptions
  - Set `https://whisperbot.example.com/slack/events` to Request URL
  - Subscirbe `app_mention`, `message.channels`, `message.groups`, `message.im`, and `message.mpim`
- Interactive Components
  - Set `https://whisperbot.example.com/slack/events` to Request URL
- Slash Commands
  - Set `https://whisperbot.example.com/slack/events` to each Request URL
  1. `/whisperbot-link`
  2. `/whisperbot-status`


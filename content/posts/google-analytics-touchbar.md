---
title: 'How I added Google Analytics real-time visitors to my MacBook Touchbar'
date: '2021-06-03T00:00:00.322Z'
excerpt: 'A couple of weeks ago I remembered it would be cool to see the real-time visitors of my website directly on my MacBook Pro Touch Bar, so I decided to do it.'
image: '/static/images/touchbar.jpg'
---

A couple of weeks ago I remembered it would be super cool to have the real-time visitors of my website directly on my MacBook Pro Touch Bar, so I decided to do it.

## First step: the API

I used [Next.JS](https://nextjs.org/) to draft a simple API endpoint that gets the data from Google Analytics and replies in JSON with the data I want to consume on the Touch Bar, already in the correct structure.


``` js
const {google} = require('googleapis');
const key = require('./auth.json');

export default async (_, res) => {
  const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
  const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);
  const view_id = 'XXXXXXXX';

  process.env.GOOGLE_APPLICATION_CREDENTIALS = './auth.json';

  const analytics_res = await google.analytics('v3').data.realtime.get({
    auth: jwt,
    ids: 'ga:' + view_id,
    metrics: 'rt:activeUsers',
    dimensions: 'rt:medium',
    prettyPrint: true
  });
    
  res.status(200).json({
    realtime: analytics_res?.data?.totalsForAllResults?.['rt:activeUsers']
  });
}
```

To do this I used the `googleapis` package and created the credentials [here](https://console.developers.google.com/iam-admin/serviceaccounts). 


``` json
{
  "type": "service_account",
  "project_id": "<project_id>",
  "private_key_id": "<private_key_id>",
  "private_key": <private_key>,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "<client_x509_cert_url>"
}
```

If you have questions about Google APIs authentication, [this post](https://flaviocopes.com/google-api-authentication/) can be useful.

## Second step: Apple Script

I used a little tool called [JSON Helper](https://apps.apple.com/us/app/json-helper-for-applescript/id453114608) available in the Mac App Store for free and which allows to consume JSON files in Apple Scripts.

```
tell application "JSON Helper"
	set json to fetch JSON from "https://myapi.com/api/analytics"
	set users to realtime of json
  set final to "" & users & " users"
end tell
```

This script fetches the URL and prints the number to the screen with the word users.
## Third step: Adding to the Touch Bar

I've been using [MTMR](https://github.com/Toxblh/MTMR) (My Touchbar My Rules) to customize my Touch Bar. The application uses a JSON description file to add different buttons and informations to the Touch Bar. I used a block called `appleScriptTitledButton` which executes the Apple Script in the `source` attribute in an interval defined in the `refreshInterval` attribute. In this case, I used 10 seconds since the Google Analytics API has [some limits](https://developers.google.com/analytics/devguides/reporting/core/v3/limits-quotas). Also, when I click the button with the real-time users it automatically opens the Google Analytics website on my preferred browser.

```
{
    "type": "appleScriptTitledButton",
    "refreshInterval": 10,
    "source": {
      "filePath": "/Users/Shared/MTMR/analytics.scpt"
    },
    "align": "left",
    "width": 100,
    "bordered": false,
    "action": "openUrl",
    "url": "https://analytics.google.com/"
  },
```

If you have any question let me know on [Twitter](https://twitter.com/rgllm).
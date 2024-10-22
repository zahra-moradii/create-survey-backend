# Push Notification

headers: 

```js

  const headers: {
    "Accept-Version": "1.0.0",
    "Content-Type": "application/json",
  },

```

**Notificationcenter/subscribe example**:

For subscribing the client.

```js

const body = {
  clientId: 'string(objectId)',
  endpoint: 'string',
  keys: {
    auth: 'string',
    p256dh: 'string',
  },
};

fetch('/notificationcenter/subscribe', {
  headers: {
    'Accept-Version': '1.0.0',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

```

**notificationcenter/send**:

For send notification to all the subscribers

```js

fetch('/notificationcenter/send',{
    headers,
    method:"POST",
    body: JSON.stringify({
    "title": "Hello World!",
    "body": "body",
    "icon": "icon"
    })
})

```

**/notificationcenter/sendto**:

To send to an array of subscribers;


```js

fetch('/notificationcenter/sendto',{
    headers,
    method:"POST",
    body: JSON.stringify({
    "info":{
        "title":"title",
        "body":"body",
        "icon":"icon"
    },
   "clientIds": [
            "620777f5847d8940ba6f26e0",
            "620771c8f5909fb14c880114"
        ]
    })
})

```

**Notificationcenter/desubscribe example**:

For desubcribe the client

```js

const body = {
  clientId: 'string(objectId)',
};

fetch('/notificationcenter/subscribe', {
  headers: {
    'Accept-Version': '1.0.0',
    'Content-Type': 'application-json',
  },
  body: JSON.stringify(body),
});

```

# Verification

**Verification with email** <a id='verification-email'>

Sends a verification code with email

example code:

```js

const body = {
  email: 'your.email@example.com',
};

cosnt res = await fetch('/verification/email', {
  headers,
  method:"POSt",
  body: JSON.stringify(body);
});

const {expire}= await res.json();

```

**Verify email code**

If that code is valid it returns true, otherwise it returns false

example code:

```js

const body = {
  email: 'The email for which the code was sent',
  code: 'the code',
};

fetch('/verification/email/verify', {
  headers,
  method: 'POSt',
  body: JSON.stringify(body),
});

```

**Verification with sms**

Sends a verification code with sms

example code:

```js

const body = {
  mobileNo: 'mobile number',
};

cosnt res = await fetch('/verification/sms', {
  headers,
  method:"POST",
  body: JSON.stringify(body);
});

const {expire}= await res.json();

```

**Verify sms code**

If that code is valid it returns true, otherwise it returns false

example code:

```js

const body = {
  mobileNo: 'The number for which the code was sent',
  code: 'the code',
};

fetch('/verification/sms/verify', {
  headers,
  method: 'POSt',
  body: JSON.stringify(body),
});

```

# Campaign

**/campaign**

This route is used to create a campaign

> If a campaign with the same campaignName, users and profiles exists in database
> it returns response with 403 statusCode

typeof formats = 'email','sms','notificationcenter  '

```js

fetch('/campaign',{
    headers,
    method: "POST",
    body: JSON.stringify({
        "campaignName":"c1",
        "profiles":"profileId",
        "users":"userId",
        "receivers":["t@t.c"],
        "format":"email",
        "startDate":"10-10-2010",
        "endDate": "10-10-2020"
    })
})

```

**/campaign**

To delete a campaign

```js

fetch('/campaign',{
    headers,
    method: "DELETE",
    body: JSON.stringify(
        {
            "_id":"campaignId"
        }
    )
});

```


**monitoring**

First install prometheus  then config prometheus.yml

```yml

# my global config
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    metrics_path: '/monitoring/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ["localhost:14001"]


```

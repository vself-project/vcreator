# Sevice accounts for firebase have to bee activated in the firebase console

```
gcloud auth activate-service-account --key-file=.service_accounts/meself-6873d-firebase-adminsdk-uxh2j-0ca5af6eb9.json
```

# Secrets have to be added to the .env file  and cloud
```
firebase apphosting:secrets:access privateKey
```

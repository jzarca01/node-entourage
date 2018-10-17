# node-entourage

Une API pour Entourage

## Usage

```javascript
const Entourage = require('node-entourage');
const entourage = new Entourage({
  apiKey: ''
});
```

### Authentification

```javascript
entourage.login(phoneNumber, code);
```

### Get feeds

```javascript
entourage.getFeeds({latitude, longitude}, distance = 10, before = moment().format('YYYY-MM-DD HH:mm:ss ZZ'))
```

### Get feeds by type

```javascript
entourage.getFeedsByType(type, {latitude, longitude}, distance = 10, before = moment().format('YYYY-MM-DD HH:mm:ss ZZ'))
type = 'ask_for_help' | 'contribution'
```